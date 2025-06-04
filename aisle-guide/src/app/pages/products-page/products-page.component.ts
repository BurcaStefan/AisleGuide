import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { AdminHeaderComponent } from '../../components/layout/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../components/layout/admin-footer/admin-footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
  imports: [
    AdminHeaderComponent,
    AdminFooterComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class ProductsPageComponent implements OnInit {
  allProducts: any[] = [];
  displayedProducts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  hasNextPage: boolean = false;

  filterForm: FormGroup;
  showFilterForm: boolean = false;

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
    'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8',
    'B1', 'B2', 'B3',
    'C1', 'C2', 'C3', 'C4', 'C5',
    'D1', 'D2', 'D3', 'D4', 'D5',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8',
    'G1', 'G2', 'G3', 'G4',
    'H1', 'H2', 'H3', 'H4',
    'I1', 'I2', 'I3', 'I4',
    'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9',
    'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8',
    'O1', 'O2', 'O3', 'O4', 'O5',
    'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7',
    'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8',
  ];

  Math = Math;

  constructor(
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder
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
    const filters = {
      pageNumber: this.currentPage,
      pageSize: this.itemsPerPage,
      name: this.filterForm.value.name,
      category: this.filterForm.value.category,
      isbn: this.filterForm.value.isbn,
      shelvingUnit: this.filterForm.value.shelvingUnit,
      sortBy: this.filterForm.value.sortBy,
    };

    this.productService.getProductsPaginatedByFilter(filters).subscribe({
      next: (response: any) => {
        this.displayedProducts = response.data;

        this.checkNextPage(filters);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }

  checkNextPage(currentFilters: any): void {
    const nextPageFilters = {
      ...currentFilters,
      pageNumber: this.currentPage + 1,
    };

    this.productService
      .getProductsPaginatedByFilter(nextPageFilters)
      .subscribe({
        next: (response: any) => {
          this.hasNextPage = response.data && response.data.length > 0;
        },
        error: (error) => {
          this.hasNextPage = false;
          console.error('Error checking next page:', error);
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
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  viewProductDetails(productId: string): void {
    this.router.navigate(['/details', productId]);
  }
}
