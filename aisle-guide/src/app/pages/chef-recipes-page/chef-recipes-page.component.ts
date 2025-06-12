import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClientHeaderComponent } from '../../components/layout/client-header/client-header.component';
import { ClientFooterComponent } from '../../components/layout/client-footer/client-footer.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { ShoppingItem } from '../../models/shoppingitem.model';
import { HttpClient } from '@angular/common/http';

interface Recipe {
  ingredients: string[];
  steps: string[];
}

@Component({
  selector: 'app-chef-recipes-page',
  standalone: true,
  imports: [
    ClientFooterComponent,
    ClientHeaderComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './chef-recipes-page.component.html',
  styleUrl: './chef-recipes-page.component.scss',
})
export class ChefRecipesPageComponent implements OnInit {
  displayedProducts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  hasNextPage: boolean = false;
  filterForm: FormGroup;
  showFilterForm: boolean = false;
  isLoading: boolean = false;
  Math = Math;

  shoppingList: ShoppingItem[] = [];
  generatedRecipe: Recipe | null = null;
  isGeneratingRecipe: boolean = false;

  categories: string[] = [
    'Alcohol',
    'Bakery',
    'Cold cuts',
    'Dairy',
    'Fruit',
    'Grains',
    'Hearbs',
    'Italian',
    'Meat',
    'Non-alcoholic drinks',
    'Offers',
    'Sweets',
    'Vegetables',
  ];

  shelvingUnits: string[] = [
    'A1',
    'A2',
    'A3',
    'A4',
    'A5',
    'A6',
    'A7',
    'A8',
    'B1',
    'B2',
    'B3',
    'C1',
    'C2',
    'C3',
    'C4',
    'C5',
    'D1',
    'D2',
    'D3',
    'D4',
    'D5',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'G1',
    'G2',
    'G3',
    'G4',
    'H1',
    'H2',
    'H3',
    'H4',
    'I1',
    'I2',
    'I3',
    'I4',
    'M1',
    'M2',
    'M3',
    'M4',
    'M5',
    'M6',
    'M7',
    'M8',
    'M9',
    'N1',
    'N2',
    'N3',
    'N4',
    'N5',
    'N6',
    'N7',
    'N8',
    'O1',
    'O2',
    'O3',
    'O4',
    'O5',
    'S1',
    'S2',
    'S3',
    'S4',
    'S5',
    'S6',
    'S7',
    'V1',
    'V2',
    'V3',
    'V4',
    'V5',
    'V6',
    'V7',
    'V8',
  ];

  constructor(
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.filterForm = this.fb.group({
      name: [''],
      category: [''],
      isbn: [''],
      shelvingUnit: [''],
      sortBy: [''],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    if (this.isLoading) return;
    this.isLoading = true;

    const filters = {
      pageNumber: this.currentPage,
      pageSize: this.itemsPerPage,
      name: this.filterForm.value.name || '',
      category: this.filterForm.value.category || '',
      isbn: this.filterForm.value.isbn || '',
      shelvingUnit: this.filterForm.value.shelvingUnit || '',
      sortBy: this.filterForm.value.sortBy || '',
    };

    this.productService.getProductsPaginatedByFilter(filters).subscribe({
      next: (response: any) => {
        const allProducts = response.data || response || [];
        this.displayedProducts = allProducts;

        if (allProducts.length === this.itemsPerPage) {
          this.checkNextPageAvailability();
        } else {
          this.hasNextPage = false;
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.displayedProducts = [];
        this.hasNextPage = false;
        this.isLoading = false;
      },
    });
  }

  private checkNextPageAvailability(): void {
    const nextPageFilters = {
      pageNumber: this.currentPage + 1,
      pageSize: 1,
      name: this.filterForm.value.name || '',
      category: this.filterForm.value.category || '',
      isbn: this.filterForm.value.isbn || '',
      shelvingUnit: this.filterForm.value.shelvingUnit || '',
      sortBy: this.filterForm.value.sortBy || '',
    };

    this.productService
      .getProductsPaginatedByFilter(nextPageFilters)
      .subscribe({
        next: (response: any) => {
          const nextPageProducts = response.data || response || [];
          this.hasNextPage = nextPageProducts.length > 0;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error checking next page:', error);
          this.hasNextPage = false;
          this.isLoading = false;
        },
      });
  }

  toggleFilterForm(): void {
    this.showFilterForm = !this.showFilterForm;
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  resetFilters(): void {
    this.filterForm.reset({
      name: '',
      category: '',
      isbn: '',
      shelvingUnit: '',
      sortBy: '',
    });
    this.currentPage = 1;
    this.loadProducts();
  }

  prevPage(): void {
    if (this.currentPage > 1 && !this.isLoading) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.hasNextPage && !this.isLoading) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  viewProductDetails(productId: string): void {
    this.router.navigate(['/details', productId]);
  }

  addToCart(product: any, event: Event): void {
    event.stopPropagation();

    const existingProduct = this.shoppingList.find((p) => p.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.shoppingList.push({
        ...product,
        quantity: 1,
        collected: false,
      });
    }
  }

  removeFromCart(productId: string): void {
    const index = this.shoppingList.findIndex((p) => p.id === productId);
    if (index >= 0) {
      const product = this.shoppingList[index];

      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        this.shoppingList.splice(index, 1);
      }
    }

    if (this.shoppingList.length === 0) {
      this.generatedRecipe = null;
    }
  }

  getTotalItems(): number {
    return this.shoppingList.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.shoppingList.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  async generateRecipe(): Promise<void> {
    if (this.shoppingList.length === 0) {
      alert('Please add some products to your shopping list first!');
      return;
    }

    this.isGeneratingRecipe = true;
    this.generatedRecipe = null;

    try {
      const productNames = this.shoppingList.map((item) => item.name);
      const prompt = `Create a recipe using these ingredients: ${productNames.join(
        ', '
      )}. 
      You can use most of these ingredients but don't need to use all of them. 
      You can also add 2-3 additional common ingredients if needed.
      
      Please format your response as JSON with this structure:
      {
        "ingredients": ["ingredient 1", "ingredient 2", ...],
        "steps": ["step 1", "step 2", ...]
      }
      
      Make sure the recipe is practical and delicious!`;

      const response = await this.http
        .post<any>('YOUR_GEMINI_API_ENDPOINT', {
          prompt: prompt,
        })
        .toPromise();

      this.generatedRecipe = this.parseGeminiResponse(response);
    } catch (error) {
      console.error('Error generating recipe:', error);
      alert('Failed to generate recipe. Please try again.');
    } finally {
      this.isGeneratingRecipe = false;
    }
  }

  private parseGeminiResponse(response: any): Recipe {
    try {
      if (response.ingredients && response.steps) {
        return response;
      }

      const text = response.text || response.content || response;
      const parsed = JSON.parse(text);

      return {
        ingredients: parsed.ingredients || [],
        steps: parsed.steps || [],
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return {
        ingredients: ['Error parsing ingredients'],
        steps: ['Error parsing recipe steps'],
      };
    }
  }
}
