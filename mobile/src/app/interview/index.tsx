import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Text,
    View,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Animated,
    Easing,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Toast from "react-native-toast-message";
import * as Speech from "expo-speech";
import { useAudioRecorder, AudioModule, RecordingPresets } from "expo-audio";

import { getFeedback } from "@/src/service/ai";
import { Ionicons } from "@expo/vector-icons";
import CustomButtonIcon from "@/src/components/CustomButtonIcon";
import api from "@/src/lib/axios";
import { isAxiosError } from "axios";

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
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

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

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [microphoneGranted, setMicrophoneGranted] = useState(false);
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
    const [recordLoading, setRecordLoading] = useState(false);

    const record = async () => {
        Speech.stop();
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
        setIsRecording(true);
    };

    const stopRecording = async () => {
        await audioRecorder.stop();
        setIsRecording(false);
        await getTranscriptionFromAudio();
    };

    const getTranscriptionFromAudio = async () => {
        if (!audioRecorder.uri) {
            Toast.show({
                type: "error",
                text1: "Erreur",
                text2: "Aucun enregistrement disponible",
            });
            return;
        }

        setRecordLoading(true);
        try {
            const uri = audioRecorder.uri;
            const formData = new FormData();

            formData.append("file", {
                uri,
                type: "audio/wav",
                name: "speech.wav",
            } as any);

            const { data } = await api.post("/audio/transcript", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(data);

            const transcript = data.transcript || ""; // assume response { transcript: string }

            // update answer
            const updated = [...answers];
            updated[currentIndex].answer = transcript;
            setAnswers(updated);
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response) {
                    // Server responded with a status code out of 2xx
                    console.error("❌ Response error:", error.response.data);
                    console.error("🔢 Status:", error.response.status);
                } else if (error.request) {
                    // Request was made but no response
                    console.error(
                        "📡 Request made but no response:",
                        error.request,
                    );
                } else {
                    // Something else triggered the error
                    console.error(
                        "⚠️ Axios config/setup error:",
                        error.message,
                    );
                }
            }
            console.error("Transcription error", error);
            Toast.show({
                type: "error",
                text1: "Erreur",
                text2: "Échec de la transcription audio",
            });
        } finally {
            setRecordLoading(false);
        }
    };

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

    const readCurrentQuestion = () => {
        if (isSpeaking) {
            Speech.stop();
            setIsSpeaking(false);
            return;
        }

        setIsSpeaking(true);
        Speech.speak(answers[currentIndex].question, {
            language: "fr-FR",
            pitch: 1.1,
            rate: 0.9,
            voice: "fr-fr-x-frb-local",
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
        });
    };

    useEffect(() => {
        readCurrentQuestion();
        return () => {
            Speech.stop();
        };
    }, [currentIndex]);

    useEffect(() => {
        (async () => {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            setMicrophoneGranted(status.granted);
            if (!status.granted) {
                Toast.show({
                    type: "error",
                    text1: "Erreur",
                    text1Style: { fontSize: 16, fontWeight: "bold" },
                    text2: "Permsssion à acceder au microphone a été dénié",
                    text2Style: { fontSize: 13 },
                });
            }
        })();
    }, []);

    const isLast = currentIndex === answers.length - 1;

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [isProcessing, setIsProcessing] = useState(false);

    // Animation for recording
    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isRecording]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-gray-50"
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 24,
                    paddingTop: 40,
                    paddingBottom: 40,
                }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header Section */}
                <View className="mb-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-1">
                        Simulation d&apos;entretien
                    </Text>
                    <View className="flex-row items-center">
                        <View className="bg-blue-100 px-3 py-1 rounded-full mr-2">
                            <Text className="text-blue-800 text-sm font-medium">
                                {role}
                            </Text>
                        </View>
                        <View className="bg-purple-100 px-3 py-1 rounded-full">
                            <Text className="text-purple-800 text-sm font-medium">
                                {difficulties[difficulty]}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Progress Indicator */}
                <View className="mb-6">
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-sm text-gray-500 font-medium">
                            Question {currentIndex + 1}/{answers.length}
                        </Text>
                        <Text className="text-sm text-gray-500 font-medium">
                            {Math.round(
                                ((currentIndex + 1) / answers.length) * 100,
                            )}
                            %
                        </Text>
                    </View>
                    <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                                width: `${((currentIndex + 1) / answers.length) * 100}%`,
                            }}
                        />
                    </View>
                </View>

                {/* Question Card with Speech Button */}
                <View className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-gray-100">
                    <View className="flex-row justify-between items-start mb-3">
                        <Text className="text-lg font-semibold text-gray-800 flex-1 mr-3">
                            {answers[currentIndex]?.question}
                        </Text>
                        <TouchableOpacity
                            onPress={readCurrentQuestion}
                            className="bg-blue-50 w-10 h-10 rounded-full items-center justify-center"
                        >
                            <Ionicons
                                name={isSpeaking ? "stop" : "volume-high"}
                                size={20}
                                color="#3b82f6"
                            />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons
                            name="help-circle"
                            size={16}
                            color="#6b7280"
                        />
                        <Text className="text-sm text-gray-500 ml-1">
                            Répondez comme si vous étiez en entretien
                        </Text>
                    </View>
                </View>

                {/* Answer Input */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        marginBottom: 12,
                    }}
                >
                    <TextInput
                        value={answers[currentIndex]?.answer}
                        onChangeText={handleChangeAnswer}
                        placeholder="Écrivez votre réponse ici..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        textAlignVertical="top"
                        style={{
                            flex: 1,
                            backgroundColor: "white",
                            borderColor: "#d1d5db",
                            borderWidth: 1,
                            borderRadius: 16,
                            padding: 16,
                            minHeight: 150,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 3,
                            elevation: 2,
                            color: "#1f2937",
                        }}
                    />
                    {/*<TouchableOpacity
                        onPress={isRecording ? stopRecording : record}
                        disabled={recordLoading}
                        className={`w-12 h-12 rounded-full items-center justify-center ${
                            isRecording ? "bg-red-100" : "bg-blue-100"
                        }`}
                        style={{
                            transform: [{ scale: pulseAnim }],
                        }}
                    >
                        {recordLoading ? (
                            <ActivityIndicator size="small" color="#3b82f6" />
                        ) : (
                            <Ionicons
                                name={isRecording ? "stop" : "mic"}
                                size={24}
                                color={isRecording ? "#ef4444" : "#3b82f6"}
                            />
                        )}
                    </TouchableOpacity>*/}
                </View>

                {/* Recording Status Indicator */}
                <View className="mt-2 flex-row items-center">
                    {isRecording && (
                        <>
                            <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                            <Text className="text-sm text-red-600">
                                Enregistrement en cours...
                            </Text>
                        </>
                    )}
                    {recordLoading && (
                        <>
                            <ActivityIndicator
                                size="small"
                                color="#3b82f6"
                                className="mr-2"
                            />
                            <Text className="text-sm text-blue-600">
                                Traitement de l&apos;audio...
                            </Text>
                        </>
                    )}
                </View>

                {/* Character Counter */}
                <Text className="text-xs text-gray-400 mt-1 text-right">
                    {answers[currentIndex]?.answer.length || 0} caractères
                </Text>

                {/*voiceError && (
                    <Text
                        style={{
                            color: "red",
                            marginBottom: 12,
                            textAlign: "center",
                        }}
                    >
                        {voiceError}
                    </Text>
                )*/}

                {/* Navigation Button */}
                <CustomButtonIcon
                    title={
                        isLast ? "Terminer l'entretien" : "Question suivante"
                    }
                    variant="primary"
                    onPress={handleNext}
                    disabled={
                        !answers[currentIndex]?.answer.trim() ||
                        loading ||
                        !microphoneGranted
                    }
                    isLoading={loading}
                    className={clsx(
                        "mt-6 py-4 rounded-xl bg-primary",
                        !answers[currentIndex]?.answer.trim() && "opacity-50",
                    )}
                    textClassName={clsx(
                        "text-lg font-medium",
                        !answers[currentIndex]?.answer.trim()
                            ? "text-gray-500"
                            : "text-white",
                    )}
                    icon={
                        <Ionicons
                            name="arrow-forward"
                            size={20}
                            color="white"
                            style={{ marginLeft: 8 }}
                        />
                    }
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Interview;
