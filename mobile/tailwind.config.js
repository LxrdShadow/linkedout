/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
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
                    DEFAULT: "#4488EE",
                    100: "#4488EE",
                    90: "#4488EECC",
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
