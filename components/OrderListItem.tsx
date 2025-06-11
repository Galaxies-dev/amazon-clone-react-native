import { Article } from '@/utils/api';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface Item {
  id: number;
  orderId: number;
  articleId: number;
  quantity: number;
  createdAt: string;
  article: Article;
}

interface Order {
  id: number;
  userId: number;
  createdAt: string;
  items: Item[];
}

interface OrderListItemProps {
  order: Order;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getOrderTotal = (items: Item[]) => {
  return items.reduce((sum, item) => sum + item.article.price * item.quantity, 0);
};

const OrderListItem: React.FC<OrderListItemProps> = ({ order }) => {
  const mainImage = order.items[0]?.article.imageUrl;
  const orderTotal = getOrderTotal(order.items);
  const itemSummary = order.items
    .map((item) => `${item.article.title} x${item.quantity}`)
    .join(', ');

  return (
    <View className="flex-row items-center bg-white p-4 mb-3 rounded-lg border border-gray-200">
      {mainImage ? (
        <Image
          source={{ uri: mainImage }}
          className="w-16 h-16 rounded-md mr-4"
          resizeMode="cover"
        />
      ) : (
        <View className="w-16 h-16 rounded-md mr-4 bg-gray-200 justify-center items-center">
          <Text className="text-gray-400">No Image</Text>
        </View>
      )}
      <View className="flex-1">
        <Text className="font-bold text-base mb-1">Order #{order.id}</Text>
        <Text className="text-gray-500 text-xs mb-1">{formatDate(order.createdAt)}</Text>
        <Text className="text-gray-700 text-sm mb-1" numberOfLines={2}>
          {itemSummary}
        </Text>
        <Text className="font-bold text-lg mt-1">€{orderTotal.toFixed(2)}</Text>
      </View>
    </View>
  );
};

export default OrderListItem;
