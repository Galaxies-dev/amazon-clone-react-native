import rufusIcon from '@/assets/images/rufus.png';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import React from 'react';
import { Image, View } from 'react-native';

// https://salamina.tech/blog/post/custom-tab-bar-tab-navigation-expo-react-native/
export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View className="flex-row h-15 bg-white">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            className={`flex-1 items-center justify-center py-4 pb-safe`}>
            {options.tabBarIcon && route.name !== 'rufus' ? (
              options.tabBarIcon({
                focused: isFocused,
                color: 'black',
                size: 24,
              })
            ) : (
              <Image source={rufusIcon} style={{ width: 40, height: 40 }} />
            )}
          </PlatformPressable>
        );
      })}
    </View>
  );
}
