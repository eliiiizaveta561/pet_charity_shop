import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import type { Product } from '@/entities/product';
import type { Charity } from '@/entities/charity';

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartState {
  items: CartItem[];
  count: number;
  itemsTotal: number;
  charity: Charity | null;
  donation: number;
  total: number;
  addItem: (product: Product, qty?: number) => void;
  setQty: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  setCharity: (charity: Charity | null) => void;
  setDonation: (amount: number) => void;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [charity, setCharity] = useState<Charity | null>(null);
  const [donation, setDonationValue] = useState<number>(0);

  const value = useMemo<CartState>(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const itemsTotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

    return {
      items,
      count,
      itemsTotal,
      charity,
      donation,
      total: itemsTotal + donation,
      addItem: (product, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.product.id === product.id);
          if (existing) {
            return prev.map((i) =>
              i.product.id === product.id ? { ...i, qty: i.qty + qty } : i,
            );
          }
          return [...prev, { product, qty }];
        }),
      setQty: (productId, qty) =>
        setItems((prev) =>
          prev.map((i) =>
            i.product.id === productId ? { ...i, qty: Math.max(1, qty) } : i,
          ),
        ),
      removeItem: (productId) =>
        setItems((prev) => prev.filter((i) => i.product.id !== productId)),
      clear: () => {
        setItems([]);
        setDonationValue(0);
      },
      setCharity,
      setDonation: (amount) => setDonationValue(Math.max(0, Math.round(amount) || 0)),
    };
  }, [items, charity, donation]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return ctx;
}
