import CustomTabBar from '@/components/navigation/CustomTabBar';
import { StyledTabs } from '@/components/navigation/tabs';
import { useCartStore } from '@/utils/cartStore';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

const Layout = () => {
  const router = useRouter();
  const { count } = useCartStore();
  return (
    <StyledTabs headerClassName="bg-dark" tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen
        name="(index)"
        options={{
          headerShown: false,
          title: '',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="relative">
              <Ionicons name="cart-outline" color={color} size={size} />
              <View className="absolute -top-2 h-4 w-4 -right-4">
                <Text className="text-md font-bold">{count}</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="rufus"
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push('/(modal)/rufus');
          },
        })}
      />
    </StyledTabs>
  );
};
export default Layout;
