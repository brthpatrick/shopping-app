import { useCart } from "@/context/CartContext";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CheckoutScreen() {
    const router = useRouter();
    const { fullName, phone, email, city, address } = useLocalSearchParams<{
        fullName: string;
        phone: string;
        email: string;
        city: string;
        address: string;
    }>();
    const { cartItems, removeFromCart } = useCart();
    const [orderSent, setOrderSent] = useState(false);
    const [orderNumber] = useState(() => `#TM-${Math.floor(10000 + Math.random() * 90000)}`);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const renderItem = ({ item }: { item: (typeof cartItems)[number] }) => (
        <View style={styles.productCard}>
            <Image source={{ uri: item.thumbnail }} style={styles.productImage} contentFit="contain" />
            <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{item.title}</Text>
                <Text style={styles.productBrand}>{item.brand}</Text>
                <Text style={styles.productPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={20} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.header}>Delivery Address</Text>
            </View>
            <View style={styles.addressCard}>
                <Text style={styles.addressLine}>Full Name: <Text style={styles.addressValue}>{fullName}</Text></Text>
                <Text style={styles.addressLine}>Phone Number: <Text style={styles.addressValue}>{phone}</Text></Text>
                <Text style={styles.addressLine}>Email: <Text style={styles.addressValue}>{email}</Text></Text>
                <Text style={styles.addressLine}>City: <Text style={styles.addressValue}>{city}</Text></Text>
                <Text style={styles.addressLine}>Address: <Text style={styles.addressValue}>{address}</Text></Text>
            </View>

            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.footer}>
                <View>
                    <Text style={styles.totalLabel}>Total Price</Text>
                    <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.orderButton} onPress={() => setOrderSent(true)}>
                    <Text style={styles.orderButtonText}>Place Order</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={orderSent} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Feather name="check-circle" size={64} color="#4CAF50" />
                        <Text style={styles.modalTitle}>Order Confirmed!</Text>
                        <Text style={styles.modalOrderNum}>{orderNumber}</Text>
                        <Text style={styles.modalText}>Your order has been placed successfully.</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setOrderSent(false);
                                cartItems.forEach((item) => removeFromCart(item.id));
                                router.push("/(tabs)/home" as any);
                            }}
                        >
                            <Text style={styles.modalButtonText}>Back to Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#1a1a2e" },
    headerRow: {
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8,
    },
    backButton: {
        backgroundColor: "#16213e", width: 40, height: 40,
        borderRadius: 20, justifyContent: "center", alignItems: "center",
    },
    header: { fontSize: 24, fontWeight: "bold", color: "#ffffff", marginLeft: 12 },
    addressCard: {
        backgroundColor: "#16213e", marginHorizontal: 20,
        borderRadius: 12, padding: 16, gap: 8,
        borderWidth: 1, borderColor: "#0f3460",
    },
    addressLine: { color: "#888", fontSize: 14 },
    addressValue: { color: "#ffffff", fontWeight: "bold" },
    list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 },
    productCard: {
        flexDirection: "row", backgroundColor: "#16213e",
        borderRadius: 12, marginTop: 10, overflow: "hidden",
        borderWidth: 1, borderColor: "#0f3460",
    },
    productImage: { width: 80, height: 80, backgroundColor: "#1a1a2e" },
    productInfo: { flex: 1, padding: 12 },
    productTitle: { color: "#ffffff", fontSize: 14, fontWeight: "bold" },
    productBrand: { color: "#888", fontSize: 12, marginTop: 2 },
    productPrice: { color: "#e94560", fontSize: 16, fontWeight: "bold", marginTop: 4 },
    footer: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingHorizontal: 20, paddingBottom: 50, paddingTop: 12,
        borderTopWidth: 1, borderTopColor: "#0f3460",
    },
    totalLabel: { color: "#888", fontSize: 12 },
    totalPrice: { color: "#e94560", fontSize: 24, fontWeight: "bold" },
    orderButton: {
        backgroundColor: "#e94560", borderRadius: 50,
        paddingVertical: 14, paddingHorizontal: 28,
    },
    orderButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
    modalOverlay: {
        flex: 1, backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center", alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#16213e", borderRadius: 20,
        padding: 32, alignItems: "center",
        marginHorizontal: 32, gap: 12,
        borderWidth: 1, borderColor: "#0f3460",
    },
    modalTitle: { color: "#ffffff", fontSize: 22, fontWeight: "bold" },
    modalOrderNum: { color: "#e94560", fontSize: 16, fontWeight: "bold" },
    modalText: { color: "#888", fontSize: 14, textAlign: "center" },
    modalButton: {
        backgroundColor: "#e94560", borderRadius: 50,
        paddingVertical: 12, paddingHorizontal: 32, marginTop: 8,
    },
    modalButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});
