import SkeletonCard from "@/components/SkeletonCard";
import useFetch from "@/hooks/useFetch";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Product = {
    id: number;
    title: string;
    brand: string;
    price: number;
    thumbnail: string;
    discountPercentage: number;
};

export default function ProductsScreen() {
    const { products } = useLocalSearchParams<{ products: string }>();
    const router = useRouter();
    const { data, isLoading, refetch } = useFetch(
        `https://dummyjson.com/products/category/${products}`
    );
    const productList: Product[] = data?.products ?? [];

    const categoryTitle = products
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    if (!data) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Feather name="arrow-left" size={20} color="#ffffff" />
                    </TouchableOpacity>
                    <Text style={styles.header}>{categoryTitle}</Text>
                </View>
                <View style={styles.skeletonGrid}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <SkeletonCard key={i} variant="product" />
                    ))}
                </View>
            </SafeAreaView>
        );
    }

    const renderItem = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.navigate(`/home/${products}/${item.id}` as any)}
        >
            <Image source={{ uri: item.thumbnail }} style={styles.image} contentFit="contain" />
            {item.discountPercentage > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>-{Math.round(item.discountPercentage)}%</Text>
                </View>
            )}
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.brand}>{item.brand}</Text>
            <Text style={styles.price}>${(item.price * (1 - item.discountPercentage / 100)).toFixed(2)}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={20} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.header}>{categoryTitle}</Text>
            </View>
            <FlatList
                data={productList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#1a1a2e" },
    header: { fontSize: 28, fontWeight: "bold", color: "#ffffff", marginLeft: 12 },
    headerRow: {
        flexDirection: "row", alignItems: "center",
        paddingTop: 10, paddingHorizontal: 20, paddingBottom: 8,
    },
    skeletonGrid: {
        flexDirection: "row", flexWrap: "wrap",
        justifyContent: "space-between", paddingHorizontal: 20,
    },
    list: { paddingHorizontal: 20, paddingBottom: 20 },
    row: { justifyContent: "space-between" },
    card: {
        backgroundColor: "#16213e", borderRadius: 16,
        marginTop: 16, width: "48%", overflow: "hidden", paddingBottom: 12,
    },
    image: { width: "100%", height: 140, backgroundColor: "#1a1a2e" },
    badge: {
        position: "absolute", top: 8, left: 8,
        backgroundColor: "#e94560", borderRadius: 8,
        paddingHorizontal: 6, paddingVertical: 2,
    },
    badgeText: { color: "#ffffff", fontSize: 11, fontWeight: "bold" },
    title: { color: "#ffffff", fontSize: 14, fontWeight: "bold", marginTop: 8, paddingHorizontal: 10 },
    brand: { color: "#888", fontSize: 12, paddingHorizontal: 10, marginTop: 2 },
    price: { color: "#e94560", fontSize: 16, fontWeight: "bold", paddingHorizontal: 10, marginTop: 4 },
    backButton: {
        backgroundColor: "#16213e", width: 40, height: 40,
        borderRadius: 20, justifyContent: "center", alignItems: "center",
    },
});
