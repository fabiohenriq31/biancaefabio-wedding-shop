import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('wedding_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wedding_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems(current => {
      const existingItem = current.find(item => item.productId === product.id);

      if (existingItem) {
        // Update quantity if item already in cart
        return current.map(item =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                lineTotal: (item.quantity + quantity) * item.productPrice
              }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          cartItemId: `cart-${Date.now()}-${product.id}`,
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          quantity,
          lineTotal: product.price * quantity,
          productImage: product.imageUrl
        };
        return [...current, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(current => current.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems(current =>
      current.map(item =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              quantity,
              lineTotal: quantity * item.productPrice
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
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
