import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RootLayout = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Stack>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen
                    name="register"
                    options={{ headerShown: false }}
                />
            </Stack>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default RootLayout;
