import { Slot } from "expo-router";
import "./global.css";
import { AuthProvider } from "../context/AuthContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Appearance, Platform, StyleSheet } from "react-native";

export default function RootLayout() {
    if (Platform.OS !== "web") Appearance.setColorScheme("light");

    return (
        <SafeAreaProvider>
            <AuthProvider>
                <SafeAreaView style={styles.container}>
                    <Slot />
                </SafeAreaView>
            </AuthProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
