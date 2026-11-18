import { request } from '@/shared/api/http';
import { Review, ReviewInput } from '../model/types';

interface ReviewResponse {
  id: number;
  product_id: number;
  user_id: number;
  author: string;
  rating: number;
  text: string;
  created_at: string;
}

const toReview = (data: ReviewResponse): Review => ({
  id: data.id,
  productId: data.product_id,
  userId: data.user_id,
  author: data.author,
  rating: data.rating,
  text: data.text,
  createdAt: data.created_at,
});

export async function fetchReviews(productId: number): Promise<Review[]> {
  const reviews = await request<ReviewResponse[]>(`/products/${productId}/reviews`);
  return reviews.map(toReview);
}

export async function createReview(productId: number, input: ReviewInput): Promise<Review> {
  return toReview(await request<ReviewResponse>(`/products/${productId}/reviews`, { method: 'POST', body: input }));
}

export async function updateReview(id: number, input: ReviewInput): Promise<Review> {
  return toReview(await request<ReviewResponse>(`/reviews/${id}`, { method: 'PATCH', body: input }));
}

export const deleteReview = (id: number): Promise<void> => request<void>(`/reviews/${id}`, { method: 'DELETE' });
