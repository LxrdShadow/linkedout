import { Slot } from "expo-router";
import "./global.css";
import { AuthProvider } from "../context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Appearance, Platform } from "react-native";

export default function RootLayout() {
    if (Platform.OS !== "web") Appearance.setColorScheme("light");

    return (
        <SafeAreaProvider>
            <AuthProvider>
                <Slot />
            </AuthProvider>
        </SafeAreaProvider>
    );
}
