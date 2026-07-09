import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

type SkeletonCardProps = {
    variant?: "category" | "product" | "row";
};

export default function SkeletonCard({ variant = "category" }: SkeletonCardProps) {
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
        <Animated.View style={[
            styles.base,
            variant === "product" ? styles.product : variant === "row" ? styles.row : styles.category,
            { opacity }
        ]} />
    );
}

const styles = StyleSheet.create({
    base: {
        backgroundColor: "#16213e"
    },
    product: {
        height: 180,
        borderRadius: 16,
        marginTop: 16,
        width: "48%"
    },
    category: {
        height: 56,
        borderRadius: 50,
        marginTop: 20
    },
    row: {
        height: 80,
        borderRadius: 12,
        marginTop: 10
    },
});
