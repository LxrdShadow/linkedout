import {
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import clsx from "clsx";
import LucideIcons from "@react-native-vector-icons/lucide";
import CustomButtonIcon from "@/src/components/CustomButtonIcon";

const difficulties = ["Facile", "Intermédiaire", "Difficile"];

const DifficultySelection = () => {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleContinue = () => {
        if (!selected) return;
        router.push({
            pathname: "/interview",
            params: { difficulty: selected },
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1, backgroundColor: "white" }}
        >
            <View className="px-6 pt-10 flex-1">
                <View className="items-center mb-8">
                    <Text className="text-3xl font-bold text-primary text-center">
                        Choisissez la difficulté
                    </Text>
                    <Text className="mt-3 text-center text-neutral-500">
                        Sélectionnez votre niveau de défi pour la simulation.
                    </Text>
                </View>

                <View>
                    {difficulties.map((level) => (
                        <TouchableOpacity
                            key={level}
                            className={clsx(
                                "mx-0 border rounded-xl px-4 py-4 mb-4",
                                selected === level
                                    ? "border-primary bg-primary/10"
                                    : "border-neutral-200",
                            )}
                            onPress={() => setSelected(level)}
                        >
                            <Text
                                className={clsx(
                                    "text-lg text-center",
                                    selected === level
                                        ? "text-primary font-semibold"
                                        : "text-neutral-700",
                                )}
                            >
                                {level}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="mt-auto pb-10">
                    <CustomButtonIcon
                        title="continuer"
                        variant="primary"
                        className={clsx(
                            "py-4 px-6 rounded-full flex-row justify-center items-center gap-2",
                            !selected && "opacity-50",
                        )}
                        onPress={handleContinue}
                        disabled={!selected}
                        icon={
                            <LucideIcons
                                name="arrow-right"
                                size={20}
                                color="#FFF"
                            />
                        }
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default DifficultySelection;
