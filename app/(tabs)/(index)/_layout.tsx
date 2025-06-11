import { StyledStack } from '@/components/navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
const Laoyut = () => {
  const router = useRouter();
  return (
    <StyledStack
      contentClassName="bg-gray-100 dark:bg-background"
      headerClassName="bg-dark text-white">
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[id]"
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="modal"
        options={{ presentation: 'formSheet', sheetAllowedDetents: [0.1, 0.6] }}
      />
    </StyledStack>
  );
};
export default Laoyut;
