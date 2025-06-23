/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.tsx",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#1F2C50",
                    100: "#1F2C50",
                    90: "#1F2C50CC",
                    80: "#1F2C50AA",
                    70: "#1F2C5088",
                    50: "#4488EEAA",
                    20: "#4488EE44",
                    15: "#4488EE33",
                    10: "#4488EE22",
                    0: "#66AAEE10",
                },
                secondary: {
                    DEFAULT: "#66AAEE10",
                    100: "#777785AE",
                    90: "#7777859B",
                    80: "#77778579",
                    20: "#4488EE44",
                    15: "#4488EE33",
                    10: "#4488EE22",
                    0: "#66AAEE10",
                },
            },
        },
    },
    plugins: [],
};
