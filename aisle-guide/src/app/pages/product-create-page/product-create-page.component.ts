import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { AdminFooterComponent } from '../../components/layout/admin-footer/admin-footer.component';
import { AdminHeaderComponent } from '../../components/layout/admin-header/admin-header.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-create-page',
  templateUrl: './product-create-page.component.html',
  styleUrls: ['./product-create-page.component.scss'],
  imports: [
    AdminHeaderComponent,
    AdminFooterComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class ProductCreatePageComponent {
  productForm: FormGroup;
  imagePreview: string | null = null;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  isFormSubmitted = false;
  imageError = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      category: ['', [Validators.required]],
      isbn: ['', [Validators.required]],
      shelvingUnit: [''],
      averageRating: [0, [Validators.min(0)]],
      calories: [0, [Validators.min(0)]],
      protein: [0, [Validators.min(0)]],
      carbohydrates: [0, [Validators.min(0)]],
      sugars: [0, [Validators.min(0)]],
      fat: [0, [Validators.min(0)]],
      saturatedFat: [0, [Validators.min(0)]],
      fiber: [0, [Validators.min(0)]],
      salt: [0, [Validators.min(0)]],
      cholesterol: [0, [Validators.min(0)]],
    });
  }

  onImageSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.imageError = false;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.isFormSubmitted = true;

    if (!this.imagePreview) {
      this.imageError = true;
      return;
    }

    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const productData = this.productForm.value;

    this.productService.createProduct(productData).subscribe({
      next: (productId) => {
        this.isSubmitting = false;
        this.successMessage = 'Product created successfully!';

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to create product';
        console.error('Error creating product:', error);
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
