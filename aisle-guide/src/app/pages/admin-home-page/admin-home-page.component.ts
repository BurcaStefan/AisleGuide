import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../components/layout/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../components/layout/admin-footer/admin-footer.component';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home-page',
  imports: [
    AdminHeaderComponent,
    AdminFooterComponent,
    CommonModule,
    CurrencyPipe,
  ],
  templateUrl: './admin-home-page.component.html',
  styleUrl: './admin-home-page.component.scss',
})
export class AdminHomePageComponent {
  rowIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  colIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  gridData = [
    ['', '', 'O1', 'O2', 'O3', 'O4', 'O5', 'M1', 'M2', 'M3', 'M4', 'M5', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', 'C5'],
    ['', '', 'G1', 'G2', 'G3', 'G4', '', 'M5', 'M6', 'M7', 'M8', '', 'C4'],
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

  products: Product[] = [];
  selectedUnit: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  currentPage: number = 1;
  pageSize: number = 5;
  totalCount: number = 0;
  totalPages: number = 0;

  hasNextPage: boolean = false;

  loadProductsByUnit(unitCode: string, page: number = 1): void {
    this.isLoading = true;
    this.selectedUnit = unitCode;
    this.error = null;
    this.currentPage = page;

    const queryParams = {
      pageNumber: page,
      pageSize: this.pageSize,
      shelvingUnit: unitCode,
    };

    this.productService.getProductsPaginatedByFilter(queryParams).subscribe({
      next: (response: any) => {
        this.products = response.data || [];
        this.totalCount = response.totalCount || 0;
        this.checkNextPage(unitCode, page + 1);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Unable to load products. Please try again.';
        this.isLoading = false;
        this.hasNextPage = false;
      },
    });
  }

  checkNextPage(unitCode: string, nextPage: number): void {
    const nextPageParams = {
      pageNumber: nextPage,
      pageSize: this.pageSize,
      shelvingUnit: unitCode,
    };

    this.productService.getProductsPaginatedByFilter(nextPageParams).subscribe({
      next: (response: any) => {
        this.hasNextPage = response.data && response.data.length > 0;
      },
      error: () => {
        this.hasNextPage = false;
      },
    });
  }

  goToNextPage(): void {
    if (this.hasNextPage) {
      this.loadProductsByUnit(this.selectedUnit, this.currentPage + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.loadProductsByUnit(this.selectedUnit, this.currentPage - 1);
    }
  }

  removeProductFromShelf(productId: string): void {
    const productToUpdate = this.products.find((p) => p.id === productId);

    if (!productToUpdate) {
      this.error = 'Product not found';
      return;
    }

    const updatedProduct = { ...productToUpdate, shelvingUnit: '' };

    this.isLoading = true;

    this.productService.updateProduct(productId, updatedProduct).subscribe({
      next: (result: boolean) => {
        this.isLoading = false;

        if (result) {
          this.loadProductsByUnit(this.selectedUnit, this.currentPage);
        } else {
          this.error = 'Failed to remove product from shelf';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error removing product:', err);

        if (err.status === 401) {
          this.error = 'Your session has expired. Please log in again.';
        } else if (err.status === 403) {
          this.error =
            "You don't have permission to remove products. Admin access required.";
        } else {
          this.error = 'Error removing product. Please try again.';
        }
      },
    });
  }

  viewProductDetails(productId: string): void {
    this.router.navigate(['/details', productId]);
  }
}
