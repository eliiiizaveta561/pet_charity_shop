export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  text: string;
}

export type NewReview = Omit<Review, 'id'>;
