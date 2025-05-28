import { Tabs } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ViewStyle } from 'react-native';

// https://github.com/karakeep-app/karakeep/blob/300f3c5d0b661c430ad2f6b479b151ec65f14243/apps/mobile/components/navigation/tabs.tsx

function StyledTabsImpl({
  tabBarStyle,
  headerStyle,
  ...props
}: React.ComponentProps<typeof Tabs> & {
  tabBarStyle?: ViewStyle;
  headerStyle?: ViewStyle;
}) {
  props.screenOptions = {
    ...props.screenOptions,
    tabBarStyle,
    headerStyle,
  };
  return <Tabs {...props} />;
}

export const StyledTabs = cssInterop(StyledTabsImpl, {
  tabBarClassName: 'tabBarStyle',
  headerClassName: 'headerStyle',
});
