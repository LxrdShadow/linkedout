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

const cardShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
};

interface Difficulties {
    [key: string]: string;
}

const difficulties: Difficulties = {
    facile: "Facile",
    intermediaire: "Intermédiaire",
    difficile: "Difficile",
};

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
            // Final submission placeholder
            console.log("Answers submitted:", answers);
            router.push("/(tabs)/dashboard");
        }
    };

    const isLast = currentIndex === parsedQuestions.length - 1;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1 bg-white"
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 24,
                    paddingTop: 60,
                    paddingBottom: 40,
                    justifyContent: "flex-start",
                }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View className="mb-8 items-center">
                    <Text className="text-4xl font-extrabold text-primary tracking-tight mb-2">
                        Simulation d&apos;entretien
                    </Text>
                    <Text className="text-base text-neutral-600 italic">
                        Rôle : <Text className="font-medium">{role}</Text> |
                        Difficulté :{" "}
                        <Text className="font-medium">
                            {difficulties[difficulty]}
                        </Text>
                    </Text>
                </View>

                {/* Stepper */}
                <View className="mb-6 w-full">
                    <Text className="text-sm text-neutral-500 font-medium mb-2">
                        Question {currentIndex + 1} of {parsedQuestions.length}
                    </Text>
                    <View className="w-full h-4 bg-primary-70 rounded-full overflow-hidden">
                        <View
                            style={{
                                width: `${
                                    ((currentIndex + 1) /
                                        parsedQuestions.length) *
                                    100
                                }%`,
                            }}
                            className="h-full bg-primary rounded-full"
                        />
                    </View>
                </View>

                {/* Question Card */}
                <View
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-6"
                    style={cardShadow}
                >
                    <Text className="text-lg text-neutral-800 font-semibold leading-relaxed">
                        {parsedQuestions[currentIndex]?.text}
                    </Text>
                </View>

                {/* Answer Input */}
                <TextInput
                    value={answers[currentIndex]}
                    onChangeText={handleChangeAnswer}
                    placeholder="Tapez votre réponse ici..."
                    multiline
                    textAlignVertical="top"
                    className="bg-white border border-neutral-300 rounded-2xl p-4 min-h-[120px] text-base text-neutral-800"
                    style={cardShadow}
                />

                {/* Action Button */}
                <TouchableOpacity
                    onPress={handleNext}
                    disabled={!answers[currentIndex].trim()}
                    className={clsx(
                        "mt-8 py-4 px-6 rounded-full bg-primary",
                        "items-center transition-opacity duration-200",
                        !answers[currentIndex].trim() && "opacity-50",
                    )}
                >
                    <Text className="text-white font-semibold text-lg">
                        {isLast ? "Soumettre mes réponses" : "Suivant"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Interview;
