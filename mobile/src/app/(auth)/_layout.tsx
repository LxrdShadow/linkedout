import { Stack } from "expo-router";

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="verifyOTP" options={{ headerShown: false }} />
            <Stack.Screen name="setUsername" options={{ headerShown: false }} />
        </Stack>
    );
};

export default RootLayout;
