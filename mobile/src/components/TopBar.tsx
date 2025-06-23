import { View, StyleSheet, Image } from "react-native";
import Logo from "@/assets/images/logo-primary-4.png";

const TopBar = () => {
    return (
        <View style={styles.container}>
            <Image source={Logo} style={{ width: 210, height: 40 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: "#DDD",
    },
});

export default TopBar;
