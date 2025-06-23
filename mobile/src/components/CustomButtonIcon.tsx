import { ActivityIndicator, Pressable, Text } from "react-native";
import { cn } from "../lib/utils";
import React from "react";

type Props = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "ghost";
    className?: string;
    textClassName?: string;
    isLoading?: boolean;
    icon?: React.ReactNode;
};

export default function CustomButtonIcon({
    title,
    onPress,
    icon,
    disabled = false,
    variant = "primary",
    className = "",
    textClassName = "",
    isLoading = false,
}: Props) {
    const baseStyles =
        "px-4 py-3 items-center justify-center transition-opacity";

    const variants: Record<string, string> = {
        primary: "bg-primary",
        secondary: "bg-secondary",
        ghost: "bg-primary-10",
    };

    const textVariants: Record<string, string> = {
        primary: "text-white",
        secondary: "text-white",
        ghost: "text-neutral-600",
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            className={cn(
                baseStyles,
                variants[variant],
                disabled && "opacity-50",
                className,
            )}
        >
            {isLoading ? (
                <ActivityIndicator
                    size="small"
                    className={`${variant === "primary" ? "text-white" : "text-primary"}`}
                />
            ) : (
                <>
                    <Text className={cn(textVariants[variant], textClassName)}>
                        {title}
                    </Text>
                    {icon}
                </>
            )}
        </Pressable>
    );
}
