import React from 'react';
import { Product } from '@/data/menuData';

export interface CartItem {
  id: string | number;
  product: Product;
  // backward-compatible: items may be strings (old shape) or detailed objects
  removedIngredients: Array<string | { id: number | null; nome: string; categoriaId?: number; categoria?: string }>;
  additionals: Array<string | { id: number | null; nome: string; valor?: number; categoriaId?: number; categoria?: string }>; // ids or detailed
  accompaniments: Array<string | { id: number | null; nome: string; valor?: number; categoriaId?: number; categoria?: string }>;
  unitPrice: number; // preço base do produto
  totalPrice: number; // preço final com extras
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, delta: number) => void;
  clearCart: () => void;
}

const CartContext = React.createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = React.useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (id: string | number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string | number, delta: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const next = (i.quantity || 1) + delta;
        return { ...i, quantity: next < 1 ? 1 : next };
      })
    );
  };

  const clearCart = () => setItems([]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export default CartContext;
