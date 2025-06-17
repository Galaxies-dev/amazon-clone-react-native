import CartItem from '@/components/CartItem';
import VapiOverlay from '@/components/VapiOverlay';
import { useCartStore } from '@/utils/cartStore';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { Link } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useMMKVBoolean } from 'react-native-mmkv';

const Page = () => {
  const headerHeight = useHeaderHeight();
  const { articles, total } = useCartStore();
  const [showOverlay, setShowOverlay] = useMMKVBoolean('vapi.overlay');
  return (
    <View className={`flex-1 bg-white`} style={{ paddingTop: headerHeight || 120 }}>
      {showOverlay && <VapiOverlay />}
      {!articles.length && (
        <View className="flex-1 flex-row justify-center gap-10 p-10 pt-20 ">
          <Ionicons name="cart-outline" size={64} className="text-gray-400" />
          <View className="flex-1 items-start">
            <Text className="text-2xl font-bold mb-2">Your cart is empty</Text>
            <Text className="text-base text-gray-500">Nothing in here. Only possibilities</Text>
          </View>
        </View>
      )}

      {!!articles.length && (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CartItem article={item} />}
          contentContainerClassName="bg-white p-4 "
          ListHeaderComponent={
            <View className="bg-white border-b border-gray-200 p-4 pt-12">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-semibold">Subtotal</Text>
                <Text className="text-2xl font-bold">€{total.toFixed(2)}</Text>
              </View>
              <Link href="/(modal)/checkout" asChild>
                <TouchableOpacity className="bg-yellow-400 rounded-full py-4 items-center">
                  <Text className="text-lg font-bold">
                    Proceed to checkout ({articles.length} item{articles.length > 1 ? 's' : ''})
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          }
          stickyHeaderIndices={[0]}
        />
      )}
    </View>
  );
};

export default Page;
