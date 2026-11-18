import { Pressable, type GestureResponderEvent, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSettings } from '@/features/settings/SettingsProvider';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  haptic?: boolean;
};

export function PressableScale({ style, scaleTo = 0.97, haptic = true, onPress, onPressIn, onPressOut, ...rest }: Props) {
  const { settings } = useSettings();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  const handlePress = (e: GestureResponderEvent) => {
    if (haptic && settings.vibration) {
      Haptics.selectionAsync().catch(() => {});
    }
    onPress?.(e);
  };

  return (
    <AnimatedPressable
      {...rest}
      onPress={handlePress}
      onPressIn={(e) => {
        scale.set(withTiming(scaleTo, { duration: 90 }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withTiming(1, { duration: 140 }));
        onPressOut?.(e);
      }}
      style={[animated, style]}
    />
  );
}
