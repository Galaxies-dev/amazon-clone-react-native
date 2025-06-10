import { StyledStack } from '@/components/navigation/stack';
import '@/global.css';
import { storage } from '@/utils/storage';
import { ClerkLoaded, ClerkProvider, useUser } from '@clerk/clerk-expo';
import { passkeys } from '@clerk/clerk-expo/passkeys';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { LogBox, Platform, TouchableOpacity, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSyncQueriesExternal } from 'react-query-external-sync';

// Create your query client
const queryClient = new QueryClient();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}
LogBox.ignoreLogs(['Clerk: Clerk has been loaded with development keys']);
LogBox.ignoreLogs(['[ios] Socket connection error: websocket error']);

cssInterop(Ionicons, {
  className: {
    target: false,
    nativeStyleToProp: {
      color: true,
    },
  },
});

const InitialLayout = () => {
  const user = useUser();
  const router = useRouter();

  // useEffect(() => {
  //   if (user && user.user) {
  //     Sentry.setUser({ email: user.user.emailAddresses[0].emailAddress, id: user.user.id });
  //   } else {
  //     Sentry.setUser(null);
  //   }
  // }, [user]);

  // if (!fontsLoaded) {
  //   return null;
  // }

  return (
    <StyledStack
      contentClassName="bg-gray-100 dark:bg-background"
      headerClassName="bg-dark text-white">
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="signIn"
        options={{
          presentation: 'fullScreenModal',
          title: 'Amazon',
        }}
      />
      <Stack.Screen
        name="(modal)/rufus"
        options={{
          title: 'Rufus',
          headerTintColor: '#000',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Ionicons name="close" size={24} className="text-gray-400" />
            </TouchableOpacity>
          ),
          presentation: 'formSheet',
          sheetAllowedDetents: [0.45, 0.95],
          sheetInitialDetentIndex: 0,
          sheetGrabberVisible: true,
          contentStyle: {
            backgroundColor: '#fff',
          },
          // sheetLargestUndimmedDetentIndex: 'last',
        }}
      />
    </StyledStack>
  );
};

const RootLayout = () => {
  const colorScheme = useColorScheme();
  // Set up the sync hook - automatically disabled in production!
  useSyncQueriesExternal({
    queryClient,
    socketURL: 'http://localhost:42831', // Default port for React Native DevTools
    deviceName: Platform?.OS || 'web', // Platform detection
    platform: Platform?.OS || 'web', // Use appropriate platform identifier
    deviceId: Platform?.OS || 'web', // Use a PERSISTENT identifier (see note below)
    extraDeviceInfo: {
      // Optional additional info about your device
      appVersion: '1.0.0',
      // Add any relevant platform info
    },
    enableLogs: false,
    envVariables: {
      NODE_ENV: process.env.NODE_ENV,
      // Add any private environment variables you want to monitor
      // Public environment variables are automatically loaded
    },
    // Storage monitoring with CRUD operations
    mmkvStorage: storage, // MMKV storage for ['#storage', 'mmkv', 'key'] queries + monitoring
    // asyncStorage: AsyncStorage, // AsyncStorage for ['#storage', 'async', 'key'] queries + monitoring
    // secureStorage: SecureStore, // SecureStore for ['#storage', 'secure', 'key'] queries + monitoring
    // secureStorageKeys: [
    //   "userToken",
    //   "refreshToken",
    //   "biometricKey",
    //   "deviceId",
    // ], // SecureStore keys to monitor
  });

  return (
    <ClerkProvider
      publishableKey={publishableKey!}
      tokenCache={tokenCache}
      __experimental_passkeys={passkeys}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <InitialLayout />
            </ThemeProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default RootLayout;
