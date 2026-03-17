import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'wedding_cart';

function getInitialCart(): CartItem[] {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);

  const persistCart = (items: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  };

  const addToCart = (product: Product, quantity = 1) => {
    const productId = product._id || product.id;

    if (!productId) {
      console.error('Produto sem id ao adicionar no carrinho:', product);
      return;
    }

    setCartItems((current) => {
      const existingItem = current.find((item) => item.productId === productId);

      let updatedCart: CartItem[];

      if (existingItem) {
        updatedCart = current.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                lineTotal: (item.quantity + quantity) * item.productPrice,
              }
            : item
        );
      } else {
        const newItem: CartItem = {
          cartItemId: `cart-${Date.now()}-${productId}`,
          productId,
          productName: product.name,
          productPrice: product.price,
          quantity,
          lineTotal: product.price * quantity,
          productImage: product.imageUrl || '',
        };

        updatedCart = [...current, newItem];
      }

      persistCart(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((current) => {
      const updatedCart = current.filter((item) => item.cartItemId !== cartItemId);
      persistCart(updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems((current) => {
      const updatedCart = current.map((item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              quantity,
              lineTotal: quantity * item.productPrice,
            }
          : item
      );

      persistCart(updatedCart);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}