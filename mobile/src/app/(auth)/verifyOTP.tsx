import CustomButton from "@/src/components/CustomButton";
import CustomTextInput from "@/src/components/CustomTextInput";
import { useAuth } from "@/src/context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text } from "react-native";

const VerifyOTP = () => {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const { email } = useLocalSearchParams<{ email: string }>();
    const { verifyOTP, isLoading } = useAuth();

    const handleVerifyOTP = async () => {
        const success = await verifyOTP(email, otp);
        if (success) {
            router.replace("/setUsername");
        }
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
                            {email}
                        </Text>
                    </View>
                    <CustomTextInput
                        inputClassName="bg-primary-0 rounded-xl p-3 text-lg"
                        placeholder="OTP"
                        keyboardType="numeric"
                        autoCapitalize="none"
                        onChangeText={setOtp}
                        value={otp}
                    />
                    <CustomButton
                        title="Confirmer"
                        onPress={handleVerifyOTP}
                        textClassName="font-bold text-xl"
                        variant="primary"
                        isLoading={isLoading}
                    />
                </View>
            </View>
        </View>
    );
};

export default VerifyOTP;
