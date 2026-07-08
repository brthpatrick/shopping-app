import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <CartProvider>
                <FavoritesProvider>
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    </Stack>
                </FavoritesProvider>
            </CartProvider>
        </SafeAreaProvider>
    );
}
