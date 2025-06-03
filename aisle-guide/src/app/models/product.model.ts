export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  isbn: string;
  shelvingUnit: string;
  averageRating: number;

  calories: number;
  protein: number;
  carbohydrates: number;
  sugars: number;
  fat: number;
  saturatedFat: number;
  fiber: number;
  salt: number;
  cholesterol: number;
}
