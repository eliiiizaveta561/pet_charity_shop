export interface CustomerData {
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  number: number;
  total: number;
  donation: number;
  charityName: string | null;
}

export type OrderDraft = Omit<Order, 'number'> & { customer: CustomerData };
