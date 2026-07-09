import SkeletonCard from "@/components/SkeletonCard";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Product = {
    id: number;
    title: string;
    brand: string;
    price: number;
    thumbnail: string;
    discountPercentage: number;
    category: string;
};

export default function SearchScreen() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const timeout = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=20`
                );
                const data = await res.json();
                setResults(data.products ?? []);
            } finally {
                setLoading(false);
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [query]);

    const filtered = results.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Search</Text>
            <View style={styles.searchRow}>
                <Feather name="search" size={18} color="#666" style={{ marginRight: 8 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Search products..."
                    placeholderTextColor="#666"
                    value={query}
                    onChangeText={setQuery}
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery("")}>
                        <Feather name="x" size={18} color="#666" />
                    </TouchableOpacity>
                )}
            </View>

            {loading && (
                <View style={styles.list}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <SkeletonCard key={i} variant="row" />
                    ))}
                </View>
            )}

            {!loading && !query.trim() && (
                <View style={styles.emptyState}>
                    <Feather name="search" size={52} color="#333" />
                    <Text style={styles.emptyText}>Search across all products</Text>
                </View>
            )}

            {!loading && query.trim().length > 0 && filtered.length === 0 && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No results for "{query}"</Text>
                </View>
            )}

            {!loading && (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            activeOpacity={0.7}
                            onPress={() => router.navigate(`/home/${item.category}/${item.id}` as any)}
                        >
                            <Image source={{ uri: item.thumbnail }} style={styles.image} contentFit="contain" />
                            <View style={styles.info}>
                                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.brand}>{item.brand ?? "N/A"}</Text>
                                <Text style={styles.price}>
                                    ${(item.price * (1 - item.discountPercentage / 100)).toFixed(2)}
                                </Text>
                            </View>
                            {item.discountPercentage > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>-{Math.round(item.discountPercentage)}%</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#1a1a2e" },
    header: {
        fontSize: 28, fontWeight: "bold", color: "#ffffff",
        paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
    },
    searchRow: {
        flexDirection: "row", alignItems: "center",
        backgroundColor: "#16213e", borderRadius: 50,
        marginHorizontal: 20, marginBottom: 12,
        paddingHorizontal: 16,
        borderWidth: 1, borderColor: "#0f3460",
    },
    input: { flex: 1, fontSize: 16, color: "#ffffff", paddingVertical: 14 },
    emptyState: { flex: 1, justifyContent: "center", alignItems: "center", gap: 14 },
    emptyText: { color: "#555", fontSize: 16 },
    list: { paddingHorizontal: 20, paddingBottom: 20 },
    card: {
        flexDirection: "row", backgroundColor: "#16213e",
        borderRadius: 12, marginTop: 10, overflow: "hidden",
        borderWidth: 1, borderColor: "#0f3460",
    },
    image: { width: 80, height: 80, backgroundColor: "#1a1a2e" },
    info: { flex: 1, padding: 12, paddingRight: 52, justifyContent: "center" },
    title: { color: "#ffffff", fontSize: 14, fontWeight: "bold" },
    brand: { color: "#888", fontSize: 12, marginTop: 2 },
    price: { color: "#e94560", fontSize: 15, fontWeight: "bold", marginTop: 4 },
    badge: {
        position: "absolute", top: 6, right: 6,
        backgroundColor: "#e94560", borderRadius: 6,
        paddingHorizontal: 5, paddingVertical: 2,
    },
    badgeText: { color: "#ffffff", fontSize: 11, fontWeight: "bold" },
});