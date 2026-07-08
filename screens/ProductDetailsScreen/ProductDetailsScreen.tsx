import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import useFetch from "@/hooks/useFetch";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { Dimensions, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Toast from "@/components/Toast";


export default function ProductDetailsScreen() {
    const { width } = Dimensions.get("window");
    const { productdetails } = useLocalSearchParams<{ productdetails: string }>();
    const router = useRouter();
    const { addToCart, cartItems } = useCart();
    const { data: product } = useFetch(`https://dummyjson.com/products/${productdetails}`);
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const [toast, setToast] = useState(false);
    const favorited = product ? isFavorite(product.id) : false;
    const [quantity, setQuantity] = useState<number | null>(null);
    const inCart = cartItems.find((item) => item.id === product?.id)?.quantity ?? 0;
    const displayQuantity = quantity ?? (inCart || 1);
    const [showReviews, setShowReviews] = useState(false);

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
                    <TouchableOpacity
                        style={styles.heartButton}
                        onPress={() => {
                            if (!product) return;
                            if (favorited) {
                                removeFavorite(product.id);
                            } else {
                                addFavorite({
                                    id: product.id,
                                    title: product.title,
                                    brand: product.brand ?? "N/A",
                                    price: product.price,
                                    thumbnail: product.thumbnail,
                                    discountPercentage: product.discountPercentage,
                                    rating: product.rating,
                                    category: product.category,
                                });
                            }
                        }}
                    >
                        <Feather name="heart" size={20} color={favorited ? "#e94560" : "#ffffff"} />
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

                    <TouchableOpacity style={styles.ratingRow} onPress={() => setShowReviews(true)}>
                        <StarRating rating={product.rating} />
                        <Text style={styles.ratingText}>{product.rating} (Reviews Score) →</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Brand</Text>
                    <Text style={styles.sectionValue}>{product.brand ?? "N/A"}</Text>

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.sectionValue}>{product.description}</Text>

                    <View style={styles.footer}>
                        <View>
                            <Text style={styles.priceLabel}>Total Price</Text>
                            {product.discountPercentage > 0 && (
                                <Text style={styles.originalPrice}>
                                    ${(product.price * displayQuantity).toFixed(2)}
                                </Text>
                            )}
                            <Text style={styles.price}>
                                ${(product.price * (1 - product.discountPercentage / 100) * displayQuantity).toFixed(2)}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.addButton} onPress={() => {
                            addToCart({
                                id: product.id,
                                title: product.title,
                                brand: product.brand ?? "N/A",
                                price: Math.round(product.price * (1 - product.discountPercentage / 100) * 100) / 100,
                                thumbnail: product.thumbnail,
                                stock: product.stock,
                            }, displayQuantity);
                            setToast(true);
                        }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                <Feather name="shopping-cart" size={18} color="#ffffff" />
                                <Text style={styles.addButtonText}>Add to cart</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal visible={showReviews} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.reviewModal}>
                            <View style={styles.reviewModalHeader}>
                                <Text style={styles.reviewModalTitle}>Reviews</Text>
                                <TouchableOpacity onPress={() => setShowReviews(false)}>
                                    <Feather name="x" size={24} color="#ffffff" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {(product.reviews ?? []).map((review: any, index: number) => (
                                    <View key={index} style={styles.reviewCard}>
                                        <View style={styles.reviewHeader}>
                                            <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                                            <StarRating rating={review.rating} />
                                        </View>
                                        <Text style={styles.reviewComment}>{review.comment}</Text>
                                        <Text style={styles.reviewDate}>
                                            {new Date(review.date).toLocaleDateString()}
                                        </Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
            <Toast message="Added to cart!" visible={toast} onHide={() => setToast(false)} />
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
    originalPrice: {
        color: "#888",
        fontSize: 14,
        textDecorationLine: "line-through",
    },
    reviewCard: {
        backgroundColor: "#1a1a2e",
        borderRadius: 12,
        padding: 14,
        marginTop: 10,
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    reviewerName: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "bold",
    },
    reviewRating: {
        flexDirection: "row",
    },
    reviewComment: {
        color: "#ccc",
        fontSize: 13,
        marginTop: 6,
    },
    reviewDate: {
        color: "#666",
        fontSize: 11,
        marginTop: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end",
    },
    reviewModal: {
        backgroundColor: "#16213e",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: "70%",
    },
    reviewModalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    reviewModalTitle: {
        color: "#ffffff",
        fontSize: 22,
        fontWeight: "bold",
    },
    heartButton: {
        position: "absolute",
        top: 10,
        right: 20,
        zIndex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});
