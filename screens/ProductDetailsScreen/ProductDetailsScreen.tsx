import useFetch from "@/hooks/useFetch";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetailsScreen() {
    const { productdetails } = useLocalSearchParams<{ productdetails: string }>();
    const router = useRouter();
    const { data: product } = useFetch(`https://dummyjson.com/products/${productdetails}`);

    if (!product) return null;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                    <Image source={{ uri: product.thumbnail }} style={styles.image} contentFit="contain" />
                </View>

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{product.title}</Text>
                            <Text style={styles.category}>{product.category}</Text>
                        </View>
                        <View style={styles.quantityRow}>
                            <TouchableOpacity style={styles.quantityButton}>
                                <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>1</Text>
                            <TouchableOpacity style={styles.quantityButton}>
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.stock}>
                        {product.stock > 0 ? "Available in stock" : "Out of stock"}
                    </Text>

                    <View style={styles.ratingRow}>
                        <StarRating rating={product.rating} />
                        <Text style={styles.ratingText}>{product.rating} (Reviews Score)</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Brand</Text>
                    <Text style={styles.sectionValue}>{product.brand ?? "N/A"}</Text>

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.sectionValue}>{product.description}</Text>

                    <View style={styles.footer}>
                        <View>
                            <Text style={styles.priceLabel}>Total Price</Text>
                            <Text style={styles.price}>${product.price}</Text>
                        </View>
                        <TouchableOpacity style={styles.addButton}>
                            <Text style={styles.addButtonText}>🛒 Add to cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function StarRating({ rating }: { rating: number }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)));
        stars.push(
            <View key={i} style={starStyles.starContainer}>
                <Text style={starStyles.emptyStar}>★</Text>
                <View style={[starStyles.filledOverlay, { width: `${fill * 100}%` }]}>
                    <Text style={starStyles.filledStar}>★</Text>
                </View>
            </View>
        );
    }
    return <View style={starStyles.row}>{stars}</View>;
}

const starStyles = StyleSheet.create({
    row: {
        flexDirection: "row",
    },
    starContainer: {
        position: "relative",
        width: 20,
        height: 20,
    },
    emptyStar: {
        fontSize: 18,
        color: "#555",
    },
    filledOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        overflow: "hidden",
    },
    filledStar: {
        fontSize: 18,
        color: "#FFD700",
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1a2e",
    },
    imageContainer: {
        position: "relative",
    },
    backButton: {
        position: "absolute",
        top: 10,
        left: 20,
        zIndex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    backText: {
        color: "#ffffff",
        fontSize: 20,
    },
    image: {
        width: "100%",
        height: 300,
        backgroundColor: "#1a1a2e",
    },
    content: {
        backgroundColor: "#16213e",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
        padding: 20,
        flex: 1,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#ffffff",
    },
    category: {
        fontSize: 14,
        color: "#888",
        marginTop: 4,
    },
    quantityRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a2e",
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    quantityButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    quantityButtonText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
    },
    quantityText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        marginHorizontal: 8,
    },
    stock: {
        color: "#4CAF50",
        fontWeight: "bold",
        fontSize: 14,
        marginTop: 12,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },
    ratingText: {
        color: "#ffffff",
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
        marginTop: 20,
    },
    sectionValue: {
        fontSize: 14,
        color: "#888",
        marginTop: 4,
        lineHeight: 20,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#0f3460",
    },
    priceLabel: {
        color: "#888",
        fontSize: 12,
    },
    price: {
        color: "#e94560",
        fontSize: 24,
        fontWeight: "bold",
    },
    addButton: {
        backgroundColor: "#e94560",
        borderRadius: 50,
        paddingVertical: 14,
        paddingHorizontal: 24,
    },
    addButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
