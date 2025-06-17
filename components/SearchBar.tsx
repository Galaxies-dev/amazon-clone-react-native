import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, TextInput, TouchableOpacity, View } from 'react-native';
import { useMMKVBoolean } from 'react-native-mmkv';
import Animated, { FadeInLeft, FadeOutLeft } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
interface SearchBarProps {
  withBackButton?: boolean;
}
const SearchBar = ({ withBackButton = false }: SearchBarProps) => {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useMMKVBoolean('vapi.overlay');

  const onBackPress = () => {
    if (showOverlay) {
      setShowOverlay(false);
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 flex-row items-center bg-dark min-h-36 pt-safe px-3">
      {(withBackButton || showOverlay) && (
        <AnimatedTouchableOpacity onPress={onBackPress} entering={FadeInLeft} exiting={FadeOutLeft}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </AnimatedTouchableOpacity>
      )}
      <View className="flex-row items-center flex-1 bg-white rounded-md px-3 py-3 mx-3 gap-4">
        <Ionicons name="search" size={22} className="text-gray-500" />
        <TextInput
          className="flex-1 text-black"
          placeholder="Search or ask a question"
          placeholderTextColor="#888"
          returnKeyType="search"
        />
        <Pressable>
          <Ionicons name="camera-outline" size={22} className="text-gray-500" />
        </Pressable>
        <Pressable onPress={() => setShowOverlay(true)}>
          <Ionicons name="mic-outline" size={22} className="text-gray-500" />
        </Pressable>
      </View>
    </View>
  );
};

export default SearchBar;
