import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import Logo from "@/assets/images/app-logo.png";
import Logo2 from "@/assets/images/logo-primary-4.png";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";

const TopBar = () => {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.replace("/login");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => router.replace("/(tabs)")}
                className="flex-row gap-2 items-center"
            >
                <Image source={Logo} style={{ width: 50, height: 40 }} />
                <Text className="text-4xl text-primary font-bold">
                    LINKEDOUT
                </Text>
            </TouchableOpacity>
            {/*<Image source={Logo2} style={{ width: 210, height: 40 }} />*/}
            <Ionicons
                onPress={handleLogout}
                name="log-out-outline"
                color="#D62937"
                size={30}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: "#DDD",
    },
});

export default TopBar;
