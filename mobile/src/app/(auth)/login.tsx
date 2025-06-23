import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

import { useAuth } from "../../context/AuthContext";
import CustomButton from "@/src/components/CustomButton";
import CustomTextInput from "@/src/components/CustomTextInput";

export default function LoginScreen() {
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        const success = await login(email, password);
        if (success) router.replace("/(tabs)");
    };

    return (
        <View className="flex-1 bg-white p-6 justify-center item-center gap-20">
            <Text className="text-5xl text-gray-600 text-center font-bold mb-8 animate-pulse duration-150">
                Bienvenue
            </Text>

            <View>
                <CustomTextInput
                    inputClassName="bg-secondary rounded-xl p-3 mb-2 text-lg"
                    placeholder="Email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    value={email}
                    autoCapitalize="none"
                />

                <CustomTextInput
                    inputClassName="bg-secondary rounded-xl p-3 mb-2 text-lg"
                    placeholder="Mot de passe"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                />

                <TouchableOpacity className="items-end mb-6">
                    <Text className="text-primary">Mot de passe oublié?</Text>
                </TouchableOpacity>

                <CustomButton
                    title="Se connecter"
                    onPress={handleLogin}
                    textClassName="font-bold text-xl"
                    variant="primary"
                    isLoading={isLoading}
                />

                <View className="flex-row justify-center mt-4">
                    <Text className="text-gray-600">
                        Pas encore de compte?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/register")}>
                        <Text className="text-primary font-medium">
                            S&apos;inscrire
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
