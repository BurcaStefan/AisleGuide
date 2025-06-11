import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientFooterComponent } from '../../components/layout/client-footer/client-footer.component';
import { ClientHeaderComponent } from '../../components/layout/client-header/client-header.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-suggested-items-page',
  standalone: true,
  imports: [CommonModule, ClientFooterComponent, ClientHeaderComponent],
  templateUrl: './suggested-items-page.component.html',
  styleUrl: './suggested-items-page.component.scss',
})
export class SuggestedItemsPageComponent implements OnInit {
  recommendedProducts: Product[] = [];
  suggestedProducts: Product[] = [];
  isLoading: boolean = false;
  error: string = '';

  Math = Math;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadRecommendedProducts();
    this.loadSuggestedProducts();
  }

  loadRecommendedProducts(): void {
    this.isLoading = true;
  }

  loadSuggestedProducts(): void {
    this.isLoading = true;
  }

  viewProductDetails(productId: string): void {
    this.router.navigate(['/product-details', productId]);
  }
}
