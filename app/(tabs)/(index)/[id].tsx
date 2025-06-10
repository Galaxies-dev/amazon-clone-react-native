import SearchBar from '@/components/SearchBar';
import { getArticleById } from '@/utils/api';
import { useHeaderHeight } from '@react-navigation/elements';
import { useQuery } from '@tanstack/react-query';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

const Page = () => {
  const { id } = useLocalSearchParams();
  const headerHeight = useHeaderHeight();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(+id),
  });

  return (
    <View style={{ paddingTop: headerHeight || 120 }}>
      <Stack.Screen
        options={{
          header: () => <SearchBar withBackButton />,
        }}
      />
      <Text className="text-2xl font-bold">Product Details: {id}</Text>

      <Link href={`/(modal)/(3d)/${id}`} asChild>
        <TouchableOpacity>
          <Text>View in 3D</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};
export default Page;
