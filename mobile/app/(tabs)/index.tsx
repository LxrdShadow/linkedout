import { Text, View } from "react-native";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text
                style={{
                    fontSize: 50,
                    color: "#4488EE",
                    fontWeight: "bold",
                }}
            >
                Welcome!
            </Text>
        </View>
    );
}
