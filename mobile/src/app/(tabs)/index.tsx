import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import LucideIcons from "@react-native-vector-icons/lucide";
import { useRouter } from "expo-router";
import React from "react";

const Index = () => {
    const router = useRouter();

    return (
        <View className="bg-white flex-1">
            <ScrollView
                contentContainerStyle={style.container}
                className="px-6 py-10 bg-white w-full"
            >
                {/* Header Section */}
                <View className="items-center mb-10">
                    {/* Optional: App logo */}
                    <Image
                        source={require("@/assets/images/app-logo.png")}
                        style={{ width: 70, height: 70, marginBottom: 10 }}
                    />
                    <Text className="text-4xl font-extrabold text-[#1F2C50] text-center">
                        Bienvenue sur LinkedOut
                    </Text>
                    <Text className="mt-4 text-center text-neutral-500 text-lg px-2">
                        Boostez vos compétences en entretien avec des
                        simulations réalistes et des retours intelligents.
                    </Text>
                </View>

                <View className="flex-col gap-6">
                    <FeatureCard
                        icon={
                            <LucideIcons
                                name="message-square-dot"
                                size={30}
                                color="#1F2C50"
                            />
                        }
                        title="Simulations réalistes"
                        description="Vivez des entretiens comme en conditions réelles, adaptés à votre domaine."
                    />
                    <FeatureCard
                        icon={
                            <LucideIcons
                                name="brain-circuit"
                                size={30}
                                color="#1F2C50"
                            />
                        }
                        title="Analyse assistée par IA"
                        description="Recevez une évaluation automatique de vos réponses pour vous améliorer."
                    />
                    <FeatureCard
                        icon={
                            <LucideIcons
                                name="trending-up"
                                size={30}
                                color="#1F2C50"
                            />
                        }
                        title="Suivi de progression"
                        description="Visualisez votre évolution grâce à des graphiques clairs et motivants."
                    />
                </View>

                <TouchableOpacity
                    onPress={() => router.push("/interview")}
                    className="my-10 bg-[#1F2C50] py-4 px-8 rounded-full items-center justify-center flex-row gap-2"
                >
                    <Text className="text-white font-semibold text-lg">
                        Commencer une simulation
                    </Text>
                    <LucideIcons name="arrow-right" color="#FFF" size={20} />
                </TouchableOpacity>

                <View className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm">
                    <View className="items-center mb-3 gap-3">
                        <Text className="text-2xl font-bold text-primary">
                            Comment ça marche?
                        </Text>
                    </View>
                    <View className="flex-col justify-center mb-3 gap-3">
                        <Text className="text-lg font-semibold text-primary">
                            1. Selectionner un rôle:{" "}
                            <Text className="text-primary font-normal">
                                Choisissez parmi une bibliothèque de rôles
                                professionnels pour personnaliser votre
                                pratique.
                            </Text>
                        </Text>
                        <Text className="text-lg font-semibold text-primary">
                            2. Soumettez vos réponses:{" "}
                            <Text className="text-primary font-normal">
                                Répondez aux questions d&apos;entretien
                                courantes tout en enregistrant.
                            </Text>
                        </Text>
                        <Text className="text-lg font-semibold text-primary">
                            3. Obtenez les commentaires de l&apos;IA:{" "}
                            <Text className="text-primary font-normal">
                                Notre IA analyse vos réponses et fournit des
                                informations constructives.
                            </Text>
                        </Text>
                        <Text className="text-lg font-semibold text-primary">
                            4. Révisez et améliorez:{" "}
                            <Text className="text-primary font-normal">
                                Utilisez les commentaires et suivez vos progrès
                                pour réussir votre prochain véritable entretient
                                !
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

interface CardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard = ({ icon, title, description }: CardProps) => (
    <View className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm">
        <View className="flex-row items-center mb-3 gap-3">
            {icon}
            <Text className="text-xl font-semibold text-primary">{title}</Text>
        </View>
        <Text className="text-neutral-600 text-base">{description}</Text>
    </View>
);

const style = StyleSheet.create({
    container: {
        paddingBottom: 120,
    },
});

export default Index;
