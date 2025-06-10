// import { useAuth } from "@clerk/clerk-expo";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface Article {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  glbUrl: null | string;
  createdAt: string;
}

export const getArticles = async (): Promise<Article[]> => {
  const response = await fetch(`${API_URL}/articles`);
  return response.json();
};

// const createJWT = async () => {
//   const { getToken } = useAuth();

//   const token = await getToken();
//   console.log('🚀 ~ createJWT ~ token:', token);
// };

// const fetchOrders = async () => {
//   const { getToken } = useAuth();

//   const token = await getToken();
//   console.log('fetch...');

//   // console.log('🚀 ~ fetchOrders ~ token:', token);
//   const response = await fetch('http://localhost:3000/orders', {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   console.log('response...');

//   const data = await response.json();
//   console.log('🚀 ~ fetchOrders ~ data:', data);
// };

// export const getProducts = async (): Promise<Product[]> => {
//   const response = await fetch(`${API_URL}/products`);
//   const fake = {
//     title: 'Shiny product',
//     price: 109.95,
//     description: 'Looks like a regular product',
//     category: "men's clothing",
//     image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
//     rating: { rate: 3.9, count: 120 },
//   };
//   const json = await response.json();
//   return [...json, fake];
// };

// export const getProduct = async (id: number): Promise<Product> => {
//   const response = await fetch(`${API_URL}/products/${id}`);
//   return response.json();
// };

// export const getCategories = async (): Promise<string[]> => {
//   const response = await fetch(`${API_URL}/products/categories`);
//   return response.json();
// };
