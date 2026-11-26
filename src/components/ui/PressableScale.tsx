import { Pressable, type GestureResponderEvent, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSettings } from '@/features/settings/SettingsProvider';
import { motion } from '@/theme/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  haptic?: boolean;
};

export function PressableScale({
  style,
  scaleTo = motion.pressScale,
  haptic = true,
  onPress,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const { settings } = useSettings();
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  const handlePress = (e: GestureResponderEvent) => {
    if (haptic && settings.vibration) {
      void Haptics.selectionAsync().catch(() => {});
    }
    onPress?.(e);
  };

  return (
    <AnimatedPressable
      {...rest}
      onPress={handlePress}
      onPressIn={(e) => {
        scale.set(withTiming(reducedMotion ? 1 : scaleTo, { duration: motion.duration.fast }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withTiming(1, { duration: motion.duration.normal }));
        onPressOut?.(e);
      }}
      style={[animated, style]}
    />
  );
}
