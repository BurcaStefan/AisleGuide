import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ProductService } from '../../../services/product/product.service';
import { ImageService } from '../../../services/image/image.service';
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { Image } from '../../../models/image.model';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProductDialogComponent {
  displayedProducts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  hasNextPage: boolean = false;
  filterForm: FormGroup;
  showFilterForm: boolean = false;
  isLoading: boolean = false;
  Math = Math;

  productImages: { [key: string]: string | null } = {};
  imagesLoading: { [key: string]: boolean } = {};

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
    private productService: ProductService,
    private router: Router,
    private imageService: ImageService,
    private cloudinaryService: CloudinaryService,
    private fb: FormBuilder,
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: any
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

  loadProducts(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.productImages = {};

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
        const allProducts = response.data || response || [];
        this.displayedProducts = allProducts;

        this.loadProductImages();

        if (allProducts.length === this.itemsPerPage) {
          this.checkNextPageAvailability();
        } else {
          this.hasNextPage = false;
          this.isLoading = false;
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

  loadProductImages(): void {
    this.displayedProducts.forEach((product) => {
      this.imagesLoading[product.id] = true;

      this.imageService.getImageByEntityId(product.id).subscribe({
        next: (image: Image) => {
          if (image) {
            const timestamp = new Date().getTime();
            this.productImages[
              product.id
            ] = `https://res.cloudinary.com/${this.cloudinaryService.getCloudName()}/image/upload/Product/${
              product.id
            }.${image.fileExtension}?t=${timestamp}`;
          }
          this.imagesLoading[product.id] = false;
        },
        error: () => {
          this.productImages[product.id] = null;
          this.imagesLoading[product.id] = false;
        },
      });
    });
  }

  handleImageError(productId: string): void {
    this.productImages[productId] = null;
  }

  private checkNextPageAvailability(): void {
    const nextPageFilters = {
      pageNumber: this.currentPage + 1,
      pageSize: 1,
      name: this.filterForm.value.name || '',
      category: this.filterForm.value.category || '',
      isbn: this.filterForm.value.isbn || '',
      shelvingUnit: this.filterForm.value.shelvingUnit || '',
      sortBy: this.filterForm.value.sortBy || '',
    };

    this.productService
      .getProductsPaginatedByFilter(nextPageFilters)
      .subscribe({
        next: (response: any) => {
          const nextPageProducts = response.data || response || [];
          this.hasNextPage = nextPageProducts.length > 0;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error checking next page:', error);
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
    this.dialogRef.close();
  }

  addToCart(product: any, event: Event): void {
    event.stopPropagation();
    if (this.data && this.data.addProductCallback) {
      this.data.addProductCallback(product);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
