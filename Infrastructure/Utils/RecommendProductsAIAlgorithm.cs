using Domain.Entities;

namespace Infrastructure.Utils
{
    public class RecommendProductsAIAlgorithm
    {
        public static List<Product> Recommend(Product[] favorites, Product[] candidates, int topN = 20)
        {
            var favByCat = favorites
                .GroupBy(f => f.Category)
                .ToDictionary(g => g.Key, g => g.ToList());

            int totalFavs = favorites.Length;

            var categoryPortions = favByCat
                .ToDictionary(
                    kv => kv.Key,
                    kv => (int)Math.Round(topN * (double)kv.Value.Count / totalFavs)
                );

            var scoresPerCategory = new Dictionary<string, List<(Product prod, double score)>>();

            foreach (var (category, favList) in favByCat)
            {
                var candidatesInCategory = candidates.Where(c => c.Category == category).ToList();
                var scoredCandidates = new Dictionary<Guid, (Product prod, double score)>();

                foreach (var fav in favList)
                {
                    foreach (var cand in candidatesInCategory)
                    {
                        if (fav.Id == cand.Id) continue;

                        double sim = CosineSimilarity(ToVector(cand), ToVector(fav));

                        if (!scoredCandidates.TryGetValue(cand.Id, out var existing) || sim > existing.score)
                        {
                            scoredCandidates[cand.Id] = (cand, sim);
                        }
                    }
                }

                var topScored = scoredCandidates.Values
                    .OrderByDescending(x => x.score)
                    .Take(categoryPortions.GetValueOrDefault(category, 0))
                    .ToList();

                scoresPerCategory[category] = topScored;
            }

            var finalProducts = scoresPerCategory
                .SelectMany(x => x.Value)
                .GroupBy(x => x.prod.Id)
                .Select(g => g.First().prod)
                .Take(topN)
                .ToList();

            return finalProducts;
        }

        private static double[] ToVector(Product p) => new double[] {
            p.Calories, p.Protein, p.Carbohydrates, p.Sugars,
            p.Fat, p.SaturatedFat, p.Fiber, p.Salt, p.Cholesterol
        };

        private static double CosineSimilarity(double[] a, double[] b)
        {
            double dot = 0, magA = 0, magB = 0;
            for (int i = 0; i < a.Length; i++)
            {
                dot += a[i] * b[i];
                magA += a[i] * a[i];
                magB += b[i] * b[i];
            }
            return (magA == 0 || magB == 0) ? 0 : dot / (Math.Sqrt(magA) * Math.Sqrt(magB));
        }
    }
}
