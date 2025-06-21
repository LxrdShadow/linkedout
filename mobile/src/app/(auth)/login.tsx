import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import CustomButton from "@/src/components/CustomButton";
import CustomTextInput from "@/src/components/CustomTextInput";

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = () => {
        login(email);
        router.replace("/(tabs)/dashboard");
    };

    return (
        <View className="flex-1 bg-white p-6 justify-center item-center gap-20">
            {/* Header */}
            <Text className="text-5xl text-gray-600 text-center mb-8">
                Bienvenue
            </Text>

            <View>
                <CustomTextInput
                    inputClassName="bg-primary-0 rounded-xl p-3 mb-2 text-lg"
                    placeholder="Email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />

                <CustomTextInput
                    inputClassName="bg-primary-0 rounded-xl p-3 mb-2 text-lg"
                    placeholder="Mot de passe"
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />

                <TouchableOpacity className="items-end mb-6">
                    <Text className="text-primary">Mot de passe oublié?</Text>
                </TouchableOpacity>

                <CustomButton
                    title="Se connecter"
                    onPress={handleLogin}
                    textClassName="font-bold text-xl"
                    variant="ghost"
                />
                {/*<TouchableOpacity className="bg-primary-10 py-3 rounded-xl mb-4">
                <Text className="text-neutral-600 text-center text-xl font-bold">
                    Log in
                </Text>
            </TouchableOpacity>*/}

                {/* Sign Up Link */}
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
