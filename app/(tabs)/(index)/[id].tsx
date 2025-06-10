import SearchBar from '@/components/SearchBar';
import { useHeaderHeight } from '@react-navigation/elements';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
const Page = () => {
  const { id } = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  return (
    <View style={{ paddingTop: headerHeight || 120 }}>
      <Stack.Screen
        options={{
          header: () => <SearchBar withBackButton />,
        }}
      />
      <Text className="text-2xl font-bold">Product Details: {id}</Text>
    </View>
  );
};
export default Page;
