import { useRef } from "react";
import { Animated, TouchableWithoutFeedback, ViewStyle } from "react-native";

type Props = {
    onPress: () => void;
    style?: ViewStyle;
    children: React.ReactNode;
};

export default function AnimatedButton({ onPress, style, children }: Props) {
    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableWithoutFeedback onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
            <Animated.View style={[style, { transform: [{ scale }] }]}>
                {children}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}
