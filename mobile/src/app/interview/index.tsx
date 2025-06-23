import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Text,
    View,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import React, { useState } from "react";
import clsx from "clsx";
import Toast from "react-native-toast-message";
import { getFeedback } from "@/src/service/ai";
import CustomButton from "@/src/components/CustomButton";

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
            Toast.show({
                type: "error",
                text1: "Erreur",
                text1Style: { fontSize: 16, fontWeight: "bold" },
                text2: "Erreur lors de la création de l'interview",
                text2Style: { fontSize: 13 },
            });
            router.replace("/interviewOptions");
            return [];
        }
    })();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<
        { question: string; answer: string; feedback: string | null }[]
    >(
        parsedQuestions.map((q) => ({
            question: q.text,
            answer: "",
            feedback: null,
        })),
    );
    const [loading, setLoading] = useState(false);

    const handleChangeAnswer = (text: string) => {
        const updated = [...answers];
        if (updated[currentIndex]) {
            updated[currentIndex].answer = text;
            setAnswers(updated);
        }
    };

    const handleNext = async () => {
        const current = answers[currentIndex];

        if (!current || !current.answer.trim()) {
            Toast.show({
                type: "error",
                text1: "Erreur",
                text1Style: { fontSize: 16, fontWeight: "bold" },
                text2: "Veuillez saisir une réponse.",
                text2Style: { fontSize: 13 },
            });
            return;
        }

        try {
            const feedback = await getFeedback(
                role,
                current.question,
                current.answer,
                setLoading,
            );
            const updated = [...answers];
            updated[currentIndex] = { ...current, feedback };
            setAnswers(updated);

            if (currentIndex < answers.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                const encoded = encodeURIComponent(JSON.stringify(updated));
                router.replace({
                    pathname: "/interview/feedback",
                    params: { feedbacks: encoded },
                });
            }
        } catch (e) {
            console.error("Feedback error:", e);
            Toast.show({
                type: "error",
                text1: "Erreur",
                text1Style: { fontSize: 16, fontWeight: "bold" },
                text2: "Impossible de générer le retour",
                text2Style: { fontSize: 13 },
            });
        } finally {
            setLoading(false);
        }
    };

    const isLast = currentIndex === answers.length - 1;

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

                <View className="mb-6 w-full">
                    <Text className="text-sm text-neutral-500 font-medium mb-2">
                        Question {currentIndex + 1} of {answers.length}
                    </Text>
                    <View className="w-full h-4 bg-primary-70 rounded-full overflow-hidden">
                        <View
                            style={{
                                width: `${((currentIndex + 1) / answers.length) * 100}%`,
                            }}
                            className="h-full bg-primary rounded-full"
                        />
                    </View>
                </View>

                <View
                    className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-6"
                    style={cardShadow}
                >
                    <Text className="text-lg text-neutral-800 font-semibold leading-relaxed">
                        {answers[currentIndex]?.question}
                    </Text>
                </View>

                <TextInput
                    value={answers[currentIndex]?.answer}
                    onChangeText={handleChangeAnswer}
                    placeholder="Tapez votre réponse ici..."
                    multiline
                    textAlignVertical="top"
                    className="bg-white border border-neutral-300 rounded-2xl p-4 min-h-[120px] text-base text-neutral-800"
                    style={cardShadow}
                />

                <CustomButton
                    title={isLast ? "Soumettre mes réponses" : "Suivant"}
                    onPress={handleNext}
                    disabled={!answers[currentIndex]?.answer.trim() || loading}
                    isLoading={loading}
                    className={clsx(
                        "mt-8 py-4 px-6 rounded-full bg-primary",
                        "items-center transition-opacity duration-200",
                        !answers[currentIndex]?.answer.trim() && "opacity-50",
                    )}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Interview;
