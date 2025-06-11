import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientFooterComponent } from '../../components/layout/client-footer/client-footer.component';
import { ClientHeaderComponent } from '../../components/layout/client-header/client-header.component';
import { Product } from '../../models/product.model';
import { FavoriteService } from '../../services/favorite/favorite.service';
import { ProductService } from '../../services/product/product.service';
import { Favorite } from '../../models/favorite.model';

@Component({
  selector: 'app-suggested-items-page',
  standalone: true,
  imports: [CommonModule, ClientFooterComponent, ClientHeaderComponent],
  templateUrl: './suggested-items-page.component.html',
  styleUrl: './suggested-items-page.component.scss',
})
export class SuggestedItemsPageComponent implements OnInit {
  recommendedProducts: Product[] = [];
  favoriteCurrentPage: number = 1;
  favoritePageSize: number = 5;
  favoriteHasNextPage: boolean = false;
  favoriteLoading: boolean = false;

  suggestedProducts: Product[] = [];
  allSuggestedProducts: Product[] = [];
  suggestedCurrentPage: number = 1;
  suggestedPageSize: number = 5;
  suggestedTotalPages: number = 0;
  suggestedLoading: boolean = false;

  favoriteProductIds: Set<string> = new Set();

  isLoading: boolean = false;
  error: string = '';
  Math = Math;

  constructor(
    private router: Router,
    private favoriteService: FavoriteService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadRecommendedProducts();
    this.loadSuggestedProducts();
  }

  loadRecommendedProducts(): void {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    this.favoriteLoading = true;
    this.favoriteService
      .getFavoriteProductsByUserId(
        userId,
        this.favoriteCurrentPage,
        this.favoritePageSize
      )
      .subscribe({
        next: (favorites: Favorite[]) => {
          if (favorites && favorites.length > 0) {
            const productIds = favorites.map((fav) => fav.productId);
            this.loadProductsByIds(productIds);
            this.favoriteProductIds = new Set(productIds);

            this.checkFavoriteNextPage(userId);
          } else {
            this.recommendedProducts = [];
            this.favoriteHasNextPage = false;
          }
          this.favoriteLoading = false;
        },
        error: (error) => {
          console.error('Error loading favorites:', error);
          this.favoriteLoading = false;
          this.recommendedProducts = [];
          this.favoriteHasNextPage = false;
        },
      });
  }

  private checkFavoriteNextPage(userId: string): void {
    this.favoriteService
      .getFavoriteProductsByUserId(
        userId,
        this.favoriteCurrentPage + 1,
        this.favoritePageSize
      )
      .subscribe({
        next: (nextPageFavorites: Favorite[]) => {
          this.favoriteHasNextPage =
            nextPageFavorites && nextPageFavorites.length > 0;
        },
        error: () => {
          this.favoriteHasNextPage = false;
        },
      });
  }

  private loadProductsByIds(productIds: string[]): void {
    const productPromises = productIds.map((id) =>
      this.productService.getProductById(id).toPromise()
    );

    Promise.all(productPromises)
      .then((products) => {
        this.recommendedProducts = products.filter(
          (p) => p !== undefined
        ) as Product[];
      })
      .catch((error) => {
        console.error('Error loading products:', error);
        this.recommendedProducts = [];
      });
  }

  loadSuggestedProducts(): void {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    this.suggestedLoading = true;
    this.productService.getRecommendedProducts(userId, 20).subscribe({
      next: (products: Product[]) => {
        this.allSuggestedProducts = products || [];
        this.suggestedTotalPages = Math.ceil(
          this.allSuggestedProducts.length / this.suggestedPageSize
        );
        this.updateSuggestedProductsPage();
        this.suggestedLoading = false;
      },
      error: (error) => {
        console.error('Error loading suggested products:', error);
        this.suggestedLoading = false;
        this.allSuggestedProducts = [];
        this.suggestedProducts = [];
        this.suggestedTotalPages = 0;
      },
    });
  }

  private updateSuggestedProductsPage(): void {
    const startIndex = (this.suggestedCurrentPage - 1) * this.suggestedPageSize;
    const endIndex = startIndex + this.suggestedPageSize;
    this.suggestedProducts = this.allSuggestedProducts.slice(
      startIndex,
      endIndex
    );
  }

  favoriteNextPage(): void {
    if (this.favoriteHasNextPage && !this.favoriteLoading) {
      this.favoriteCurrentPage++;
      this.loadRecommendedProducts();
    }
  }

  favoritePrevPage(): void {
    if (this.favoriteCurrentPage > 1 && !this.favoriteLoading) {
      this.favoriteCurrentPage--;
      this.loadRecommendedProducts();
    }
  }

  suggestedNextPage(): void {
    if (
      this.suggestedCurrentPage < this.suggestedTotalPages &&
      !this.suggestedLoading
    ) {
      this.suggestedCurrentPage++;
      this.updateSuggestedProductsPage();
    }
  }

  suggestedPrevPage(): void {
    if (this.suggestedCurrentPage > 1 && !this.suggestedLoading) {
      this.suggestedCurrentPage--;
      this.updateSuggestedProductsPage();
    }
  }

  private getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.unique_name || payload.sub || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  viewProductDetails(productId: string): void {
    this.router.navigate(['/details', productId]);
  }

  toggleFavorite(productId: string): void {
    const userId = this.getUserIdFromToken();
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

  get favoriteCanGoNext(): boolean {
    return this.favoriteHasNextPage && !this.favoriteLoading;
  }

  get favoriteCanGoPrev(): boolean {
    return this.favoriteCurrentPage > 1 && !this.favoriteLoading;
  }

  get suggestedCanGoNext(): boolean {
    return (
      this.suggestedCurrentPage < this.suggestedTotalPages &&
      !this.suggestedLoading
    );
  }

  get suggestedCanGoPrev(): boolean {
    return this.suggestedCurrentPage > 1 && !this.suggestedLoading;
  }
}
