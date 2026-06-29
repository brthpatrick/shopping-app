import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

export default function SkeletonCard() {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View style={[styles.card, { opacity }]} />
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#16213e",
        height: 56,
        borderRadius: 50,
        marginTop: 20,
    },
});
