import { View, Text, ScrollView, StyleSheet } from "react-native";
import IonIcons from "@react-native-vector-icons/ionicons";
import LucideIcons from "@react-native-vector-icons/lucide";
import React from "react";

const Index = () => {
    return (
        <View className="bg-white flex-1">
            <ScrollView
                contentContainerStyle={style.container}
                className="p-5 bg-white w-full"
            >
                <View className="w-full flex items-center mb-20">
                    <View className="flex-col justify-center items-center px-4">
                        <IonIcons
                            name="play-outline"
                            size={40}
                            color="#1F2C47"
                        />
                        <Text className="text-5xl text-primary font-bold text-center">
                            Bienvenue sur LinkedOut
                        </Text>
                        <Text className="mt-5 text-neutral-400 text-xl text-center">
                            Améliorez vos compétences en entretien grâce à des
                            exercices basés sur l&apos;IA et des commentaires
                            personnalisés.
                        </Text>
                    </View>
                </View>

                <View className="flex-col gap-5">
                    <Card
                        icon={
                            <LucideIcons
                                name="message-square-dot"
                                size={35}
                                color="#1F2C47"
                            />
                        }
                        title="Simulations réalistes"
                        description="Entraînez-vous avec des questions courantes pour différents postes dans un environnement d'entretien simulé."
                    />
                    <Card
                        icon={
                            <LucideIcons
                                name="brain-circuit"
                                size={35}
                                color="#1F2C47"
                            />
                        }
                        title="Commentaires assistés par l'IA"
                        description="Recevez une analyse détaillée de vos performances, couvrant la clarité et l'exhaustivité."
                    />
                    <Card
                        icon={
                            <LucideIcons
                                name="trending-up"
                                size={35}
                                color="#1F2C47"
                            />
                        }
                        title="Suivez vos progrès"
                        description="Suivez vos progrès au fil du temps grâce à un tableau de bord de performance personnalisé."
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingBottom: 100,
        paddingTop: 20, // Optional: to avoid being too close to top
    },
});

interface CardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const Card = ({ icon, title, description }: CardProps) => {
    return (
        <View className="text-center transition-shadow duration-300 border-neutral-200 border p-5 rounded-xl">
            <View className="items-center mb-4">
                {icon}
                <Text className="text-2xl text-primary font-bold">{title}</Text>
            </View>
            <View className="items-center">
                <Text className="text-lg text-center text-primary-80">
                    {description}
                </Text>
            </View>
        </View>
    );
};

export default Index;
