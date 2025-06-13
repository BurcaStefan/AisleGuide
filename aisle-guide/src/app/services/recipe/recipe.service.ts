import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecipeRequestDto, RecipeResponseDto } from '../../models/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipeUrl = 'http://localhost:5045/api/Recipe';

  constructor(private http: HttpClient, private authService: AuthService) {}

  generateRecipe(ingredients: string): Observable<RecipeResponseDto> {
    const request: RecipeRequestDto = {
      ingredients,
    };

    return this.http.post<RecipeResponseDto>(
      `${this.recipeUrl}/generate-recipe`,
      request,
      { headers: this.authService.getHeaders() }
    );
  }
}
