import useFetch from "@/hooks/useFetch";
import { Image } from "expo-image";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons"
type Product = {
    id: number;
    title: string;
    description: string;
    brand: string;
    price: number;
    thumbnail: string;
};


export default function ProductsScreen () {
    const { products } = useLocalSearchParams<{ products: string }>();

    const router = useRouter();

    const { data } = useFetch(
        `https://dummyjson.com/products/category/${products}`
    );

    const productList: Product[] = data?.products ?? [];

    const categoryTitle = products
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const renderItem = ({ item }: { item: Product }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.7} 
            onPress={() => router.push(`/home/${products}/${item.id}` as any)}>
            <Image source={{ uri: item.thumbnail }} style={styles.image} contentFit="contain" />
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.brand}>{item.brand}</Text>
            <Text style={styles.price}>${item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{headerShown: false}}/>
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
            />
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
        marginLeft: 12,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    row: {
        justifyContent: "space-between",
    },
    card: {
        backgroundColor: "#16213e",
        borderRadius: 16,
        marginTop: 16,
        width: "48%",
        overflow: "hidden",
        paddingBottom: 12,
    },
    image: {
        width: "100%",
        height: 140,
        backgroundColor: "#1a1a2e",
    },
    title: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 8,
        paddingHorizontal: 10,
    },
    brand: {
        color: "#888",
        fontSize: 12,
        paddingHorizontal: 10,
        marginTop: 2,
    },
    price: {
        color: "#e94560",
        fontSize: 16,
        fontWeight: "bold",
        paddingHorizontal: 10,
        marginTop: 4,
    },
    backButton: {
        backgroundColor: "#16213e",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});