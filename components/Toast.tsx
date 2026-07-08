import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

type ToastProps = {
    message: string;
    visible: boolean;
    onHide: () => void;
};

export default function Toast({ message, visible, onHide }: ToastProps) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        if (!visible) return;
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start();

        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 20, duration: 200, useNativeDriver: true }),
            ]).start(() => onHide());
        }, 2000);

        return () => clearTimeout(timer);
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
            <Feather name="check-circle" size={18} color="#4CAF50" />
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    toast: {
        position: "absolute",
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: "#0f3460",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: "#e94560",
        zIndex: 999,
    },
    text: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "600",
    },
});
