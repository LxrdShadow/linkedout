import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import CustomButton from "@/src/components/CustomButton";
import CustomTextInput from "@/src/components/CustomTextInput";
import { useAuth } from "@/src/context/AuthContext";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { register, isLoading } = useAuth();
    const router = useRouter();

    const handleSignup = async () => {
        const success = await register(email, password, confirmPassword);
        if (success) router.push({ pathname: "/verifyOTP", params: { email } });
    };

    return (
        <View className="flex-1 bg-white p-6 justify-center item-center gap-7">
            <Text className="text-5xl text-gray-600 text-center font-bold mb-8">
                Create an account
            </Text>

            <View className="flex justify-center gap-5">
                <View>
                    <CustomTextInput
                        label="Email"
                        inputClassName="bg-primary-0 rounded-xl p-3 mb-1 text-lg"
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={setEmail}
                        value={email}
                    />
                    <CustomTextInput
                        label="Password"
                        inputClassName="bg-primary-0 rounded-xl p-3 mb-1 text-lg"
                        placeholder="Password"
                        secureTextEntry
                        onChangeText={setPassword}
                        value={password}
                    />
                    <CustomTextInput
                        label="Confirm the password"
                        inputClassName="bg-primary-0 rounded-xl p-3 mb-1 text-lg"
                        placeholder="Confirm password"
                        secureTextEntry
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                    />
                </View>

                <View>
                    <CustomButton
                        title="Continue"
                        onPress={handleSignup}
                        textClassName="font-bold text-xl"
                        variant="primary"
                        isLoading={isLoading}
                    />

                    <View className="flex-row justify-center mt-4">
                        <Text className="text-gray-600">
                            Already have an account?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-primary font-bold">
                                Log in
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Register;
