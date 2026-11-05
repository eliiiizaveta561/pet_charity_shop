import { demoRequest } from '@/shared/api/demo';
import { NewReview, Review } from '../model/types';
import { reviews } from './reviews.data';

export const fetchReviews = (productId: number): Promise<Review[]> =>
  demoRequest(() => reviews.filter((r) => r.productId === productId), []);

export const createReview = (review: NewReview): Promise<Review> =>
  demoRequest(() => {
    const created: Review = { ...review, id: Date.now() };
    reviews.unshift(created);
    return created;
  });
