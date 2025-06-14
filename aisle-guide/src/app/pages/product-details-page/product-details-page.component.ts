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
import { ImageService } from '../../services/image/image.service';
import { CloudinaryService } from '../../services/cloudinary/cloudinary.service';
import { Image } from '../../models/image.model';

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

  productImageUrl: string | null = null;
  isLoadingImage = false;
  imageError = false;
  defaultImageUrl =
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80';

  reviews: any[] = [];
  totalReviews = 0;
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  isLoadingReviews = false;
  reviewError: string | null = null;
  hasNextPage = false;

  userMap: { [userId: string]: { firstName: string; lastName: string } } = {};
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploadingImage = false;

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
    private userService: UserService,
    private imageService: ImageService,
    private cloudinaryService: CloudinaryService
  ) {}

  ngOnInit(): void {
    this.checkAdminStatus();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.productId = id;
        this.loadProductDetails();
        this.loadProductImage();
        this.loadReviews();
        this.getCurrentUserId();
      } else {
        this.error = 'Product ID not found';
        this.isLoading = false;
      }
    });
  }

loadProductImage(forceRefresh: boolean = false): void {
  this.isLoadingImage = true;
  this.productImageUrl = null;

  this.imageService.getImageByEntityId(this.productId).subscribe({
    next: (image: Image) => {
      if (image) {
        const timestamp = new Date().getTime();
        this.productImageUrl = `https://res.cloudinary.com/${this.cloudinaryService.getCloudName()}/image/upload/v${timestamp}/Product/${this.productId}.${image.fileExtension}`;
        this.imageError = false;
      }
      this.isLoadingImage = false;
    },
    error: () => {
      this.productImageUrl = this.defaultImageUrl;
      this.imageError = true;
      this.isLoadingImage = false;
    },
  });
}

  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.selectedFile = target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  handleImageError(): void {
    this.productImageUrl = this.defaultImageUrl;
    this.imageError = true;
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
          console.log('Product details updated successfully');

          if (this.selectedFile) {
            this.updateProductImage();
          } else {
            this.isLoading = false;
            this.isEditing = false;
            this.loadProductDetails();
            this.imagePreview = null;
          }
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.error = 'Failed to update product';
          this.isLoading = false;
        },
      });
  }

  private updateProductImage(): void {
    this.isUploadingImage = true;

    this.imageService.getImageByEntityId(this.productId).subscribe({
      next: (existingImage: Image) => {
        if (existingImage) {
          this.cloudinaryService
            .updateImage(
              this.selectedFile!,
              existingImage.id,
              this.productId,
              'Product'
            )
            .subscribe({
              next: (updatedImage) => {
                console.log(
                  'Image updated successfully with ID:',
                  updatedImage.id
                );
                this.completeImageUpdate(true);
              },
              error: (error) => {
                console.error('Error updating image:', error);
                this.isUploadingImage = false;
                this.isLoading = false;
                this.error = 'Failed to update image';
              },
            });
        } else {
          this.cloudinaryService
            .uploadImage(this.selectedFile!, this.productId, 'Product')
            .subscribe({
              next: (newImage) => {
                console.log('New image created with ID:', newImage.id);
                this.completeImageUpdate(true);
              },
              error: (error) => {
                console.error('Error uploading new image:', error);
                this.isUploadingImage = false;
                this.isLoading = false;
                this.error = 'Failed to upload new image';
              },
            });
        }
      },
      error: (error) => {
        console.error('Error checking for existing image:', error);
        this.isUploadingImage = false;
        this.isLoading = false;
        this.error = 'Failed to check for existing image';
      },
    });
  }

  private uploadAndUpdateExistingImage(existingImage: Image): void {
    this.cloudinaryService
      .uploadImage(this.selectedFile!, this.productId, 'Product')
      .subscribe({
        next: () => {
          const fileExtension =
            this.selectedFile!.name.split('.').pop() || 'jpg';
          const updatedImage: Image = {
            ...existingImage,
            fileExtension: fileExtension,
          };

          this.imageService
            .updateImage(existingImage.id, updatedImage)
            .subscribe({
              next: () => {
                this.completeImageUpdate();
              },
              error: (error) => {
                this.isUploadingImage = false;
                this.isLoading = false;
                this.error = 'Failed to update image metadata';
              },
            });
        },
        error: () => {
          this.isUploadingImage = false;
          this.isLoading = false;
          this.error = 'Failed to upload new image';
        },
      });
  }

  private uploadNewProductImage(): void {
    this.cloudinaryService
      .uploadImage(this.selectedFile!, this.productId, 'Product')
      .subscribe({
        next: () => {
          const fileExtension =
            this.selectedFile!.name.split('.').pop() || 'jpg';
          const newImage = {
            entityId: this.productId,
            entityType: 'Product',
            fileExtension: fileExtension,
          };

          this.imageService.createImage(newImage).subscribe({
            next: () => {
              this.completeImageUpdate();
            },
            error: () => {
              this.isUploadingImage = false;
              this.isLoading = false;
              this.error = 'Failed to create image metadata';
            },
          });
        },
        error: () => {
          this.isUploadingImage = false;
          this.isLoading = false;
          this.error = 'Failed to upload new image';
        },
      });
  }

  private completeImageUpdate(forceRefresh: boolean = false): void {
    this.isUploadingImage = false;
    this.isLoading = false;
    this.isEditing = false;
    this.selectedFile = null;
    this.imagePreview = null;
    this.productImageUrl = null;

    setTimeout(() => {
      if (forceRefresh) {
        this.imageService.getImageByEntityId(this.productId).subscribe({
          next: (image) => {
            if (image) {
              const timestamp = new Date().getTime();
              this.productImageUrl = `https://res.cloudinary.com/${this.cloudinaryService.getCloudName()}/image/upload/v${timestamp}/Product/${
                this.productId
              }.${image.fileExtension}`;
            }
            this.loadProductDetails();
          },
        });
      } else {
        this.loadProductImage();
        this.loadProductDetails();
      }
    }, 2000);
  }

  cancelImageSelection(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  deleteProduct(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.isLoading = true;
      this.error = null;

      this.imageService.getImageByEntityId(this.productId).subscribe({
        next: (image: Image) => {
          if (image) {
            this.cloudinaryService
              .deleteImage(this.productId, 'Product')
              .subscribe({
                next: () => {
                  this.imageService.deleteImage(image.entityId).subscribe({
                    next: () => {
                      console.log(
                        'Image metadata deleted from database successfully'
                      );

                      this.deleteProductOnly();
                    },
                    error: (error) => {
                      console.error(
                        'Error deleting image from database:',
                        error
                      );
                      this.deleteProductOnly();
                    },
                  });
                },
                error: (error) => {
                  console.error('Error deleting image from Cloudinary:', error);

                  this.imageService.deleteImage(image.entityId).subscribe({
                    next: () => {
                      console.log(
                        'Image metadata deleted from database successfully'
                      );
                      this.deleteProductOnly();
                    },
                    error: (err) => {
                      console.error('Error deleting image from database:', err);
                      this.deleteProductOnly();
                    },
                  });
                },
              });
          } else {
            this.deleteProductOnly();
          }
        },
        error: (error) => {
          console.error('Error checking for product image:', error);
          this.deleteProductOnly();
        },
      });
    }
  }

  private deleteProductOnly(): void {
    this.productService.deleteProduct(this.productId).subscribe({
      next: () => {
        console.log('Product deleted successfully');
        this.isLoading = false;
        this.goBack();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.error = 'Failed to delete product';
        this.isLoading = false;
      },
    });
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
          const updatedProduct: Product = {
            id: this.product.id,
            name: this.product.name,
            price: this.product.price,
            description: this.product.description,
            category: this.product.category,
            shelvingUnit: this.product.shelvingUnit,
            isbn: this.product.isbn,
            averageRating: 0,
            calories: this.product.calories,
            protein: this.product.protein,
            carbohydrates: this.product.carbohydrates,
            sugars: this.product.sugars,
            fat: this.product.fat,
            saturatedFat: this.product.saturatedFat,
            fiber: this.product.fiber,
            salt: this.product.salt,
            cholesterol: this.product.cholesterol,
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
        const updatedProduct: Product = {
          id: this.product.id,
          name: this.product.name,
          price: this.product.price,
          description: this.product.description,
          category: this.product.category,
          shelvingUnit: this.product.shelvingUnit,
          isbn: this.product.isbn,
          averageRating: Math.round(averageRating * 100) / 100,
          calories: this.product.calories,
          protein: this.product.protein,
          carbohydrates: this.product.carbohydrates,
          sugars: this.product.sugars,
          fat: this.product.fat,
          saturatedFat: this.product.saturatedFat,
          fiber: this.product.fiber,
          salt: this.product.salt,
          cholesterol: this.product.cholesterol,
        };

        await this.productService
          .updateProduct(this.productId, updatedProduct)
          .toPromise();
        this.product.averageRating = updatedProduct.averageRating;
      }
    } catch (error) {
      console.error('Error updating product average rating:', error);
    }
  }
}
