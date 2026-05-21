import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TouchableScaleProps extends PressableProps {
    children: React.ReactNode;
    style?: any;
}

export default function TouchableScale({ children, onPress, style, ...props }: TouchableScaleProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            onPressIn={() => (scale.value = withSpring(0.92))}
            onPressOut={() => (scale.value = withSpring(1))}
            onPress={onPress}
            style={[style, animatedStyle]}
            {...props}
        >
            {children}
        </AnimatedPressable>
    );
}