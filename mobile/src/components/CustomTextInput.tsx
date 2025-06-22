import { View, TextInput, Text, TextInputProps } from "react-native";
import { cn } from "../lib/utils";
import React from "react";

type Props = TextInputProps & {
    label?: string;
    error?: string;
    className?: string;
    inputClassName?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
};

export default function CustomTextInput({
    label,
    error,
    className = "",
    inputClassName = "",
    leftIcon,
    rightIcon,
    editable = true,
    ...props
}: Props) {
    return (
        <View className={cn("mb-4", className)}>
            {label && (
                <Text className="mb-1 ml-1 text-lg font-bold text-neutral-700 dark:text-neutral-200">
                    {label}
                </Text>
            )}

            <View className={cn("flex-row items-center py-1")}>
                {leftIcon && <View className="mr-2">{leftIcon}</View>}

                <TextInput
                    className={cn(
                        "flex-1 text-base text-black dark:text-white",
                        error && "border border-red-300",
                        !editable && "opacity-50",
                        inputClassName,
                    )}
                    placeholderTextColor="#9CA3AF"
                    editable={editable}
                    {...props}
                />

                {rightIcon && <View className="ml-2">{rightIcon}</View>}
            </View>

            {error && <Text className="text-sm text-red-500">{error}</Text>}
        </View>
    );
}
