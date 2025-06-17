import { Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
const VapiOverlay = () => {
  return (
    <Animated.View
      className="bg-white top-[70px] w-full h-full z-20"
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(400)}>
      <Text className="text-white">VapiOverlay</Text>
    </Animated.View>
  );
};
export default VapiOverlay;
