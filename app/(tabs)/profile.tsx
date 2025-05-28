import amazonLogo from '@/assets/images/amazon-logo-white.png';
import { SignedOut } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const Page = () => {
  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => (
            <Image source={amazonLogo} style={{ width: 100, height: 30, paddingLeft: 12 }} />
          ),
          headerRight: () => (
            <View className="flex-row items-center gap-6 pr-4">
              <Ionicons name="settings-outline" size={24} color="white" />
              <Ionicons name="search-outline" size={24} color="white" />
            </View>
          ),
        }}
      />

      <SignedOut>
        <View className="pt-10 px-8 items-center">
          <Text className="text-3xl text-center">Sign in for the optimal experience</Text>
        </View>
        <View className="mt-8 w-full px-8">
          <Link href="/signIn" asChild>
            <TouchableOpacity className="bg-primary py-3 px-4 border border-dark">
              <Text className="text-center text-base text-dark">Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SignedOut>
    </View>
  );
};
export default Page;
