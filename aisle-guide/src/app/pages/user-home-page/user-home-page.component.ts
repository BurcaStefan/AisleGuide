import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClientHeaderComponent } from '../../components/layout/client-header/client-header.component';
import { ClientFooterComponent } from '../../components/layout/client-footer/client-footer.component';
import { CommonModule, Location } from '@angular/common';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-user-home-page',
  standalone: true,
  imports: [
    ClientHeaderComponent,
    ClientFooterComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-home-page.component.html',
  styleUrl: './user-home-page.component.scss',
})
export class UserHomePageComponent implements OnInit {
  rowIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  colIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  gridData = [
    ['', '', 'O1', 'O2', 'O3', 'O4', 'O5', 'M1', 'M2', 'M3', 'M4', 'M5', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', 'C5'],
    ['', '', 'G1', 'G2', 'G3', 'G4', '', 'M6', 'M7', 'M8', 'M9', '', 'C4'],
    ['', '', 'N1', 'N2', 'N3', 'N4', '', 'A1', 'A2', 'A3', 'A4', '', 'C3'],
    ['', '', '', '', '', '', '', '', '', '', '', '', 'C2'],
    ['', '', 'N5', 'N6', 'N7', 'N8', '', 'A5', 'A6', 'A7', 'A8', '', 'C1'],
    ['', '', 'H1', 'H2', 'H3', 'H4', '', 'I1', 'I2', 'I3', 'I4', '', 'D5'],
    ['', '', '', '', '', '', '', '', '', '', '', '', 'D4'],
    ['', '', 'F1', 'F2', 'F3', 'F4', '', 'V1', 'V2', 'V3', 'V4', '', 'D3'],
    ['', '', 'F5', 'F6', 'F7', 'F8', '', 'V5', 'V6', 'V7', 'V8', '', 'D2'],
    ['➔', '', '', '', '', '', '', '', '', '', '', '', 'D1'],
    ['', '', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'B1', 'B2', 'B3', ''],
  ];

  displayedProducts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  hasNextPage: boolean = false;
  filterForm: FormGroup;
  showFilterForm: boolean = false;
  isLoading: boolean = false;

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

  Math = Math;
  shoppingList: any[] = [];
  highlightedUnits: Set<string> = new Set<string>();

  constructor(
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder,
    private location: Location
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
      pageSize: this.itemsPerPage + 1,
      name: this.filterForm.value.name || '',
      category: this.filterForm.value.category || '',
      isbn: this.filterForm.value.isbn || '',
      shelvingUnit: this.filterForm.value.shelvingUnit || '',
      sortBy: this.filterForm.value.sortBy || '',
    };

    this.productService.getProductsPaginatedByFilter(filters).subscribe({
      next: (response: any) => {
        const allProducts = response.data || response || [];

        if (allProducts.length > this.itemsPerPage) {
          this.hasNextPage = true;
          this.displayedProducts = allProducts.slice(0, this.itemsPerPage);
        } else {
          this.hasNextPage = false;
          this.displayedProducts = allProducts;
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.displayedProducts = [];
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
    event.stopPropagation(); // Previne click-ul pe produs

    const existingProduct = this.shoppingList.find((p) => p.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.shoppingList.push({
        ...product,
        quantity: 1,
      });
    }

    if (product.shelvingUnit) {
      this.highlightedUnits.add(product.shelvingUnit);
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

        if (product.shelvingUnit) {
          const stillExists = this.shoppingList.some(
            (p) => p.shelvingUnit === product.shelvingUnit
          );
          if (!stillExists) {
            this.highlightedUnits.delete(product.shelvingUnit);
          }
        }
      }
    }
  }

  isUnitHighlighted(unit: string): boolean {
    return this.highlightedUnits.has(unit);
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
}
