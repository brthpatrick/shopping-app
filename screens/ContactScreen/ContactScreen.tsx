import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContactScreen() {
    const router = useRouter();
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        city: "",
        address: "",
    });

    const handleConfirm = () => {
        if (!form.fullName || !form.phone || !form.email || !form.city || !form.address) {
            alert("Please fill in all fields");
            return;
        }
        router.navigate({
            pathname: "/(tabs)/basket/contact/checkout",
            params: form,
        } as any);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Details</Text>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#666"
                    value={form.fullName}
                    onChangeText={(text) => setForm({ ...form, fullName: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#666"
                    keyboardType="phone-pad"
                    value={form.phone}
                    onChangeText={(text) => setForm({ ...form, phone: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={form.email}
                    onChangeText={(text) => setForm({ ...form, email: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="City"
                    placeholderTextColor="#666"
                    value={form.city}
                    onChangeText={(text) => setForm({ ...form, city: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    placeholderTextColor="#666"
                    value={form.address}
                    onChangeText={(text) => setForm({ ...form, address: text })}
                />
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                    <Text style={styles.confirmText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1a2e",
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 20,
    },
    form: {
        flex: 1,
        gap: 14,
    },
    input: {
        backgroundColor: "#16213e",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: "#ffffff",
        borderWidth: 1,
        borderColor: "#0f3460",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 30,
    },
    cancelText: {
        color: "#888",
        fontSize: 16,
    },
    confirmButton: {
        backgroundColor: "#e94560",
        borderRadius: 50,
        paddingVertical: 14,
        paddingHorizontal: 32,
    },
    confirmText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
