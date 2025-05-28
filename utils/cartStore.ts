import { zustandStorage } from '@/utils/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export interface Rating {
  rate: number;
  count: number;
}

export interface CartState {
  products: Array<Product & { quantity: number }>;
  addProduct: (product: Product) => void;
  reduceProduct: (product: Product) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const INITIAL_STATE = {
  products: [],
  total: 0,
  count: 0,
};

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      addProduct: (product) => {
        set((state) => {
          const hasProduct = state.products.find((p) => p.id === product.id);
          const newTotal = +state.total.toFixed(2) + +product.price.toFixed(2);
          const newCount = state.count + 1;

          if (hasProduct) {
            return {
              products: state.products.map((p) =>
                p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
              ),
              total: +newTotal.toFixed(2),
              count: newCount,
            };
          } else {
            return {
              products: [...state.products, { ...product, quantity: 1 }],
              total: +newTotal.toFixed(2),
              count: newCount,
            };
          }
        });
      },
      reduceProduct: (product) => {
        set((state) => {
          const newTotal = +state.total.toFixed(2) - +product.price.toFixed(2);
          const newCount = state.count - 1;

          return {
            products: state.products
              .map((p) => {
                if (p.id === product.id) {
                  return { ...p, quantity: p.quantity - 1 };
                }
                return p;
              })
              .filter((p) => p.quantity > 0),
            total: newTotal,
            count: newCount,
          };
        });
      },
      clearCart: () => {
        set(INITIAL_STATE);
      },
    }),
    {
      name: 'cart',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useCartStore;
