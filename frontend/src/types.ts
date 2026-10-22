export type Category = 'dogs' | 'cats' | 'birds' | 'rodents' | 'fish';

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: Category;
  price: number;
  description: string;
  emoji: string;
  tint: string;
}

export interface Charity {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  need: string;
  lat: number;
  lng: number;
}

export interface CartItem {
  productId: number;
  qty: number;
}
