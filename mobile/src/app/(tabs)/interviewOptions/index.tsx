import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import React, { useState, useMemo, useRef } from "react";
import { useRouter } from "expo-router";
import LucideIcons from "@react-native-vector-icons/lucide";
import clsx from "clsx";
import CustomButtonIcon from "@/src/components/CustomButtonIcon";

const popularRoles = [
    "Développeur Web",
    "Designer UX",
    "Responsable Marketing",
    "Analyste Financier",
    "Chef de Projet",
    "Data Scientist",
    "Rédacteur Technique",
    "Spécialiste SEO",
];

const RoleSelection = () => {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selected, setSelected] = useState<string | null>(null);
    const [customMode, setCustomMode] = useState(false);
    const customRoleInputRef = useRef<TextInput>(null);

    const filteredRoles = useMemo(
        () =>
            popularRoles.filter((role) =>
                role.toLowerCase().includes(search.toLowerCase()),
            ),
        [search],
    );

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        // Debounce the search update to reduce re-renders
        const timer = setTimeout(() => {
            setSearch(text);
        }, 200);
        return () => clearTimeout(timer);
    };

    const handleContinue = () => {
        if (!selected) return;
        router.push({
            pathname: "/interviewOptions/difficultySelection",
            params: { role: selected },
        });
    };

    const handleSwitchToCustomMode = () => {
        setCustomMode(true);
        setSelected("");
        setSearch("");
        setSearchQuery("");
        // Focus the custom role input after a small delay to ensure it's mounted
        setTimeout(() => customRoleInputRef.current?.focus(), 100);
    };

    const handleSwitchToListMode = () => {
        setCustomMode(false);
        setSelected(null);
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header and Inputs - Placed outside FlatList */}
            <View className="px-6 pt-10 pb-4">
                <View className="items-center mb-8">
                    <Text className="text-3xl font-bold text-primary text-center">
                        Quel est le rôle que vous souhaitez simuler ?
                    </Text>
                    <Text className="mt-3 text-center text-neutral-500">
                        Choisissez un poste dans la liste ou saisissez le vôtre.
                    </Text>
                </View>

                {!customMode ? (
                    <TextInput
                        key="search-input"
                        value={searchQuery}
                        onChangeText={handleSearch}
                        placeholder="Rechercher un rôle..."
                        className="border border-neutral-300 rounded-xl px-4 py-3 mb-4 text-base"
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                ) : (
                    <TextInput
                        ref={customRoleInputRef}
                        key="custom-role-input"
                        placeholder="Saisissez le rôle souhaité..."
                        value={selected ?? ""}
                        onChangeText={setSelected}
                        className="border border-neutral-300 rounded-xl px-4 py-3 mb-4 text-base"
                        autoCorrect={false}
                        autoFocus={true}
                    />
                )}
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
                style={{ flex: 1 }}
            >
                <FlatList
                    data={customMode ? [] : filteredRoles}
                    keyExtractor={(item) => item}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className={clsx(
                                "mx-6 border rounded-xl px-4 py-4 mb-3",
                                selected === item
                                    ? "border-primary bg-primary/10"
                                    : "border-neutral-200",
                            )}
                            onPress={() => setSelected(item)}
                        >
                            <Text
                                className={clsx(
                                    "text-base",
                                    selected === item
                                        ? "text-primary font-semibold"
                                        : "text-neutral-700",
                                )}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                    ListFooterComponent={() => (
                        <View className="px-6 pb-10">
                            {!customMode ? (
                                <TouchableOpacity
                                    className="mt-2 mb-6"
                                    onPress={handleSwitchToCustomMode}
                                >
                                    <Text className="text-primary text-center underline">
                                        Je ne trouve pas mon rôle
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    className="mb-4"
                                    onPress={handleSwitchToListMode}
                                >
                                    <Text className="text-primary text-center underline">
                                        Retour à la liste
                                    </Text>
                                </TouchableOpacity>
                            )}

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
                    )}
                    contentContainerStyle={{ paddingBottom: 60 }}
                />
            </KeyboardAvoidingView>
        </View>
    );
};

export default RoleSelection;
