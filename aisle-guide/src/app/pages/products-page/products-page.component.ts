import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { FavoriteService } from '../../services/favorite/favorite.service';
import { AdminHeaderComponent } from '../../components/layout/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../components/layout/admin-footer/admin-footer.component';
import { ClientFooterComponent } from '../../components/layout/client-footer/client-footer.component';
import { ClientHeaderComponent } from '../../components/layout/client-header/client-header.component';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { ImageService } from '../../services/image/image.service';
import { CloudinaryService } from '../../services/cloudinary/cloudinary.service';
import { Image } from '../../models/image.model';

@Component({
  selector: 'app-products-page',
  standalone: true,
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
  imports: [
    AdminHeaderComponent,
    AdminFooterComponent,
    ClientHeaderComponent,
    ClientFooterComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class ProductsPageComponent implements OnInit {
  displayedProducts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  hasNextPage: boolean = false;
  filterForm: FormGroup;
  showFilterForm: boolean = false;
  isAdmin: boolean = false;
  isLoading: boolean = false;
  favoriteProductIds: Set<string> = new Set();
  productImages: { [key: string]: string } = {};
  defaultImageUrl: string =
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80';

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

  constructor(
    private productService: ProductService,
    private favoriteService: FavoriteService,
    private router: Router,
    private fb: FormBuilder,
    private imageService: ImageService,
    private cloudinaryService: CloudinaryService
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
    this.checkUserRole();
    this.loadProducts();
    if (!this.isAdmin) {
      this.loadUserFavorites();
    }
  }

  private checkUserRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.isAdmin =
          decodedToken.IsAdmin === 'True' || decodedToken.IsAdmin === true;
      } catch (error) {
        console.error('Error decoding token:', error);
        this.isAdmin = false;
      }
    } else {
      this.isAdmin = false;
    }
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
        this.displayedProducts = response.data || response || [];
        this.loadProductImages();

        if (this.displayedProducts.length < this.itemsPerPage) {
          this.hasNextPage = false;
          this.isLoading = false;
        } else {
          this.checkIfNextPageExists(filters);
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

  private loadProductImages(): void {
    this.displayedProducts.forEach((product) => {
      this.imageService.getImageByEntityId(product.id).subscribe({
        next: (image: Image) => {
          if (image) {
            this.productImages[product.id] =
              this.cloudinaryService.getOptimizedImageUrl(image);
          }
        },
        error: (error) => {
        },
      });
    });
  }

  getProductImageUrl(productId: string): string {
    return this.productImages[productId] || this.defaultImageUrl;
  }

  handleImageError(productId: string): void {
    this.productImages[productId] = this.defaultImageUrl;
  }

  private checkIfNextPageExists(currentFilters: any): void {
    const nextPageFilters = {
      ...currentFilters,
      pageNumber: this.currentPage + 1,
    };

    this.productService
      .getProductsPaginatedByFilter(nextPageFilters)
      .subscribe({
        next: (response: any) => {
          const nextPageData = response.data || response || [];
          this.hasNextPage = nextPageData.length > 0;
          this.isLoading = false;
        },
        error: (error) => {
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

  toggleFavorite(productId: string): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.unique_name || payload.sub;
    if (!userId) return;

    if (this.favoriteProductIds.has(productId)) {
      this.favoriteService.deleteFavorite(userId, productId).subscribe({
        next: () => {
          this.favoriteProductIds.delete(productId);
        },
        error: (error) => {
          console.error('Error removing from favorites:', error);
        },
      });
    } else {
      this.favoriteService.createFavorite(userId, productId).subscribe({
        next: () => {
          this.favoriteProductIds.add(productId);
        },
        error: (error) => {
          console.error('Error adding to favorites:', error);
        },
      });
    }
  }

  isFavorite(productId: string): boolean {
    return this.favoriteProductIds.has(productId);
  }

  private loadUserFavorites(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.unique_name || payload.sub;
    if (!userId) return;

    this.favoriteService
      .getFavoriteProductsByUserId(userId, 1, 1000)
      .subscribe({
        next: (favorites) => {
          this.favoriteProductIds = new Set(
            favorites.map((fav) => fav.productId)
          );
        },
        error: (error) => {
          console.error('Error loading user favorites:', error);
        },
      });
  }
}
