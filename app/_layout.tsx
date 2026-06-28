import { CartProvider } from "@/context/CartContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <CartProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </CartProvider>
        </SafeAreaProvider>
    );
}
