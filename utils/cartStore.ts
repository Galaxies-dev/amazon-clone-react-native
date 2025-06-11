import { Article } from '@/utils/api';
import { zustandStorage } from '@/utils/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface CartState {
  articles: Array<Article & { quantity: number }>;
  addArticle: (article: Article) => void;
  reduceArticle: (article: Article) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const INITIAL_STATE = {
  articles: [],
  total: 0,
  count: 0,
};

function recalculate(articles: Array<Article & { quantity: number }>) {
  const total = articles.reduce((sum, a) => sum + a.price * a.quantity, 0);
  const count = articles.reduce((sum, a) => sum + a.quantity, 0);
  return { total, count };
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      addArticle: (article) => {
        set((state) => {
          let found = false;
          const articles = state.articles.map((a) => {
            if (a.id === article.id) {
              found = true;
              return { ...a, quantity: a.quantity + 1 };
            }
            return a;
          });
          const newArticles = found ? articles : [...state.articles, { ...article, quantity: 1 }];
          const { total, count } = recalculate(newArticles);
          return { articles: newArticles, total, count };
        });
      },
      reduceArticle: (article) => {
        set((state) => {
          const articles = state.articles
            .map((a) => (a.id === article.id ? { ...a, quantity: a.quantity - 1 } : a))
            .filter((a) => a.quantity > 0);
          const { total, count } = recalculate(articles);
          return { articles, total, count };
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
