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
                        Welcome to LinkedOut
                    </Text>
                    <Text className="mt-4 text-center text-neutral-500 text-lg px-2">
                        Boost your interview skills with realistic simulations
                        and intelligent feedback.
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
                        title="Realistic simulations"
                        description="Experience interviews like in real conditions, adapted to your field."
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
                        title="AI-assisted analysis"
                        description="Receive an automatic assessment of your answers to help you improve."
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
                        title="Progress tracking"
                        description="Visualize your progress with clear and motivating graphs."
                    />
                </View>

                {/* Call to Action */}
                <Animatable.View
                    animation="fadeInUp"
                    delay={500}
                    duration={600}
                >
                    <CustomButtonIcon
                        onPress={() => router.push("/interviewOptions")}
                        className="bg-primary py-4 px-8 rounded-full items-center justify-center flex-row gap-2 my-10"
                        textClassName="text-lg font-semibold"
                        title="Start a simulation"
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
                            How does it work?
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
        title: "Select a role",
        description:
            "Choose from a library of professional roles to customize your practice.",
    },
    {
        title: "Submit your answers",
        description: "Answer common interview questions while recording.",
    },
    {
        title: "Get feedback from AI",
        description:
            "Our AI analyzes your responses and provides constructive insights.",
    },
    {
        title: "Review and improve",
        description:
            "Use feedback and track your progress to ace your next real interview!",
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
