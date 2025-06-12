import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecipeRequestDto, RecipeResponseDto } from '../../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipeUrl = 'http://localhost:5045/api/Recipe';

  constructor(private http: HttpClient) {}

  generateRecipe(ingredients: string[]): Observable<RecipeResponseDto> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const request: RecipeRequestDto = {
      ingredients: ingredients,
    };

    return this.http.post<RecipeResponseDto>(
      `${this.recipeUrl}/generate-recipe`,
      request,
      { headers }
    );
  }
}
