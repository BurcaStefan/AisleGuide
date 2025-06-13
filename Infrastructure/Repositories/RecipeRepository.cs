using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using System.Text;

namespace Infrastructure.Repositories
{
    public class RecipeRepository : IRecipeRepository
    {
        private readonly HttpClient httpClient;
        private readonly string openRouterApiKey;

        public RecipeRepository(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            httpClient = httpClientFactory.CreateClient();
            openRouterApiKey = configuration["OpenRouter:ApiKey"];
        }

        public async Task<Result<RecipeResponse>> GenerateRecipeAsync(string ingredients, CancellationToken cancellationToken)
        {
            var url = "https://openrouter.ai/api/v1/chat/completions";

            var payload = new
            {
                model = "deepseek/deepseek-r1-0528:free",
                messages = new[]
                {
                    new
                    {
                        role = "user",
                        content = $"Generate a recipe using some of these ingredients: {ingredients}. " +
                                 $"You do not have to use all of them. " +
                                 $"Also, add up to 2-3 additional products (only if you can't cook with just the given ingredients) that are not in the given list and use them in the recipe. " +
                                 $"Respond ONLY with a JSON object containing three lists: " +
                                 $"'ingredients' (the list of given ingredients you used and de quantity), " +
                                 $"'additionalIngredients' (the list of extra products you added), " +
                                 $"'steps' (the preparation steps). " +
                                 $"Do not include anything else in your response except the JSON object. " +
                                 $"Example response: " +
                                 $"{{ " +
                                 $"\"ingredients\": [\"chicken breast 200g\", \"potatoes 200g\", \"garlic 1 piece\"], " +
                                 $"\"additionalIngredients\": [\"olive oil 20ml\", \"thyme\"], " +
                                 $"\"steps\": [\"Preheat the oven to 200°C.\", \"Season the chicken breast with salt and thyme.\", \"Place potatoes and garlic in a baking tray, drizzle with olive oil.\", \"Add the chicken breast and bake for 30 minutes.\"] " +
                                 $"}}"
                    }
                },
                response_format = new
                {
                    type = "json_object"
                },
                max_tokens = 500
            };

            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, url);
            requestMessage.Headers.Add("Authorization", $"Bearer {openRouterApiKey}");
            requestMessage.Headers.Add("HTTP-Referer", "https://aisleguide.com");
            requestMessage.Headers.Add("X-Title", "AisleGuide Recipe Generator");

            requestMessage.Content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json"
            );

            var response = await httpClient.SendAsync(requestMessage, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                return Result<RecipeResponse>.Failure($"Error from OpenRouter API: {response.StatusCode}. Details: {errorContent}");
            }

            var content = await response.Content.ReadAsStringAsync(cancellationToken);

            try
            {
                using JsonDocument document = JsonDocument.Parse(content);
                var root = document.RootElement;

                if (!root.TryGetProperty("choices", out var choices) ||
                    choices.GetArrayLength() == 0 ||
                    !choices[0].TryGetProperty("message", out var message) ||
                    !message.TryGetProperty("content", out var contentElement))
                {
                    return Result<RecipeResponse>.Failure($"Invalid response format from OpenRouter API. Response: {content}");
                }

                var responseText = contentElement.GetString();
                if (responseText == null)
                {
                    return Result<RecipeResponse>.Failure("OpenRouter API returned null response text");
                }

                var jsonStart = responseText.IndexOf('{');
                var jsonEnd = responseText.LastIndexOf('}');

                if (jsonStart == -1 || jsonEnd == -1 || jsonStart > jsonEnd)
                {
                    return Result<RecipeResponse>.Failure("Could not find valid JSON in response");
                }

                var jsonText = responseText.Substring(jsonStart, jsonEnd - jsonStart + 1);
                jsonText = jsonText.Replace("\n", "").Replace("\r", "").Trim();

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var tempResponse = JsonSerializer.Deserialize<RecipeResponse>(jsonText, options);

                if (tempResponse == null)
                {
                    return Result<RecipeResponse>.Failure("Failed to deserialize recipe response");
                }

                var domainResponse = new RecipeResponse
                {
                    Ingredients = tempResponse.Ingredients ?? new List<string>(),
                    AdditionalIngredients = tempResponse.AdditionalIngredients ?? new List<string>(),
                    Steps = tempResponse.Steps ?? new List<string>()
                };

                return Result<RecipeResponse>.Success(domainResponse);
            }
            catch (Exception ex)
            {
                var errorMsg = ex.Message;
                if (ex.InnerException != null)
                {
                    errorMsg += " | InnerException: " + ex.InnerException.Message;
                }
                return Result<RecipeResponse>.Failure($"Error processing OpenRouter API response: {errorMsg}");
            }
        }
    }
}