import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (item) => item.id === action.payload.id && item.size === action.payload.size,
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id && item.size === action.payload.size
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.id === action.payload.id && item.size === action.payload.size),
        ),
      };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const stored = localStorage.getItem('ecom-cart');
    if (stored) {
      dispatch({ type: 'INIT', payload: JSON.parse(stored) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ecom-cart', JSON.stringify(state));
  }, [state]);

  const totals = useMemo(() => {
    const quantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return { quantity, totalAmount };
  }, [state.items]);

  const value = {
    items: state.items,
    totals,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    updateQuantity: (id, size, quantity) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, quantity } }),
    removeItem: (id, size) => dispatch({ type: 'REMOVE_ITEM', payload: { id, size } }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

