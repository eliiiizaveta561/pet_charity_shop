import { demoRequest } from '@/shared/api/demo';
import { Order, OrderDraft } from '../model/types';

export const createOrder = ({ total, donation, charityName }: OrderDraft): Promise<Order> =>
  demoRequest(() => ({
    number: Math.floor(1000 + Math.random() * 9000),
    total,
    donation,
    charityName,
  }));
