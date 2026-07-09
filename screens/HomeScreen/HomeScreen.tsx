import AnimatedButton from "@/components/AnimatedButtons";
import SkeletonCard from "@/components/SkeletonCard";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function capitalize(text: string): string {
    return text
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export default function HomeScreen() {
    const { data, isLoading, refetch } = useFetch("https://dummyjson.com/products/category-list");
    const router = useRouter();
    const [search, setSearch] = useState("");

    const filteredData = data?.filter((item: string) =>
        item.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    const renderItem = ({ item }: { item: any }) => (
        <AnimatedButton
            style={styles.card}
            onPress={() => router.navigate(`/home/${item}` as any)}
        >
            <Text style={styles.cardText}>{capitalize(item)}</Text>
            <View style={styles.circle} />
        </AnimatedButton>
    );

    if (!data) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.header}>Categories</Text>
                <View style={styles.list}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <SkeletonCard key={i} />
                    ))}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Categories</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search categories..."
                placeholderTextColor="#666"
                value={search}
                onChangeText={setSearch}
            />
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }
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
        marginTop: 25,
        borderWidth: 1,
        borderColor: "#0f3460",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    cardText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#e94560",
    },
    circle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#0f3460",
        borderWidth: 2,
        borderColor: "#e94560",
    },
    searchInput: {
        backgroundColor: "#16213e",
        borderRadius: 50,
        paddingVertical: 18,
        paddingHorizontal: 20,
        fontSize: 16,
        color: "#ffffff",
        marginHorizontal: 20,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#0f3460",
    },
});
