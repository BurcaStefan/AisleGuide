export interface Review {
  id: string;
  userId: string;
  productId: string;
  content?: string;
  rating: number;
  createdAt: Date;
}
