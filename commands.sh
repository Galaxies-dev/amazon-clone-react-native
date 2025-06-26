bunx create-expo amazon-mobile
bunx expo install expo-dev-client 
bun install nativewind tailwindcss@^3.4.17 react-native-reanimated@~3.17.4 react-native-safe-area-context@5.4.0
bun install -D tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11
bunx tailwindcss init

bun install react-hook-form @hookform/resolvers zod  

bun install @clerk/clerk-expo expo-secure-store
bun add @clerk/expo-passkeys
bunx expo install expo-build-properties

bun i @vapi-ai/react-native @daily-co/react-native-daily-js @react-native-async-storage/async-storage@^2.2.0 react-native-background-timer@^2.4.1 react-native-get-random-values@^1.11.0
bun i --save-exact @daily-co/react-native-webrtc@118.0.3-daily.3
bun i @config-plugins/react-native-webrtc
bun i @daily-co/config-plugin-rn-daily-js

bun add @tanstack/react-query
bun add -D @tanstack/eslint-plugin-query

bunx expo install react-native-mmkv@2

bunx @sentry/wizard@latest -i reactNative

bun add @gorhom/bottom-sheet@^5

bun i react-native-filament react-native-worklets-core

bun install zustand

bunx expo install @stripe/stripe-react-native

