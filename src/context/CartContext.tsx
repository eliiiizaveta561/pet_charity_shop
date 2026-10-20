import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { CartItem } from '../types';
import { products } from '../data/products';

interface CartState {
  items: CartItem[];
  count: number;
  itemsTotal: number;
  charityId: number | null;
  donation: number;
  total: number;
  addItem: (productId: number, qty?: number) => void;
  setQty: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  setCharityId: (id: number | null) => void;
  setDonation: (amount: number) => void;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [charityId, setCharityId] = useState<number | null>(null);
  const [donation, setDonationValue] = useState<number>(0);

  const value = useMemo<CartState>(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const itemsTotal = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);

    return {
      items,
      count,
      itemsTotal,
      charityId,
      donation,
      total: itemsTotal + donation,
      addItem: (productId, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.productId === productId);
          if (existing) {
            return prev.map((i) =>
              i.productId === productId ? { ...i, qty: i.qty + qty } : i,
            );
          }
          return [...prev, { productId, qty }];
        }),
      setQty: (productId, qty) =>
        setItems((prev) =>
          prev.map((i) =>
            i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i,
          ),
        ),
      removeItem: (productId) =>
        setItems((prev) => prev.filter((i) => i.productId !== productId)),
      clear: () => {
        setItems([]);
        setDonationValue(0);
      },
      setCharityId,
      setDonation: (amount) => setDonationValue(Math.max(0, Math.round(amount) || 0)),
    };
  }, [items, charityId, donation]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return ctx;
}
