import { useFavorites } from "@/context/FavoritesContext";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesScreen() {
    const { favorites, removeFavorite, clearFavorites } = useFavorites();
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Favorites</Text>
                {favorites.length > 0 && (
                    <TouchableOpacity onPress={clearFavorites}>
                        <Text style={styles.clearText}>Clear all</Text>
                    </TouchableOpacity>
                )}
            </View>

            {favorites.length === 0 ? (
                <View style={styles.emptyState}>
                    <Feather name="heart" size={52} color="#333" />
                    <Text style={styles.emptyTitle}>No favorites yet</Text>
                    <Text style={styles.emptySubText}>Tap the heart on a product to save it</Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            activeOpacity={0.7}
                            onPress={() => router.navigate(`/home/${item.category}/${item.id}` as any)}
                        >
                            <Image source={{ uri: item.thumbnail }} style={styles.image} contentFit="contain" />
                            <TouchableOpacity style={styles.heartButton} onPress={() => removeFavorite(item.id)}>
                                <Feather name="heart" size={16} color="#e94560" />
                            </TouchableOpacity>
                            {item.discountPercentage > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>-{Math.round(item.discountPercentage)}%</Text>
                                </View>
                            )}
                            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.brand}>{item.brand ?? "N/A"}</Text>
                            <Text style={styles.price}>
                                ${(item.price * (1 - item.discountPercentage / 100)).toFixed(2)}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#1a1a2e" },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    header: { fontSize: 28, fontWeight: "bold", color: "#ffffff" },
    clearText: { color: "#e94560", fontSize: 14, fontWeight: "600" },
    emptyState: { flex: 1, justifyContent: "center", alignItems: "center", gap: 14 },
    emptyTitle: { fontSize: 18, color: "#888", fontWeight: "bold" },
    emptySubText: { fontSize: 14, color: "#555", textAlign: "center", paddingHorizontal: 40 },
    list: { paddingHorizontal: 20, paddingBottom: 20 },
    row: { justifyContent: "space-between" },
    card: {
        backgroundColor: "#16213e", borderRadius: 16,
        marginTop: 16, width: "48%", overflow: "hidden", paddingBottom: 12,
    },
    image: { width: "100%", height: 140, backgroundColor: "#1a1a2e" },
    heartButton: {
        position: "absolute", top: 8, right: 8,
        backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 14,
        width: 28, height: 28, justifyContent: "center", alignItems: "center",
    },
    badge: {
        position: "absolute", top: 8, left: 8,
        backgroundColor: "#e94560", borderRadius: 8,
        paddingHorizontal: 6, paddingVertical: 2,
    },
    badgeText: { color: "#ffffff", fontSize: 11, fontWeight: "bold" },
    title: { color: "#ffffff", fontSize: 14, fontWeight: "bold", marginTop: 8, paddingHorizontal: 10 },
    brand: { color: "#888", fontSize: 12, paddingHorizontal: 10, marginTop: 2 },
    price: { color: "#e94560", fontSize: 16, fontWeight: "bold", paddingHorizontal: 10, marginTop: 4 },
});
