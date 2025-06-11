bunx create-expo amazon-mobile
bunx expo install expo-dev-client 
bun install nativewind tailwindcss@^3.4.17 react-native-reanimated@3.16.2 react-native-safe-area-context
bunx tailwindcss init

bun install @clerk/clerk-expo expo-secure-store
bun add @clerk/expo-passkeys
bunx expo install expo-build-properties

bun add @tanstack/react-query
bun add -D @tanstack/eslint-plugin-query
bun install zustand
bun install react-hook-form @hookform/resolvers zod  
bunx expo install react-native-mmkv
bun install --save-dev react-query-external-sync socket.io-client


bun i @vapi-ai/react-native @daily-co/react-native-daily-js @react-native-async-storage/async-storage@^1.15.7 react-native-background-timer@^2.3.1 react-native-get-random-values@^1.9.0
bun i --save-exact @daily-co/react-native-webrtc@118.0.3-daily.1
bun i @config-plugins/react-native-webrtc
bun i @daily-co/config-plugin-rn-daily-js


bun i react-native-filament react-native-worklets-core

bun add @gorhom/bottom-sheet@^5