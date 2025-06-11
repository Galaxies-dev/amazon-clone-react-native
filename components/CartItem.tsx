import { Article } from '@/utils/api';
import { useCartStore } from '@/utils/cartStore';
import { Ionicons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface CartItemProps {
  article: Article & { quantity: number };
}

const CartItem = ({ article }: CartItemProps) => {
  const { addArticle, reduceArticle, removeArticle } = useCartStore();

  return (
    <View className="flex-row items-center bg-white p-3 mb-3 border-b border-gray-200">
      <View className="flex-row items-center gap-2">
        <View className="flex-col">
          <Image
            source={{ uri: article.imageUrl }}
            className="w-20 h-20 rounded-md mr-4"
            resizeMode="cover"
          />
          <Text className="font-bold text-lg mb-2">€{article.price.toFixed(2)}</Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => reduceArticle(article)}
              className="border border-gray-300 rounded-full p-1">
              <Ionicons name="remove" size={18} color="#333" />
            </TouchableOpacity>
            <Text className="mx-2 font-semibold text-base">{article.quantity}</Text>
            <TouchableOpacity
              onPress={() => addArticle(article)}
              className="border border-gray-300 rounded-full p-1">
              <Ionicons name="add" size={18} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 flex-col justify-between">
          <Text className="font-bold text-base mb-1" numberOfLines={1}>
            {article.title}
          </Text>
          <Text className="text-gray-500 text-xs mb-2" numberOfLines={2}>
            {article.description}
          </Text>
          <View className="flex-1" />
          <TouchableOpacity
            onPress={() => removeArticle(article)}
            className="border border-gray-300 rounded-full p-1 w-20 justify-center items-center">
            <Text className="">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
