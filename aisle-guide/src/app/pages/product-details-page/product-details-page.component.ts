import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.checkAdminStatus();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.productId = id;
        this.loadProductDetails();
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

  goBack(): void {
    this.router.navigate(['/admin-home']);
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
