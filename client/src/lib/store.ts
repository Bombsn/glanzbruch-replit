import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  isItemInCart: (id: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.id === newItem.id);
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          };
        } else {
          return {
            items: [...state.items, { ...newItem, quantity: 1 }]
          };
        }
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      
      updateQuantity: (id, quantity) => set((state) => ({
        items: quantity <= 0 
          ? state.items.filter(item => item.id !== id)
          : state.items.map(item =>
              item.id === id ? { ...item, quantity } : item
            )
      })),
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      isItemInCart: (id) => {
        const { items } = get();
        return items.some(item => item.id === id);
      }
    }),
    {
      name: 'glanzbruch-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

interface WishlistStore {
  items: WishlistItem[];
  isOpen: boolean;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
  toggleWishlist: () => void;
  getItemCount: () => number;
  isItemInWishlist: (id: string) => boolean;
  moveToCart: (id: string, cartStore: CartStore) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.id === newItem.id);
        if (!existingItem) {
          return {
            items: [...state.items, newItem]
          };
        }
        return state;
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      toggleItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.id === newItem.id);
        if (existingItem) {
          // Remove item if it exists
          return {
            items: state.items.filter(item => item.id !== newItem.id)
          };
        } else {
          // Add item if it doesn't exist
          return {
            items: [...state.items, newItem]
          };
        }
      }),
      
      clearWishlist: () => set({ items: [] }),
      
      toggleWishlist: () => set((state) => ({ isOpen: !state.isOpen })),
      
      getItemCount: () => {
        const { items } = get();
        return items.length;
      },

      isItemInWishlist: (id) => {
        const { items } = get();
        return items.some(item => item.id === id);
      },

      moveToCart: (id, cartStore) => {
        const { items } = get();
        const wishlistItem = items.find(item => item.id === id);
        if (wishlistItem) {
          cartStore.addItem(wishlistItem);
          get().removeItem(id);
        }
      }
    }),
    {
      name: 'glanzbruch-wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
