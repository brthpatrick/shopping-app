import useFetch from "@/hooks/useFetch";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

function capitalize(text: string): string {
    return text
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export default function HomeScreen() {

    const { data } = useFetch("https://dummyjson.com/products/category-list");

    const renderItem = ({ item}: { item: any}) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <Text style={styles.cardText}>{capitalize(item)}</Text>
        </TouchableOpacity>
    );
       
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Categories</Text>
            <FlatList
                data={data}
                renderItem={renderItem}
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
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 50,
        marginTop: 12,  
        borderWidth: 1,
        borderColor: "#0f3460"
    },
    cardText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#e94560",
    },
});