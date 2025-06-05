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

  showReviewForm = false;
  newReviewContent = '';
  newReviewRating = 0;
  hoverRating = 0;
  isSubmittingReview = false;
  reviewSubmitError: string | null = null;
  currentUserId: string | null = null;
  reviewToEdit: any = null;

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
        this.getCurrentUserId();
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
    this.reviewService
      .getAllReviewsPaginatedById(this.productId, page, this.pageSize)
      .subscribe({
        next: (response) => {
          const nextPageReviews = Array.isArray(response) ? response : [];

          this.hasNextPage = nextPageReviews.length > 0;

          if (this.hasNextPage && page > this.totalPages) {
            this.totalPages = page;
          }
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

    this.reviewService
      .getAllReviewsPaginatedById(this.productId, page, this.pageSize)
      .pipe(
        switchMap((response) => {
          this.reviews = Array.isArray(response) ? response : [];
          this.totalPages = Math.max(this.totalPages, page);

          if (this.reviews.length === 0) {
            this.totalPages = 0;
            this.hasNextPage = false;
          } else if (this.reviews.length < this.pageSize) {
            this.totalPages = page;
            this.hasNextPage = false;
          } else {
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
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/admin-home']);
    }
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
          this.goBack();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          this.error = 'Error deleting product';
        },
      });
    }
  }

  setRating(rating: number): void {
    this.newReviewRating = rating;
  }

  isReviewValid(): boolean {
    return this.newReviewRating > 0 && this.newReviewContent.trim().length > 0;
  }

  submitReview(): void {
    if (!this.isReviewValid() || this.isSubmittingReview) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }

    this.isSubmittingReview = true;

    try {
      if (this.reviewToEdit) {
        const updatedReview = {
          id: this.reviewToEdit.id,
          content: this.newReviewContent,
          rating: this.newReviewRating,
          createdAt: new Date().toISOString(),
        };

        this.reviewService
          .updateReview(this.reviewToEdit.id, updatedReview)
          .subscribe({
            next: async () => {
              this.isSubmittingReview = false;
              this.showReviewForm = false;
              this.newReviewContent = '';
              this.newReviewRating = 0;
              this.reviewToEdit = null;
              this.loadReviews(this.currentPage);

              await this.updateProductAverageRating();
            },
            error: (err) => {
              console.error('Error updating review:', err);
              this.isSubmittingReview = false;
              this.reviewSubmitError =
                'Failed to update review. Please try again.';
            },
          });
      } else {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.unique_name;

        if (!userId) {
          this.reviewSubmitError =
            'Unable to identify user. Please log in again.';
          this.isSubmittingReview = false;
          return;
        }

        const review = {
          productId: this.productId,
          userId: userId,
          content: this.newReviewContent,
          rating: this.newReviewRating,
          createdAt: new Date(),
        };

        this.reviewService.createReview(review).subscribe({
          next: async () => {
            this.isSubmittingReview = false;
            this.showReviewForm = false;
            this.newReviewContent = '';
            this.newReviewRating = 0;
            this.loadReviews(1);

            await this.updateProductAverageRating();
          },
          error: (err) => {
            console.error('Error creating review:', err);
            this.isSubmittingReview = false;
            this.reviewSubmitError =
              'Failed to submit review. Please try again.';
          },
        });
      }
    } catch (error) {
      console.error('Error processing review:', error);
      this.isSubmittingReview = false;
      this.reviewSubmitError = 'An error occurred. Please try again.';
    }
  }

  deleteReview(reviewId: string): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: async () => {
          this.loadReviews(this.currentPage);
          await this.updateProductAverageRating();
        },
        error: (err) => {
          console.error('Error deleting review:', err);
          this.reviewError = 'Failed to delete review';
        },
      });
    }
  }

  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
    if (!this.showReviewForm) {
      this.newReviewContent = '';
      this.newReviewRating = 0;
      this.hoverRating = 0;
      this.reviewToEdit = null;
    }
  }

  getCurrentUserId(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);

        this.currentUserId = decodedToken.unique_name;
      } catch (error) {
        console.error('Error decoding token:', error);
        this.currentUserId = null;
      }
    } else {
      this.currentUserId = null;
    }
  }

  isReviewAuthor(reviewUserId: string): boolean {
    const isAuthor = this.currentUserId === reviewUserId;
    return isAuthor;
  }

  editReview(review: any): void {
    this.reviewToEdit = { ...review };
    this.showReviewForm = true;
    this.newReviewContent = review.content;
    this.newReviewRating = review.rating;

    setTimeout(() => {
      const reviewForm = document.querySelector('.review-form-container');
      if (reviewForm) {
        reviewForm.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  private async getAllReviewsForProduct(productId: string): Promise<any[]> {
    let allReviews: any[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        const reviews = await this.reviewService
          .getAllReviewsPaginatedById(productId, currentPage, this.pageSize)
          .toPromise();

        if (reviews && Array.isArray(reviews) && reviews.length > 0) {
          allReviews = allReviews.concat(reviews);
          currentPage++;

          if (reviews.length < this.pageSize) {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error);
        hasMorePages = false;
      }
    }

    return allReviews;
  }

  private async updateProductAverageRating(): Promise<void> {
    try {
      const allReviews = await this.getAllReviewsForProduct(this.productId);

      if (allReviews.length === 0) {
        if (this.product) {
          const updatedProduct = {
            ...this.product,
            avgRating: 0,
          };
          await this.productService
            .updateProduct(this.productId, updatedProduct)
            .toPromise();
          this.product.averageRating = 0;
        }
        return;
      }

      const totalRating = allReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalRating / allReviews.length;

      if (this.product) {
        const updatedProduct = {
          ...this.product,
          avgRating: Math.round(averageRating * 100) / 100,
        };

        await this.productService
          .updateProduct(this.productId, updatedProduct)
          .toPromise();

        this.product.averageRating = updatedProduct.avgRating;

      }
    } catch (error) {
      console.error('Error updating product average rating:', error);
    }
  }
}
