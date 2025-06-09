import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClientHeaderComponent } from '../../components/layout/client-header/client-header.component';
import { ClientFooterComponent } from '../../components/layout/client-footer/client-footer.component';
import { CommonModule, Location } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { finalize, timeout, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
export class UserHomePageComponent implements OnInit, OnDestroy {
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
  private destroy$ = new Subject<void>();

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    // Anulăm orice cerere în curs înainte de a face una nouă
    this.destroy$.next();

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

    this.productService
      .getProductsPaginatedByFilter(filters)
      .pipe(
        takeUntil(this.destroy$), // Anulează cererea dacă destroy$ emite
        timeout(10000), // Timeout de 10 secunde pentru a evita blocajele
        catchError((error) => {
          console.error('Request timed out or errored', error);
          this.isLoading = false;
          return of({ data: [] }); // Returnăm un rezultat gol în caz de eroare
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          const allProducts = response.data || response || [];

          if (allProducts.length > this.itemsPerPage) {
            this.hasNextPage = true;
            this.displayedProducts = allProducts.slice(0, this.itemsPerPage);
          } else {
            this.hasNextPage = false;
            this.displayedProducts = allProducts;
          }
        },
        // Nu mai setăm isLoading=false aici deoarece este gestionat de finalize()
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

      try {
        this.loadProducts();
      } catch (error) {
        console.error('Error navigating to previous page:', error);
        this.forceRefresh();
      }
    }
  }

  nextPage(): void {
    if (this.hasNextPage && !this.isLoading) {
      this.currentPage++;

      try {
        this.loadProducts();
      } catch (error) {
        console.error('Error navigating to next page:', error);
        this.forceRefresh();
      }
    }
  }

  viewProductDetails(productId: string): void {
    this.router.navigate(['/details', productId]);
  }

  forceRefresh(): void {
    // Oprește orice cerere în curs
    this.destroy$.next();
    this.isLoading = false;

    // Resetează starea și reîncarcă produsele
    this.currentPage = 1;

    // Folosește Location service pentru a forța refresh-ul URL-ului actual
    this.location.go(this.location.path());

    // Dă un scurt timeout înainte de a reîncărca produsele
    setTimeout(() => {
      this.loadProducts();
    }, 100);
  }
}
