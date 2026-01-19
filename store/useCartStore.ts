import { create } from 'zustand';

// Define the shape of a Cart Item
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  addedAt?: number; // 👈 New: Tracks when item was added
}

interface CartState {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product) => {
    const now = Date.now();
    set((state) => {
      const existingItem = state.items.find((item) => item._id === product._id);
      
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1, addedAt: now } // Update time on add
              : item
          ),
        };
      } else {
        return {
          items: [...state.items, { ...product, quantity: 1, addedAt: now }],
        };
      }
    });
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item._id !== id),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));