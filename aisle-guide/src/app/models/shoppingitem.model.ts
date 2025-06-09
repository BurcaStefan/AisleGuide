export interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  shelvingUnit?: string;
  collected: boolean;
}
