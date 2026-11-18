export interface Review {
  id: number;
  productId: number;
  userId: number;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
}

/** Автора не передаём: сервер берёт его из токена. */
export interface ReviewInput {
  rating: number;
  text: string;
}
