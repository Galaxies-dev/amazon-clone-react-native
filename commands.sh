bunx create-expo amazon-mobile
bunx expo install expo-dev-client 
bun install nativewind tailwindcss@^3.4.17 react-native-reanimated@3.16.2 react-native-safe-area-context
bunx tailwindcss init

bun install @clerk/clerk-expo expo-secure-store
bun add @tanstack/react-query
bun add -D @tanstack/eslint-plugin-query
bun install zustand
bun install react-hook-form @hookform/resolvers zod  
bunx expo install react-native-mmkv
bun install --save-dev react-query-external-sync socket.io-client