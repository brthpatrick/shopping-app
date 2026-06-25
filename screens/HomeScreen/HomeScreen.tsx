import useFetch from "@/hooks/useFetch";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {

    const { data } = useFetch("https://dummyjson.com/products/category-list");

    const renderItem = ({ item}: { item: any}) => {
        return (
            <TouchableOpacity style={{ margin: 30 }}>
                <View
                    style={{
                        backgroundColor: "black",
                        padding: 20,
                        borderRadius: 10,
                    }}>
                    <Text
                    style={{ fontSize: 25, 
                             color: "white",
                             fontWeight: "900" }}
                    >
                        {item}
                    </Text>
                </View>
                </TouchableOpacity>
        );
    }

    return (
    <View> 
        <FlatList data={data} renderItem={renderItem} />
    </View>
    );
}