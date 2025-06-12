export interface RecipeRequestDto {
  ingredients: string[];
}

export interface RecipeResponseDto {
  ingredients: string[];
  steps: string[];
}
