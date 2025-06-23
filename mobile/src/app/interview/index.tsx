import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const Interview = () => {
    const { role, difficulty } = useLocalSearchParams<{
        role: string;
        difficulty: string;
    }>();
    return (
        <View className="flex-1 py-10 justify-center items-center">
            <Text className="text-primary text-5xl font-bold">Interview</Text>
            <Text className="text-primary text-2xl">{role}</Text>
            <Text className="text-primary text-2xl">{difficulty}</Text>
        </View>
    );
};

export default Interview;
