import { Stack } from 'expo-router';

export default function BasketLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#1a1a2e' },
            }}
        />
    );
}