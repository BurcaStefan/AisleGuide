import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../components/layout/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../components/layout/admin-footer/admin-footer.component';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

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

  constructor(private productService: ProductService) {}

  loadProductsByUnit(unitCode: string): void {
    this.isLoading = true;
    this.selectedUnit = unitCode;
    this.error = null;

    const queryParams = {
      pageNumber: 1,
      pageSize: 5,
      shelvingUnit: unitCode,
    };

    this.productService.getProductsPaginatedByFilter(queryParams).subscribe({
      next: (response: any) => {
        this.products = response.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Unable to load products. Please try again.';
        this.isLoading = false;
      },
    });
  }
}
