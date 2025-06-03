import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';
import { jwtDecode } from 'jwt-decode';
import { ReviewService } from '../../services/product-review/review.service';
import { UserService } from '../../services/user/user.service';
import { catchError, finalize, forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss',
})
export class ProductDetailsPageComponent implements OnInit {
  productId: string = '';
  product?: Product;
  editedProduct?: Product;
  isLoading = true;
  error: string | null = null;
  isAdmin = false;
  isEditing = false;

  reviews: any[] = [];
  totalReviews = 0;
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  isLoadingReviews = false;
  reviewError: string | null = null;
  hasNextPage = false;

  userMap: { [userId: string]: { firstName: string; lastName: string } } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private reviewService: ReviewService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.checkAdminStatus();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.productId = id;
        this.loadProductDetails();
        this.loadReviews();
      } else {
        this.error = 'Product ID not found';
        this.isLoading = false;
      }
    });
  }

  checkAdminStatus(): void {
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

  checkNextPage(page: number): void {
    console.log(`Checking if page ${page} has reviews...`);

    this.reviewService
      .getAllReviewsPaginatedById(this.productId, page, this.pageSize)
      .subscribe({
        next: (response) => {
          const nextPageReviews = Array.isArray(response) ? response : [];
          console.log(
            `Next page check result: found ${nextPageReviews.length} reviews on page ${page}`
          );

          this.hasNextPage = nextPageReviews.length > 0;

          if (this.hasNextPage && page > this.totalPages) {
            this.totalPages = page;
            console.log(
              `Updated totalPages to ${this.totalPages} because next page has content`
            );
          }

          setTimeout(() => {
            console.log(
              `hasNextPage is now: ${this.hasNextPage}, totalPages is now: ${this.totalPages}`
            );
          }, 0);
        },
        error: (err) => {
          console.error(`Error checking next page ${page}:`, err);
          this.hasNextPage = false;
        },
      });
  }

  loadProductDetails(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error = 'Failed to load product details';
        this.isLoading = false;
      },
    });
  }

  loadReviews(page: number = 1): void {
    this.isLoadingReviews = true;
    this.reviewError = null;
    this.currentPage = page;

    console.log(
      `Loading reviews for product: ${this.productId}, page: ${page}`
    );

    this.reviewService
      .getAllReviewsPaginatedById(this.productId, page, this.pageSize)
      .pipe(
        switchMap((response) => {
          console.log('Review API response:', response);

          this.reviews = Array.isArray(response) ? response : [];
          console.log('Reviews after assignment:', this.reviews);
          this.totalPages = Math.max(this.totalPages, page);

          if (this.reviews.length === 0) {
            this.totalPages = 0;
            this.hasNextPage = false;
          } else if (this.reviews.length < this.pageSize) {
            this.totalPages = page;
            this.hasNextPage = false;
          } else {
            console.log(
              `Found exactly ${this.pageSize} reviews, checking next page ${
                page + 1
              }...`
            );
            this.checkNextPage(page + 1);
          }

          const userIds = [
            ...new Set(this.reviews.map((review) => review.userId)),
          ];

          if (userIds.length === 0) {
            return of(null);
          }

          const userRequests = userIds.map((userId) =>
            this.userService.getUserById(userId).pipe(
              catchError((error) => {
                console.error(`Error fetching user ${userId}:`, error);
                return of({
                  id: userId,
                  firstName: 'Unknown',
                  lastName: 'User',
                });
              })
            )
          );

          return forkJoin(userRequests);
        }),
        finalize(() => {
          this.isLoadingReviews = false;
        })
      )
      .subscribe({
        next: (users) => {
          if (users) {
            users.forEach((user) => {
              this.userMap[user.id] = {
                firstName: user.firstName || 'Anonymous',
                lastName: user.lastName || 'User',
              };
            });
            console.log('User information loaded:', this.userMap);
          }
        },
        error: (err) => {
          console.error('Error in review loading process:', err);
          this.reviewError = 'Failed to load product reviews';
        },
      });
  }

  getUserFullName(userId: string): string {
    const user = this.userMap[userId];
    if (!user) return 'Anonymous User';
    return `${user.firstName} ${user.lastName}`;
  }

  goBack(): void {
    this.router.navigate(['/admin-home']);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadReviews(page);
    }
  }

  editProduct(): void {
    if (this.product) {
      this.editedProduct = { ...this.product };
      this.isEditing = true;
    } else {
      this.error = 'Cannot edit: Product details not available';
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editedProduct = undefined;
  }

  saveChanges(): void {
    if (!this.editedProduct) return;

    this.isLoading = true;
    this.productService
      .updateProduct(this.productId, this.editedProduct)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.isEditing = false;
          this.loadProductDetails();
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.error = 'Failed to update product';
          this.isLoading = false;
        },
      });
  }

  deleteProduct(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.productId).subscribe({
        next: () => {
          this.router.navigate(['/admin-home']);
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          this.error = 'Error deleting product';
        },
      });
    }
  }
}
