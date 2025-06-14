import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { AdminFooterComponent } from '../../components/layout/admin-footer/admin-footer.component';
import { AdminHeaderComponent } from '../../components/layout/admin-header/admin-header.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CloudinaryService } from '../../services/cloudinary/cloudinary.service';
import { ImageService } from '../../services/image/image.service';

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
  selectedFile: File | null = null;

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

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private cloudinaryService: CloudinaryService,
    private imageService: ImageService
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
      this.selectedFile = file;

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

    if (!this.selectedFile) {
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
        console.log('Product created successfully with ID:', productId);
        this.uploadProductImage(productId);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to create product';
        console.error('Error creating product:', error);
      },
    });
  }

  private uploadProductImage(productId: string) {
    if (!this.selectedFile) {
      this.isSubmitting = false;
      this.errorMessage = 'No image selected';
      return;
    }

    this.cloudinaryService
      .uploadImage(this.selectedFile, productId, 'Product')
      .subscribe({
        next: (image) => {
          console.log('Image uploaded successfully:', image);
          this.isSubmitting = false;
          this.successMessage = 'Product created successfully with image!';

          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.isSubmitting = false;
          this.successMessage = 'Product created but image upload failed.';
          this.errorMessage = 'Failed to upload image. Please try again later.';
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
