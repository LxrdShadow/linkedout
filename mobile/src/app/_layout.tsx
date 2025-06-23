import { Slot, useSegments } from "expo-router";
import "./global.css";
import { AuthProvider } from "../context/AuthContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Appearance, Platform, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import TopBar from "../components/TopBar";

export default function RootLayout() {
    if (Platform.OS !== "web") Appearance.setColorScheme("light");
    const segments = useSegments(); // ['(tabs)', 'dashboard'] for example

    const isTabs = segments[0] !== "(auth)";

    return (
        <SafeAreaProvider>
            <AuthProvider>
                <SafeAreaView style={styles.container}>
                    {isTabs && <TopBar />}
                    <Slot />
                    <Toast />
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
