import {
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import clsx from "clsx";
import LucideIcons from "@react-native-vector-icons/lucide";

import CustomButtonIcon from "@/src/components/CustomButtonIcon";
import { getQuestions } from "@/src/service/ai";

interface Difficulties {
    [key: string]: string;
}

const difficulties: Difficulties = {
    Easy: "easy",
    Medium: "medium",
    Hard: "hard",
};

const DifficultySelection = () => {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { role } = useLocalSearchParams<{ role: string }>();

    const handleContinue = async () => {
        if (!selected) return;
        const questions = await getQuestions(role, selected, setIsLoading);
        const encodedQuestions = encodeURIComponent(JSON.stringify(questions));

        router.push({
            pathname: "/interview",
            params: { role, difficulty: selected, questions: encodedQuestions },
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1, backgroundColor: "white", paddingBottom: 40 }}
        >
            <View className="px-6 pt-10 flex-1">
                <View className="items-center mb-8">
                    <Text className="text-3xl font-bold text-primary text-center">
                        Choose the difficulty
                    </Text>
                    <Text className="mt-3 text-center text-neutral-500">
                        Select your challenge level for the simulation.
                    </Text>
                </View>

                <View>
                    {Object.keys(difficulties).map((level) => (
                        <TouchableOpacity
                            key={level}
                            className={clsx(
                                "mx-0 border rounded-xl px-4 py-4 mb-4",
                                selected === difficulties[level]
                                    ? "border-primary bg-primary/10"
                                    : "border-neutral-200",
                            )}
                            onPress={() => setSelected(difficulties[level])}
                        >
                            <Text
                                className={clsx(
                                    "text-lg text-center",
                                    selected === difficulties[level]
                                        ? "text-primary font-semibold"
                                        : "text-neutral-700",
                                )}
                            >
                                {level}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="mt-auto pb-10">
                    <CustomButtonIcon
                        title="Continue"
                        variant="primary"
                        className={clsx(
                            "py-4 px-6 rounded-full flex-row justify-center items-center gap-2",
                            !selected && "opacity-50",
                        )}
                        onPress={handleContinue}
                        disabled={!selected}
                        isLoading={isLoading}
                        icon={
                            <LucideIcons
                                name="arrow-right"
                                size={20}
                                color="#FFF"
                            />
                        }
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default DifficultySelection;
