import CustomButton from "@/src/components/CustomButton";
import CustomTextInput from "@/src/components/CustomTextInput";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";

const VerifyOTP = () => {
    const router = useRouter();

    const handleVerifyOTP = () => {
        router.dismissAll();
        router.replace("/setUsername");
    };

    return (
        <View className="flex-1 bg-white p-6 justify-center item-center gap-10">
            <Text className="text-5xl text-gray-600 text-center font-bold mb-8">
                Verifier l&apos;email
            </Text>

            <View className="p-10">
                <View className="bg-primary-0 text-center p-10 rounded-2xl">
                    <View className="flex justify-center mb-4">
                        <Text>
                            Entrez le code envoyé à l&apos;adresse email{" "}
                        </Text>
                        <Text className="text-primary underline text-center">
                            test@example.com
                        </Text>
                    </View>
                    <CustomTextInput
                        inputClassName="bg-primary-0 rounded-xl p-3 text-lg"
                        placeholder="OTP"
                        keyboardType="numeric"
                        autoCapitalize="none"
                    />
                    <CustomButton
                        title="Confirmer"
                        onPress={handleVerifyOTP}
                        textClassName="font-bold text-xl"
                        variant="primary"
                    />
                </View>
            </View>
        </View>
    );
};

export default VerifyOTP;
