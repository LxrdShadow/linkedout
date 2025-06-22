import { View, StyleSheet, Image } from "react-native";
import Logo from "@/assets/images/logo-white.png";

const TopBar = () => {
    return (
        <View style={styles.container}>
            <Image source={Logo} style={{ width: 210, height: 40 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: "#1F2C50",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 35,
        borderBottomWidth: 1,
        borderColor: "#DDD",
    },
});

export default TopBar;
