import OrderListItem from '@/components/OrderListItem';
import { getOrders } from '@/utils/api';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

const Page = () => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken();
      setToken(token);
    };
    loadToken();
  }, [getToken]);

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    enabled: !!token,
    queryFn: () => getOrders(token ?? ''),
  });

  return (
    <View className="flex-1  bg-white">
      {isLoading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      )}
      {data && (
        <FlatList
          data={data}
          ListHeaderComponent={<Text className="text-2xl font-bold">Your Orders</Text>}
          renderItem={({ item }) => <OrderListItem order={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="p-5"
        />
      )}
    </View>
  );
};
export default Page;
