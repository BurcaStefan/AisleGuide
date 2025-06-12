export interface RecipeRequestDto {
  ingredients: string[];
}

export interface RecipeResponseDto {
  ingredients: string[];
  additionalIngredients: string[];
  steps: string[];
}
