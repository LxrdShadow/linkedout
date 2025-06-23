import { router, useLocalSearchParams } from "expo-router";
import { Text, View, Animated } from "react-native";
import React, { useRef, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import CustomButtonIcon from "@/src/components/CustomButtonIcon";

interface FeedbackEntry {
    question: string;
    answer: string;
    feedback: {
        feedback: string;
        score: number;
        advice: string;
        level: string;
    };
}

const levelColors: Record<string, string> = {
    faible: "bg-red-100 text-red-800",
    moyen: "bg-yellow-100 text-yellow-800",
    eleve: "bg-green-100 text-green-800",
    fort: "bg-green-100 text-green-800",
};

const scoreColors = [
    "text-red-500", // 1
    "text-orange-500", // 2
    "text-yellow-500", // 3
    "text-lime-500", // 4
    "text-green-500", // 5
];

const mockFeedback = [
    {
        question:
            "Pouvez-vous expliquer la différence entre HTML, CSS et JavaScript ?",
        answer: "HTML est utilisé pour la structure d'une page web, CSS est pour le style et les animations simples, et JavaScript est utilisé pour l’aspect dynamique et interactif.",
        feedback: {
            feedback:
                "La réponse est correcte dans les grandes lignes, mais elle reste un peu simpliste. Il manque des détails comme le rôle sémantique de HTML, les possibilités avancées de CSS (comme les grilles et les flexbox), et le potentiel de JavaScript au-delà de l'interactivité basique, comme la manipulation du DOM ou l'appel aux APIs.",
            score: 3,
            advice: "Développez vos explications pour montrer une compréhension plus approfondie des technologies. Par exemple, mentionnez comment HTML structure le contenu de manière sémantique ou donnez des exemples concrets d'interactivités en JavaScript.",
            level: "moyen",
        },
    },
    {
        question:
            "Comment assurez-vous la compatibilité entre différents navigateurs web ?",
        answer: "En faisant des tests et en utilisant parfois les navigateurs les plus utilisés pour les faire.",
        feedback: {
            feedback:
                "La réponse est correcte dans son principe, mais elle manque de détails et de méthodologie concernant les tests de compatibilité des navigateurs (cross-browser compatibility).",
            score: 2,
            advice: "Mentionnez des outils spécifiques comme BrowserStack ou des techniques comme les préfixes CSS, les polyfills ou les tests unitaires et fonctionnels pour mieux expliciter votre méthode.",
            level: "faible",
        },
    },
    {
        question:
            "Qu'est-ce qu'une API REST et comment l'utiliser dans une application web ?",
        answer: "C'est un serveur qui utilise les requêtes HTTP pour évaluer et fournir les demandes des utilisateurs. On l'utilise en exécutant des appels API comme \"https://myapi.com/api/v1/products\" pour récupérer la liste des produits d'une base de données.",
        feedback: {
            feedback:
                "La réponse décrit correctement les bases d'une API REST et l'idée d'utiliser des appels API avec des requêtes HTTP, mais elle manque de détails sur les concepts RESTful comme les verbes HTTP (GET, POST, etc.), les réponses en format JSON ou XML, et les principes tels que l'état stateless.",
            score: 3,
            advice: "Pour améliorer votre réponse, mentionnez les verbes HTTP standards (GET, POST, PUT, DELETE), expliquez le format des réponses (JSON, XML) et soulignez le caractère stateless d'une API REST.",
            level: "moyen",
        },
    },
    {
        question:
            "Quelle est votre méthode pour optimiser les performances d'un site web ?",
        answer: "Je profile les éléments lourds en chargement avec le debugger et les modifie au mieux pour améliorer la performance.",
        feedback: {
            feedback:
                "La réponse montre une compréhension de base du profilage, mais elle manque de détails concrets sur les techniques utilisées pour optimiser les performances comme la gestion des assets, la mise en cache, ou l'optimisation des requêtes.",
            score: 3,
            advice: "Donnez des exemples spécifiques d'actions d'optimisation comme la compression d'images, l'utilisation d'un CDN, ou la réduction des requêtes HTTP. Mentionnez également des outils que vous utilisez régulièrement, comme Lighthouse ou WebPageTest.",
            level: "moyen",
        },
    },
    {
        question:
            "Avez-vous déjà utilisé un framework comme React ou Vue.js ? Si oui, lequel et pourquoi ?",
        answer: "J'ai déjà utilisé React. Parce que la philosophie de React est facile à utiliser pour les débutants, et la communauté est vaste.",
        feedback: {
            feedback:
                "La réponse est correcte mais trop générale. Elle pourrait être améliorée en détaillant comment vous avez utilisé React dans des projets spécifiques ou en mentionnant des fonctionnalités particulières que vous appréciez.",
            score: 3,
            advice: "Essayez d'ajouter des exemples concrets de vos expériences avec React, comme des projets réalisés ou des défis techniques surmontés en utilisant ce framework.",
            level: "moyen",
        },
    },
];

const FeedbackScreen = () => {
    const { feedbacks } = useLocalSearchParams<{ feedbacks: string }>();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const parsed = mockFeedback;
    // let parsed: FeedbackEntry[] = [];
    // try {
    //     parsed = JSON.parse(feedbacks);
    // } catch (e) {
    //     console.error("Failed to parse feedbacks", e);
    // }

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
                        Résultats de l&apos;entretien
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
                                Score moyen sur
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
                                      ? "Moyen"
                                      : "À améliorer"}
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
                                {entry.question}
                            </Text>
                        </View>

                        <View className="mb-5">
                            <Text className="text-sm font-medium text-gray-500 mb-1">
                                Votre réponse
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
                                    Retour
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
                                    Conseil
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
                title="Retourner"
                onPress={() => router.replace("/(tabs)/interviewOptions")}
            />
        </Animated.ScrollView>
    );
};

export default FeedbackScreen;
