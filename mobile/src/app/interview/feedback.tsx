import { router, useLocalSearchParams } from "expo-router";
import { Text, View, Animated } from "react-native";
import React, { useRef, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import CustomButtonIcon from "@/src/components/CustomButtonIcon";

interface FeedbackEntry {
    question: { id: string; text: string; index: number };
    answer: string;
    feedback: {
        feedback: string;
        score: number;
        advice: string;
        level: string;
    };
}

const levelColors: Record<string, string> = {
    weak: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-green-100 text-green-800",
    strong: "bg-green-100 text-green-800",
};

const scoreColors = [
    "text-red-500", // 1
    "text-orange-500", // 2
    "text-yellow-500", // 3
    "text-lime-500", // 4
    "text-green-500", // 5
];

const FeedbackScreen = () => {
    const { feedbacks } = useLocalSearchParams<{ feedbacks: string }>();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    let parsed: FeedbackEntry[] = [];
    try {
        parsed = JSON.parse(feedbacks) as FeedbackEntry[];
    } catch (e) {
        console.error("Failed to parse feedbacks", e);
    }

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const calculateAverageScore = () => {
        const validEntries = parsed.filter(
            (entry) =>
                entry.feedback && typeof entry.feedback.score === "number",
        );
        if (validEntries.length === 0) return 0;
        const total = validEntries.reduce(
            (sum, entry) => sum + entry.feedback.score,
            0,
        );
        return Number((total / validEntries.length).toFixed(1));
    };

    return (
        <Animated.ScrollView
            style={{ opacity: fadeAnim }}
            contentContainerStyle={{ paddingBottom: 40 }}
            className="flex-1 bg-gray-50 px-5 py-6"
        >
            {/* Header */}
            <View className="mb-10 px-4">
                <View className="flex-row justify-center items-center mb-3">
                    <View className="h-px bg-gray-200 flex-1" />
                    <Text className="text-3xl font-extrabold text-gray-900 text-center mx-4">
                        Interview Results
                    </Text>
                    <View className="h-px bg-gray-200 flex-1" />
                </View>

                {parsed.length > 0 && (
                    <View className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 items-center">
                        <View className="relative mb-3">
                            <View className="w-20 h-20 rounded-full border-8 border-gray-100" />
                            <View
                                className="absolute top-0 left-0 w-20 h-20 rounded-full border-8 border-transparent"
                                style={{
                                    borderTopColor: "#3b82f6",
                                    borderRightColor: "#3b82f6",
                                    transform: [
                                        {
                                            rotate: `${(calculateAverageScore() / 5) * 180}deg`,
                                        },
                                    ],
                                }}
                            />
                            <View className="absolute inset-0 justify-center items-center">
                                <Text className="text-2xl font-bold text-gray-900 text-center">
                                    {calculateAverageScore()}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            <Text className="text-lg text-gray-600 mr-2">
                                Average score out of
                            </Text>
                            <View className="bg-blue-100 px-2 py-1 rounded-full">
                                <Text className="text-blue-800 font-bold">
                                    5
                                </Text>
                            </View>
                        </View>

                        <View className="mt-3 flex-row items-center">
                            <View
                                className={`w-3 h-3 rounded-full ${
                                    calculateAverageScore() >= 4
                                        ? "bg-green-500"
                                        : calculateAverageScore() >= 2.5
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                } mr-2`}
                            />
                            <Text className="text-sm font-medium text-gray-600">
                                {calculateAverageScore() >= 4
                                    ? "Excellent"
                                    : calculateAverageScore() >= 2.5
                                      ? "Average"
                                      : "To improve"}
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            <View className="space-y-5 pb-6">
                {parsed.map((entry, index) => (
                    <Animated.View
                        key={index}
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 my-5"
                        style={{
                            opacity: fadeAnim,
                            transform: [
                                {
                                    translateY: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [10, 0],
                                    }),
                                },
                            ],
                        }}
                    >
                        <View className="flex-row items-center mb-4">
                            <View className="bg-blue-100 w-8 h-8 rounded-full items-center justify-center mr-3">
                                <Text className="text-blue-800 font-bold">
                                    {index + 1}
                                </Text>
                            </View>
                            <Text className="text-lg font-bold text-gray-800 flex-1">
                                {entry.question.text}
                            </Text>
                        </View>

                        <View className="mb-5">
                            <Text className="text-sm font-medium text-gray-500 mb-1">
                                Your answer
                            </Text>
                            <View className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                <Text className="text-base text-gray-800">
                                    {entry.answer}
                                </Text>
                            </View>
                        </View>

                        <View className="mb-5">
                            <View className="flex-row items-center mb-2">
                                <AntDesign
                                    name="message1"
                                    size={16}
                                    color="#6b7280"
                                />
                                <Text className="text-sm font-medium text-gray-500 ml-2">
                                    Feedback
                                </Text>
                            </View>
                            <Text className="text-base text-gray-700 pl-6">
                                {entry.feedback.feedback}
                            </Text>
                        </View>

                        <View className="mb-5">
                            <View className="flex-row items-center mb-2">
                                <AntDesign
                                    name="bulb1"
                                    size={16}
                                    color="#6b7280"
                                />
                                <Text className="text-sm font-medium text-gray-500 ml-2">
                                    Advice
                                </Text>
                            </View>
                            <Text className="text-base text-gray-700 pl-6">
                                {entry.feedback.advice}
                            </Text>
                        </View>

                        <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                            <View className="flex-row items-center">
                                <Text className="text-sm text-gray-500 mr-2">
                                    Score:
                                </Text>
                                <Text
                                    className={`text-lg font-bold ${scoreColors[entry.feedback.score - 1]}`}
                                >
                                    {entry.feedback.score}/5
                                </Text>
                            </View>
                            <View
                                className={`px-3 py-1 rounded-full ${levelColors[entry.feedback.level?.toLowerCase()] || "bg-gray-100 text-gray-800"}`}
                            >
                                <Text className="text-sm font-semibold">
                                    {entry.feedback.level}
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                ))}
            </View>

            <CustomButtonIcon
                variant="primary"
                className="rounded-xl py-4"
                title="Return"
                onPress={() => router.replace("/(tabs)/interviewOptions")}
            />
        </Animated.ScrollView>
    );
};

export default FeedbackScreen;
