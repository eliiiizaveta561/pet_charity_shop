import { request } from '@/shared/api/http';
import { Order, OrderDraft, OrderStatus } from '../model/types';

/** Заказ в формате backend (snake_case). */
interface OrderResponse {
  id: number;
  user_id: number;
  customer_name: string;
  phone: string;
  address: string;
  status: OrderStatus;
  created_at: string;
  items: { product_id: number; product_name: string; quantity: number; unit_price: number }[];
  donation: { charity_id: number; charity_name: string; amount: number } | null;
  items_total: number;
  donation_total: number;
  total: number;
}

const toOrder = (data: OrderResponse): Order => ({
  id: data.id,
  userId: data.user_id,
  customer: { name: data.customer_name, phone: data.phone, address: data.address },
  status: data.status,
  createdAt: data.created_at,
  items: data.items.map((item) => ({
    productId: item.product_id,
    productName: item.product_name,
    quantity: item.quantity,
    unitPrice: item.unit_price,
  })),
  donation: data.donation && {
    charityId: data.donation.charity_id,
    charityName: data.donation.charity_name,
    amount: data.donation.amount,
  },
  itemsTotal: data.items_total,
  donationTotal: data.donation_total,
  total: data.total,
});

export async function createOrder({ customer, items, donation }: OrderDraft): Promise<Order> {
  const body = {
    customer_name: customer.name.trim(),
    phone: customer.phone,
    address: customer.address.trim(),
    items: items.map((item) => ({ product_id: item.productId, quantity: item.quantity })),
    donation: donation && { charity_id: donation.charityId, amount: donation.amount },
  };
  return toOrder(await request<OrderResponse>('/orders', { method: 'POST', body }));
}

/** Покупатель получает свои заказы, администратор - все. Это решает сервер по токену. */
export async function fetchOrders(): Promise<Order[]> {
  const orders = await request<OrderResponse[]>('/orders');
  return orders.map(toOrder);
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  return toOrder(await request<OrderResponse>(`/orders/${id}`, { method: 'PATCH', body: { status } }));
}

export const deleteOrder = (id: number): Promise<void> => request<void>(`/orders/${id}`, { method: 'DELETE' });
