import { useCart } from "@/context/CartContext";
import useFetch from "@/hooks/useFetch";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";


export default function ProductDetailsScreen() {
    const { width } = Dimensions.get("window");
    const { productdetails } = useLocalSearchParams<{ productdetails: string }>();
    const router = useRouter();
    const { addToCart, cartItems } = useCart();
    const { data: product } = useFetch(`https://dummyjson.com/products/${productdetails}`);
    const [quantity, setQuantity] = useState<number | null>(null);
    const inCart = cartItems.find((item) => item.id === product?.id)?.quantity ?? 0;
    const displayQuantity = quantity ?? (inCart || 1);

    useFocusEffect(
        useCallback(() => {
            setQuantity(null);
        }, [])
    );


    if (!product) return null;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Feather name="arrow-left" size={20} color="#ffffff" />
                    </TouchableOpacity>
                    <FlatList
                        data={product.images ?? [product.thumbnail]}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={[styles.image, { width }]} contentFit="contain" />
                        )}
                    />
                </View>
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{product.title}</Text>
                            <Text style={styles.category}>{product.category}</Text>
                        </View>
                        <View style={styles.quantityRow}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(Math.max(1, displayQuantity - 1))}
                            >
                                <Feather name="minus" size={16} color="#ffffff" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{displayQuantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => {
                                    if (displayQuantity < product.stock) {
                                        setQuantity(displayQuantity + 1);
                                    }
                                }}
                            >
                                <Feather name="plus" size={16} color="#ffffff" />
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
                            <Text style={styles.price}>${(product.price * displayQuantity).toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={styles.addButton} onPress={() => {
                            addToCart({
                                id: product.id,
                                title: product.title,
                                brand: product.brand ?? "N/A",
                                price: product.price,
                                thumbnail: product.thumbnail,
                                stock: product.stock,
                            }, displayQuantity);
                            router.push("/(tabs)/basket" as any);
                        }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                <Feather name="shopping-cart" size={18} color="#ffffff" />
                                <Text style={styles.addButtonText}>Add to cart</Text>
                            </View>
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
