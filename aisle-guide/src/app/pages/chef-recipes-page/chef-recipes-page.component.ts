import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClientHeaderComponent } from '../../components/layout/client-header/client-header.component';
import { ClientFooterComponent } from '../../components/layout/client-footer/client-footer.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { RecipeService } from '../../services/recipe/recipe.service';
import { ShoppingItem } from '../../models/shoppingitem.model';
import { HttpClient } from '@angular/common/http';
import { RecipeResponseDto } from '../../models/recipe.model';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ProductDialogComponent } from '../../components/product/product-dialog/product-dialog.component';

interface Recipe {
  ingredients: string[];
  additionalIngredients: string[];
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
    DialogModule,
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

  ingredientsList: ShoppingItem[] = [];
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
    private recipeService: RecipeService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: Dialog
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

  startNewRecipe(): void {
    this.ingredientsList = [];
    this.generatedRecipe = null;
    this.isGeneratingRecipe = false;
  }

  openProductsDialog() {
    const addProductCallback = (product: any) => {
      this.addToCart(product, new Event('dialog-add'));
    };

    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'centered-dialog',
      hasBackdrop: true,
      data: { addProductCallback },
    });

    dialogRef.closed.subscribe((result: any) => {
      if (result && result.action === 'add') {
        this.addToCart(result.product, new Event('dialog-add'));
      }
    });
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

    const existingProduct = this.ingredientsList.find(
      (p) => p.id === product.id
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.ingredientsList.push({
        ...product,
        quantity: 1,
        collected: false,
      });
    }
  }

  removeFromCart(productId: string): void {
    const index = this.ingredientsList.findIndex((p) => p.id === productId);
    if (index >= 0) {
      const product = this.ingredientsList[index];

      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        this.ingredientsList.splice(index, 1);
      }
    }

    if (this.ingredientsList.length === 0) {
      this.generatedRecipe = null;
    }
  }

  getTotalItems(): number {
    return this.ingredientsList.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  getTotalPrice(): number {
    return this.ingredientsList.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  generateRecipe(): void {
    this.isGeneratingRecipe = true;
    this.generatedRecipe = null;

    const productNamesString = this.ingredientsList
      .map((item) => item.name)
      .join(',');

    this.recipeService.generateRecipe(productNamesString).subscribe({
      next: (response: RecipeResponseDto) => {
        this.generatedRecipe = {
          ingredients: response.ingredients,
          additionalIngredients: response.additionalIngredients,
          steps: response.steps,
        };
        this.isGeneratingRecipe = false;
      },
      error: (error) => {
        console.error('Error generating recipe:', error);
        alert('Failed to generate recipe. Please try again.');
        this.isGeneratingRecipe = false;
      },
    });
  }
}
