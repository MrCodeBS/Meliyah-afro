'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { klaraApi, type Product } from '@/lib/api/klara';
import { toast } from 'sonner';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  cartId: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { productId: string; quantity: number; price: number } }
  | { type: 'UPDATE_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'SET_CART'; payload: { items: CartItem[]; total: number; cartId: string } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  addItem: (product: Product, quantity: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => void;
} | null>(null);

const initialState: CartState = {
  items: [],
  total: 0,
  cartId: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          total: state.total + (action.payload.price * action.payload.quantity),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + (action.payload.price * action.payload.quantity),
      };
    }
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.items.reduce((sum, item) => 
          sum + (item.productId === action.payload.productId
            ? item.price * action.payload.quantity
            : item.price * item.quantity), 0),
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
        total: state.items.reduce((sum, item) => 
          item.productId !== action.payload ? sum + (item.price * item.quantity) : sum, 0),
      };
    case 'SET_CART':
      return {
        items: action.payload.items,
        total: action.payload.total,
        cartId: action.payload.cartId,
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = async (product: Product, quantity: number) => {
    try {
      if (state.cartId) {
        await klaraApi.addToCart(state.cartId, product.id, quantity);
      }
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          productId: product.id,
          quantity,
          price: product.price,
        },
      });
      toast.success('Product added to cart');
    } catch (error) {
      toast.error('Failed to add product to cart');
      throw error;
    }
  };

  const updateItem = async (productId: string, quantity: number) => {
    try {
      if (state.cartId) {
        await klaraApi.updateCartItem(state.cartId, productId, quantity);
      }
      dispatch({
        type: 'UPDATE_ITEM',
        payload: { productId, quantity },
      });
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
      throw error;
    }
  };

  const removeItem = async (productId: string) => {
    try {
      if (state.cartId) {
        await klaraApi.updateCartItem(state.cartId, productId, 0);
      }
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
      toast.success('Product removed from cart');
    } catch (error) {
      toast.error('Failed to remove product');
      throw error;
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}