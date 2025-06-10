import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientFooterComponent } from '../../components/layout/client-footer/client-footer.component';
import { ClientHeaderComponent } from '../../components/layout/client-header/client-header.component';
import { AuthService } from '../../services/auth/auth.service';
import { HistorylistService } from '../../services/historylist/historylist.service';
import { ProductService } from '../../services/product/product.service';

interface HistoryListGroup {
  id: string;
  name: string;
  createdAt: Date;
  productIds: string[];
  productNames: string[];
  productCount: number;
  isEditing?: boolean;
}

@Component({
  selector: 'app-history-list-page',
  standalone: true,
  imports: [
    CommonModule,
    ClientHeaderComponent,
    ClientFooterComponent,
    FormsModule,
  ],
  templateUrl: './history-list-page.component.html',
  styleUrl: './history-list-page.component.scss',
})
export class HistoryListPageComponent implements OnInit {
  historyLists: HistoryListGroup[] = [];
  allHistoryData: any[] = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  pageSize: number = 6;
  hasNextPage: boolean = false;
  editingListName: string = '';

  constructor(
    private historyListService: HistorylistService,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadAllHistoryData();
  }

  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.unique_name || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  loadAllHistoryData(): void {
    this.isLoading = true;
    const userId = this.getUserId();

    if (!userId) {
      console.error('User ID not found');
      this.isLoading = false;
      return;
    }

    this.historyListService.getHistoryListByUserId(userId, 1, 1000).subscribe({
      next: (data) => {
        this.allHistoryData = data;
        this.groupAndPaginateHistoryLists();
      },
      error: (error) => {
        console.error('Error loading history lists:', error);
        this.isLoading = false;
      },
    });
  }

  groupAndPaginateHistoryLists(): void {
    const grouped = new Map<string, HistoryListGroup>();

    this.allHistoryData.forEach((item) => {
      const listKey = `${item.name}_${new Date(item.createdAt).toISOString()}`;

      if (grouped.has(listKey)) {
        grouped.get(listKey)!.productIds.push(item.productId);
      } else {
        grouped.set(listKey, {
          id: item.id,
          name: item.name,
          createdAt: new Date(item.createdAt),
          productIds: [item.productId],
          productNames: [],
          productCount: 0,
          isEditing: false,
        });
      }
    });

    const allGroups = Array.from(grouped.values());

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const currentPageGroups = allGroups.slice(startIndex, endIndex);

    this.hasNextPage = endIndex < allGroups.length;

    this.loadProductNamesForGroups(currentPageGroups);
  }

  loadProductNamesForGroups(groups: HistoryListGroup[]): void {
    if (groups.length === 0) {
      this.historyLists = [];
      this.isLoading = false;
      return;
    }

    const allProductRequests = groups.map((group) =>
      Promise.all(
        group.productIds.map((productId) =>
          this.productService.getProductById(productId).toPromise()
        )
      )
    );

    Promise.all(allProductRequests)
      .then((allProductsData) => {
        this.historyLists = groups.map((group, index) => ({
          ...group,
          productNames: (allProductsData[index] as Array<{ name: string }>).map(
            (product) => product.name
          ),
          productCount: group.productIds.length,
        }));

        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error loading product names:', error);
        this.isLoading = false;
      });
  }

  nextPage(): void {
    if (this.hasNextPage && !this.isLoading) {
      this.currentPage++;
      this.groupAndPaginateHistoryLists();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1 && !this.isLoading) {
      this.currentPage--;
      this.groupAndPaginateHistoryLists();
    }
  }

  startEdit(historyList: HistoryListGroup): void {
    this.historyLists.forEach((list) => (list.isEditing = false));
    historyList.isEditing = true;
    this.editingListName = historyList.name;
  }

  cancelEdit(historyList: HistoryListGroup): void {
    historyList.isEditing = false;
    this.editingListName = '';
  }

  saveEdit(historyList: HistoryListGroup): void {
    if (!this.editingListName.trim()) {
      return;
    }

    const updateCommand = {
      name: this.editingListName.trim(),
      createdAt: historyList.createdAt,
    };

    this.historyListService
      .updateHistoryList(historyList.id, updateCommand)
      .subscribe({
        next: (response) => {
          historyList.name = this.editingListName.trim();
          historyList.isEditing = false;
          this.editingListName = '';
          this.loadAllHistoryData();
        },
        error: (error) => {
          console.error('Error updating list:', error);
        },
      });
  }

  deleteList(historyList: HistoryListGroup): void {
    if (
      !confirm(
        `Are you sure you want to delete "${historyList.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    this.historyListService.deleteHistoryList(historyList.id).subscribe({
      next: (response) => {
        this.loadAllHistoryData();
      },
      error: (error) => {
        console.error('Error deleting list:', error);
      },
    });
  }
}
