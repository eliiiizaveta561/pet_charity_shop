export type OrderStatus = 'new' | 'paid' | 'shipped' | 'cancelled';

export const orderStatusLabels: Record<OrderStatus, string> = {
  new: 'Новый',
  paid: 'Оплачен',
  shipped: 'Отправлен',
  cancelled: 'Отменён',
};

export const orderStatuses = Object.keys(orderStatusLabels) as OrderStatus[];

export interface CustomerData {
  name: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDonation {
  charityId: number;
  charityName: string;
  amount: number;
}

export interface Order {
  id: number;
  userId: number;
  customer: CustomerData;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  donation: OrderDonation | null;
  itemsTotal: number;
  donationTotal: number;
  total: number;
}

/** Что отправляем при оформлении. Цены не передаём: сервер берёт их из БД. */
export interface OrderDraft {
  customer: CustomerData;
  items: { productId: number; quantity: number }[];
  donation: { charityId: number; amount: number } | null;
}
