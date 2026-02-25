import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;          // precio original
  discountedPrice?: number; // precio con descuento (ej: de coleccion)
  quantity: number;
  image: string;
  color: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  addManyToCart: (items: Omit<CartItem, "quantity">[], discountPct?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  justAdded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [justAdded, setJustAdded] = useState(false);

  const triggerAnimation = useCallback(() => {
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 600);
  }, []);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    triggerAnimation();
  }, [triggerAnimation]);

  // discountPct: número entre 0 y 1, ej: 0.13 = 13% de descuento
  const addManyToCart = useCallback((
    items: Omit<CartItem, "quantity">[],
    discountPct: number = 0.13
  ) => {
    setCartItems((prev) => {
      const updated = [...prev];
      items.forEach((item) => {
        const idx = updated.findIndex((i) => i.id === item.id);
        const discountedPrice = Math.round(item.price * (1 - discountPct));
        if (idx >= 0) {
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity + 1,
            discountedPrice, // actualiza el precio con descuento
          };
        } else {
          updated.push({ ...item, discountedPrice, quantity: 1 });
        }
      });
      return updated;
    });
    triggerAnimation();
  }, [triggerAnimation]);

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  // subtotal usa discountedPrice si existe, sino price
  const subtotal = cartItems.reduce(
    (acc, i) => acc + (i.discountedPrice ?? i.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      addManyToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      justAdded,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};