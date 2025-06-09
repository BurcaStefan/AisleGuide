import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClientHeaderComponent } from '../../components/layout/client-header/client-header.component';
import { ClientFooterComponent } from '../../components/layout/client-footer/client-footer.component';
import { CommonModule, Location } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { Position, PathNode } from '../../models/position.model';
import { ShoppingItem } from '../../models/shoppingitem.model';
import { forkJoin } from 'rxjs';
import { HistorylistService } from '../../services/historylist/historylist.service';

@Component({
  selector: 'app-user-home-page',
  standalone: true,
  imports: [
    ClientHeaderComponent,
    ClientFooterComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-home-page.component.html',
  styleUrl: './user-home-page.component.scss',
})
export class UserHomePageComponent implements OnInit {
  rowIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  colIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  gridData = [
    ['', '', 'O1', 'O2', 'O3', 'O4', 'O5', 'M1', 'M2', 'M3', 'M4', 'M5'],
    ['🏪', '', '', '', '', '', '', '', '', '', '', '', 'C5'],
    ['', '', 'G1', 'G2', 'G3', 'G4', '', 'M6', 'M7', 'M8', 'M9', '', 'C4'],
    ['', '', 'N1', 'N2', 'N3', 'N4', '', 'A1', 'A2', 'A3', 'A4', '', 'C3'],
    ['🏪', '', '', '', '', '', '', '', '', '', '', '', 'C2'],
    ['', '', 'N5', 'N6', 'N7', 'N8', '', 'A5', 'A6', 'A7', 'A8', '', 'C1'],
    ['', '', 'H1', 'H2', 'H3', 'H4', '', 'I1', 'I2', 'I3', 'I4', '', 'D5'],
    ['', '', '', '', '', '', '', '', '', '', '', '', 'D4'],
    ['', '', 'F1', 'F2', 'F3', 'F4', '', 'V1', 'V2', 'V3', 'V4', '', 'D3'],
    ['', '', 'F5', 'F6', 'F7', 'F8', '', 'V5', 'V6', 'V7', 'V8', '', 'D2'],
    ['➔', '', '', '', '', '', '', '', '', '', '', '', 'D1'],
    ['', '', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'B1', 'B2', 'B3'],
  ];

  displayedProducts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  hasNextPage: boolean = false;
  filterForm: FormGroup;
  showFilterForm: boolean = false;
  isLoading: boolean = false;
  routeGenerated: boolean = false;
  Math = Math;

  currentPosition: Position = { row: 10, col: 0 };
  pathToHighlight: Set<string> = new Set<string>();
  shoppingList: ShoppingItem[] = [];
  highlightedUnits: Set<string> = new Set<string>();

  createdHistoryListIds: string[] = [];

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
    private historyService: HistorylistService,
    private router: Router,
    private fb: FormBuilder,
    private location: Location
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

    const filters = {
      pageNumber: this.currentPage,
      pageSize: this.itemsPerPage + 1,
      name: this.filterForm.value.name || '',
      category: this.filterForm.value.category || '',
      isbn: this.filterForm.value.isbn || '',
      shelvingUnit: this.filterForm.value.shelvingUnit || '',
      sortBy: this.filterForm.value.sortBy || '',
    };

    this.productService.getProductsPaginatedByFilter(filters).subscribe({
      next: (response: any) => {
        const allProducts = response.data || response || [];

        if (allProducts.length > this.itemsPerPage) {
          this.hasNextPage = true;
          this.displayedProducts = allProducts.slice(0, this.itemsPerPage);
        } else {
          this.hasNextPage = false;
          this.displayedProducts = allProducts;
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.displayedProducts = [];
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
  }

  addToCart(product: any, event: Event): void {
    event.stopPropagation();

    const existingProduct = this.shoppingList.find((p) => p.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.shoppingList.push({
        ...product,
        quantity: 1,
        collected: false,
      });
    }

    if (product.shelvingUnit) {
      this.highlightedUnits.add(product.shelvingUnit);
    }
  }

  removeFromCart(productId: string): void {
    const index = this.shoppingList.findIndex((p) => p.id === productId);
    if (index >= 0) {
      const product = this.shoppingList[index];

      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        this.shoppingList.splice(index, 1);

        if (product.shelvingUnit) {
          const stillExists = this.shoppingList.some(
            (p) => p.shelvingUnit === product.shelvingUnit
          );
          if (!stillExists) {
            this.highlightedUnits.delete(product.shelvingUnit);
          }
        }
      }
    }

    if (this.shoppingList.length === 0) {
      this.routeGenerated = false;
      this.pathToHighlight.clear();
      this.currentPosition = { row: 10, col: 0 };
      this.createdHistoryListIds = [];
    }
  }

  isUnitHighlighted(unit: string): boolean {
    return this.highlightedUnits.has(unit);
  }

  getTotalItems(): number {
    return this.shoppingList.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.shoppingList.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getCollectedItems(): number {
    return this.shoppingList.filter((item) => item.collected).length;
  }

  //BFS
  findShortestPathBFS(
    start: Position,
    targets: Position[]
  ): { path: Position[]; targetFound: string } | null {
    if (targets.length === 0) return null;

    const queue: PathNode[] = [{ ...start, distance: 0 }];
    const visited = new Set<string>();
    visited.add(`${start.row},${start.col}`);
    const targetMap = new Map<string, string>();
    targets.forEach((target) => {
      const key = `${target.row},${target.col}`;
      const shelfValue = this.gridData[target.row][target.col];
      targetMap.set(key, shelfValue);
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentKey = `${current.row},${current.col}`;

      if (targetMap.has(currentKey)) {
        const path: Position[] = [];
        let node: PathNode | undefined = current;

        while (node) {
          path.unshift({ row: node.row, col: node.col });
          node = node.previous;
        }

        return { path, targetFound: targetMap.get(currentKey)! };
      }

      const neighbors = this.getValidNeighbors(current.row, current.col);

      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;

        if (!visited.has(neighborKey)) {
          visited.add(neighborKey);
          queue.push({
            row: neighbor.row,
            col: neighbor.col,
            distance: current.distance + 1,
            previous: current,
          });
        }
      }
    }

    return null;
  }

  getValidNeighbors(row: number, col: number): Position[] {
    const neighbors: Position[] = [];
    const directions = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
    ];

    for (const { dr, dc } of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < this.gridData.length &&
        newCol >= 0 &&
        newCol < this.gridData[newRow].length
      ) {
        const cellValue = this.gridData[newRow][newCol];

        if (
          cellValue === '' ||
          cellValue === '🏪' ||
          this.highlightedUnits.has(cellValue)
        ) {
          neighbors.push({ row: newRow, col: newCol });
        }
      }
    }

    return neighbors;
  }

  findShelfPositions(shelvingUnits: string[]): Position[] {
    const positions: Position[] = [];

    for (let row = 0; row < this.gridData.length; row++) {
      for (let col = 0; col < this.gridData[row].length; col++) {
        const value = this.gridData[row][col];
        if (shelvingUnits.includes(value)) {
          positions.push({ row, col });
        }
      }
    }

    return positions;
  }

  findRegisterPositions(): Position[] {
    const positions: Position[] = [];

    for (let row = 0; row < this.gridData.length; row++) {
      for (let col = 0; col < this.gridData[row].length; col++) {
        if (this.gridData[row][col] === '🏪') {
          positions.push({ row, col });
        }
      }
    }

    return positions;
  }

  markProductCollected(item: ShoppingItem): void {
    item.collected = true;

    if (item.shelvingUnit) {
      const shelfPositions = this.findShelfPositions([item.shelvingUnit]);
      if (shelfPositions.length > 0) {
        this.currentPosition = shelfPositions[0];
      }
    }

    this.calculateNextRoute();
  }

  calculateNextRoute(): void {
    this.pathToHighlight.clear();

    const nextUncollectedItems = this.shoppingList.filter(
      (item) => !item.collected && item.shelvingUnit
    );

    if (nextUncollectedItems.length > 0) {
      const nextShelvingUnits = nextUncollectedItems.map(
        (item) => item.shelvingUnit!
      );
      const targetPositions = this.findShelfPositions(nextShelvingUnits);

      const result = this.findShortestPathBFS(
        this.currentPosition,
        targetPositions
      );

      if (result) {
        result.path.forEach((position) => {
          this.pathToHighlight.add(`${position.row},${position.col}`);
        });
      }
    } else {
      const registerPositions = this.findRegisterPositions();

      const result = this.findShortestPathBFS(
        this.currentPosition,
        registerPositions
      );

      if (result) {
        result.path.forEach((position) => {
          this.pathToHighlight.add(`${position.row},${position.col}`);
        });
      }
    }
  }

  isCellInPath(row: number, col: number): boolean {
    return this.pathToHighlight.has(`${row},${col}`);
  }

  isCurrentPosition(row: number, col: number): boolean {
    return this.currentPosition.row === row && this.currentPosition.col === col;
  }

  generateOptimalRoute(): void {
    this.currentPosition = { row: 10, col: 0 };
    this.calculateNextRoute();
    this.routeGenerated = true;

    this.createHistoryListsForShoppingList();
  }

  getCurrentUserId(): string | null {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.unique_name || null;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  createHistoryListsForShoppingList(): void {
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.error('Could not get current user ID');
      return;
    }

    const currentDate = new Date();
    const listName = 'My list';
    const uniqueProducts = this.getUniqueProductsFromShoppingList();

    if (uniqueProducts.length === 0) {
      console.warn('No products in shopping list');
      return;
    }

    const firstProductCommand = {
      userId: userId,
      productId: uniqueProducts[0].id,
      name: listName,
      createdAt: currentDate.toISOString(),
    };

    this.historyService.createHistoryList(firstProductCommand).subscribe({
      next: (firstHistoryListId: string) => {
        this.createdHistoryListIds = [firstHistoryListId];
        if (uniqueProducts.length > 1) {
          const remainingProducts = uniqueProducts.slice(1);

          const remainingRequests = remainingProducts.map((product) => {
            const command = {
              id: firstHistoryListId,
              userId: userId,
              productId: product.id,
              name: listName,
              createdAt: currentDate.toISOString(),
            };

            return this.historyService.createHistoryList(command);
          });

          forkJoin(remainingRequests).subscribe({
            next: (results: string[]) => {},
            error: (error) => {
              console.error('Error creating remaining history lists:', error);
            },
          });
        }
      },
      error: (error) => {
        console.error('Error creating first history list:', error);
      },
    });
  }

  getUniqueProductsFromShoppingList(): any[] {
    const uniqueProductsMap = new Map();

    this.shoppingList.forEach((item) => {
      if (!uniqueProductsMap.has(item.id)) {
        uniqueProductsMap.set(item.id, item);
      }
    });

    return Array.from(uniqueProductsMap.values());
  }

  getCreatedHistoryListIds(): string[] {
    return this.createdHistoryListIds;
  }
}
