const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Article {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  glbUrl: null | string;
  createdAt: string;
}

interface Order {
  id: number;
  userId: number;
  createdAt: string;
  items: Item[];
}

interface Item {
  id: number;
  orderId: number;
  articleId: number;
  quantity: number;
  createdAt: string;
  article: Article;
}

export const getArticles = async (): Promise<Article[]> => {
  const response = await fetch(`${API_URL}/articles`);
  return response.json();
};

export const getArticleById = async (id: number): Promise<Article> => {
  const response = await fetch(`${API_URL}/articles/${id}`);
  return response.json();
};

export const createOrder = async (items: (Article & { quantity: number })[], token: string) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    body: JSON.stringify({
      items: items.map((item) => ({ articleId: item.id, quantity: item.quantity })),
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const createPaymentIntent = async (amount: number, email: string) => {
  const response = await fetch(`${API_URL}/orders/payment-sheet`, {
    method: 'POST',
    body: JSON.stringify({ amount, currency: 'usd', email }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

export const getOrders = async (token: string): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
