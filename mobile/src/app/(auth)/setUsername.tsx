import CustomButton from "@/src/components/CustomButton";
import CustomTextInput from "@/src/components/CustomTextInput";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text } from "react-native";

const SetUsername = () => {
    const [username, setUsername] = useState("");
    const router = useRouter();
    const { putUsername } = useAuth();

    const handleSetUsername = async () => {
        const success = await putUsername(username);
        if (success) router.replace("/dashboard");
    };

    return (
        <View className="flex-1 bg-white p-6 justify-center item-center gap-10 pb-10">
            <Text className="text-5xl text-gray-600 text-center font-bold mb-8">
                Choisissez un nom d&apos;utilisateur
            </Text>

            <View className="p-10">
                <View className="text-center p-10 rounded-2xl">
                    <CustomTextInput
                        inputClassName="bg-primary-0 rounded-xl p-3 text-lg"
                        placeholder="Nom d'utilisateur"
                        autoCapitalize="none"
                        onChangeText={setUsername}
                        value={username}
                    />
                    <CustomButton
                        title="Confirmer"
                        onPress={handleSetUsername}
                        textClassName="font-bold text-xl"
                        variant="primary"
                    />
                </View>
            </View>
        </View>
    );
};

export default SetUsername;
