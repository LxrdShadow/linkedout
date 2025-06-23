import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import React, { useState } from "react";
import clsx from "clsx";

const Interview = () => {
    const { role, difficulty, questions } = useLocalSearchParams<{
        role: string;
        difficulty: string;
        questions: string;
    }>();
    const router = useRouter();

    const parsedQuestions = (() => {
        try {
            return JSON.parse(questions) as { text: string }[];
        } catch (e) {
            console.error("Failed to parse questions", e);
            return [];
        }
    })();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>(
        Array(parsedQuestions.length).fill(""),
    );

    const handleChangeAnswer = (text: string) => {
        const updated = [...answers];
        updated[currentIndex] = text;
        setAnswers(updated);
    };

    const handleNext = () => {
        if (!answers[currentIndex].trim()) {
            Alert.alert("Réponse requise", "Veuillez saisir une réponse.");
            return;
        }

        if (currentIndex < parsedQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Submit logic (placeholder)
            console.log("Answers submitted:", answers);
            router.push("/(tabs)/dashboard"); // Or anywhere you like
        }
    };

    const isLast = currentIndex === parsedQuestions.length - 1;

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    padding: 20,
                    justifyContent: "center",
                }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="mb-6 items-center">
                    <Text className="text-primary text-3xl font-bold mb-2">
                        Interview
                    </Text>
                    <Text className="text-primary text-lg">{role}</Text>
                    <Text className="text-primary text-lg mb-2">
                        Difficulté: {difficulty}
                    </Text>
                    <Text className="text-neutral-500 text-sm">
                        Question {currentIndex + 1} sur {parsedQuestions.length}
                    </Text>
                </View>

                <Text className="text-lg font-medium mb-4 text-neutral-800">
                    {parsedQuestions[currentIndex]?.text}
                </Text>

                <TextInput
                    value={answers[currentIndex]}
                    onChangeText={handleChangeAnswer}
                    placeholder="Votre réponse..."
                    multiline
                    className="border border-neutral-300 rounded-xl px-4 py-3 min-h-[100px] text-base text-neutral-800"
                />

                <TouchableOpacity
                    className={clsx(
                        "mt-6 bg-primary py-4 px-6 rounded-full",
                        !answers[currentIndex].trim() && "opacity-50",
                    )}
                    onPress={handleNext}
                    disabled={!answers[currentIndex].trim()}
                >
                    <Text className="text-white text-center font-semibold text-base">
                        {isLast ? "Soumettre" : "Suivant"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Interview;
