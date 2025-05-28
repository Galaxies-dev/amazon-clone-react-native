import { Stack } from 'expo-router/stack';
import { cssInterop } from 'nativewind';
import { TextStyle, ViewStyle } from 'react-native';

// https://github.com/karakeep-app/karakeep/blob/300f3c5d0b661c430ad2f6b479b151ec65f14243/apps/mobile/components/navigation/stack.tsx
interface StackProps extends React.ComponentProps<typeof Stack> {
  contentStyle?: ViewStyle;
  headerStyle?: TextStyle;
}

function StackImpl({ contentStyle, headerStyle, ...props }: StackProps) {
  props.screenOptions = {
    ...props.screenOptions,
    contentStyle,
    headerStyle: {
      backgroundColor: headerStyle?.backgroundColor?.toString(),
    },
    navigationBarColor: contentStyle?.backgroundColor?.toString(),
    headerTintColor: headerStyle?.color?.toString(),
  };
  return <Stack {...props} />;
}

// Changing this requires reloading the app
export const StyledStack = cssInterop(StackImpl, {
  contentClassName: 'contentStyle',
  headerClassName: 'headerStyle',
});
