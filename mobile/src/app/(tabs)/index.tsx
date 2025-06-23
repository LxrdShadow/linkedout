import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import LucideIcons from "@react-native-vector-icons/lucide";
import { useRouter } from "expo-router";
import React from "react";
import CustomButtonIcon from "@/src/components/CustomButtonIcon";
import * as Animatable from "react-native-animatable";

const Index = () => {
    const router = useRouter();

    return (
        <View className="bg-white flex-1">
            <ScrollView
                contentContainerStyle={style.container}
                className="px-6 py-10 bg-white w-full"
            >
                {/* Header Section */}
                <Animatable.View
                    animation="fadeInDown"
                    delay={100}
                    duration={800}
                    className="items-center mb-10"
                >
                    <Image
                        source={require("@/assets/images/app-logo.png")}
                        style={{ width: 70, height: 70, marginBottom: 10 }}
                    />
                    <Text className="text-4xl font-extrabold text-primary text-center">
                        Bienvenue sur LinkedOut
                    </Text>
                    <Text className="mt-4 text-center text-neutral-500 text-lg px-2">
                        Boostez vos compétences en entretien avec des
                        simulations réalistes et des retours intelligents.
                    </Text>
                </Animatable.View>

                {/* Feature Cards */}
                <View className="flex-col gap-6">
                    <AnimatedFeatureCard
                        delay={200}
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
                    <AnimatedFeatureCard
                        delay={300}
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
                    <AnimatedFeatureCard
                        delay={400}
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

                {/* Call to Action */}
                <Animatable.View
                    animation="fadeInUp"
                    delay={500}
                    duration={600}
                >
                    <CustomButtonIcon
                        onPress={() => router.push("/roleSelection")}
                        className="bg-primary py-4 px-8 rounded-full items-center justify-center flex-row gap-2 my-10"
                        textClassName="text-lg font-semibold"
                        title="Commencer une simulation"
                        icon={
                            <LucideIcons
                                name="arrow-right"
                                color="#FFF"
                                size={20}
                            />
                        }
                    />
                </Animatable.View>

                {/* How It Works */}
                <Animatable.View
                    animation="fadeInUp"
                    delay={600}
                    duration={600}
                    className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm"
                >
                    <View className="items-center mb-3 gap-3">
                        <Text className="text-2xl font-bold text-primary">
                            Comment ça marche?
                        </Text>
                    </View>
                    <View className="flex-col justify-center mb-3 gap-3">
                        {steps.map((step, i) => (
                            <Text
                                key={i}
                                className="text-lg font-semibold text-primary"
                            >
                                {i + 1}. {step.title}:{" "}
                                <Text className="text-primary font-normal">
                                    {step.description}
                                </Text>
                            </Text>
                        ))}
                    </View>
                </Animatable.View>
            </ScrollView>
        </View>
    );
};

const steps = [
    {
        title: "Sélectionner un rôle",
        description:
            "Choisissez parmi une bibliothèque de rôles professionnels pour personnaliser votre pratique.",
    },
    {
        title: "Soumettez vos réponses",
        description:
            "Répondez aux questions d’entretien courantes tout en enregistrant.",
    },
    {
        title: "Obtenez les commentaires de l’IA",
        description:
            "Notre IA analyse vos réponses et fournit des informations constructives.",
    },
    {
        title: "Révisez et améliorez",
        description:
            "Utilisez les commentaires et suivez vos progrès pour réussir votre prochain véritable entretien !",
    },
];

interface CardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const AnimatedFeatureCard = ({
    icon,
    title,
    description,
    delay = 0,
}: CardProps & { delay?: number }) => (
    <Animatable.View
        animation="fadeInUp"
        delay={delay}
        duration={600}
        className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm"
    >
        <View className="flex-row items-center mb-3 gap-3">
            {icon}
            <Text className="text-xl font-semibold text-primary">{title}</Text>
        </View>
        <Text className="text-neutral-600 text-base">{description}</Text>
    </Animatable.View>
);

const style = StyleSheet.create({
    container: {
        paddingBottom: 120,
    },
});

export default Index;
