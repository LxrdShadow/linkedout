import CustomButton from "@/src/components/CustomButton";
import CustomTextInput from "@/src/components/CustomTextInput";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const Register = () => {
    const router = useRouter();

    const handleSignup = () => {
        router.push("/verifyOTP");
    };

    return (
        <View className="flex-1 bg-white p-6 justify-center item-center gap-7">
            <Text className="text-5xl text-gray-600 text-center font-bold mb-8">
                Créer un compte
            </Text>

            <View className="flex justify-center gap-5">
                <View>
                    <CustomTextInput
                        label="Email"
                        inputClassName="bg-primary-0 rounded-xl p-3 mb-1 text-lg"
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <CustomTextInput
                        label="Mot de passe"
                        inputClassName="bg-primary-0 rounded-xl p-3 mb-1 text-lg"
                        placeholder="Mot de passe"
                        secureTextEntry
                    />
                    <CustomTextInput
                        label="Confirmer le mot de passe"
                        inputClassName="bg-primary-0 rounded-xl p-3 mb-1 text-lg"
                        placeholder="Mot de passe de confirmation"
                        secureTextEntry
                    />
                </View>

                <View>
                    <CustomButton
                        title="Continuer"
                        onPress={handleSignup}
                        textClassName="font-bold text-xl"
                        variant="ghost"
                    />

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-gray-600">
                            Vous avez déjà un compte?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-primary font-medium">
                                Se connecter
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Register;
