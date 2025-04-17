import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform, StyleSheet, View } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const isWeb = Platform.OS === 'web';

  return (
    <PlatformPressable
      {...props}
      style={[isWeb && styles.webButton, props.style]}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}>
      {props.children}
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  webButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});
