import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

type CartItem = {
    id: number;
    title: string;
    brand: string;
    price: number;
    quantity: number;
    thumbnail: string;
};

const MOCK_CART: CartItem[] = [
    {
        id: 1,
        title: "Calvin Klein CK One",
        brand: "Calvin Klein",
        price: 49,
        quantity: 2,
        thumbnail: "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
    },
    {
        id: 2,
        title: "Chanel Coco Noir",
        brand: "Chanel",
        price: 129,
        quantity: 1,
        thumbnail: "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp",
    },
];


export default function BasketScreen() {
    const totalProducts = MOCK_CART.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = MOCK_CART.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const renderItem = ({ item }: { item: CartItem }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.thumbnail }} style={styles.image} resizeMode="cover" />
            <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteText}>🗑</Text>
            </TouchableOpacity>
            <View style={styles.quantityRow}>
                <TouchableOpacity style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
                <View style={styles.nameContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.brand}>{item.brand}</Text>
                </View>
                <Text style={styles.price}>${item.price * item.quantity}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>My Cart</Text>

            <FlatList
                data={MOCK_CART}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.footer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Products: {totalProducts}</Text>
                    <Text style={styles.summaryTotal}>Total: ${totalPrice}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutText}>Proceed to Checkout  →</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1a2e",
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ffffff",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#16213e",
        borderRadius: 16,
        marginTop: 16,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: 180,
    },
    deleteButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#1a1a2e",
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
    },
    deleteText: {
        fontSize: 18,
    },
    quantityRow: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        top: 145,
        left: 10,
        backgroundColor: "#1a1a2e",
        borderRadius: 20,
        paddingHorizontal: 4,
        paddingVertical: 2,
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
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 14,
    },
    nameContainer: {
        flex: 1,
    },
    title: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    brand: {
        color: "#888",
        fontSize: 13,
        marginTop: 2,
    },
    price: {
        color: "#e94560",
        fontSize: 18,
        fontWeight: "bold",
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 65,
        borderTopWidth: 1,
        borderTopColor: "#0f3460",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    summaryLabel: {
        color: "#888",
        fontSize: 14,
    },
    summaryTotal: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "bold",
    },
    checkoutButton: {
        backgroundColor: "#e94560",
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: "center",
    },
    checkoutText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
