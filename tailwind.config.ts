import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: "#0a0a0a",
                    card: "#141414",
                    elevated: "#1a1a1a",
                },
                primary: {
                    DEFAULT: "#22c55e",
                    hover: "#16a34a",
                    dark: "#15803d",
                },
                accent: {
                    red: "#ef4444",
                    orange: "#f97316",
                    yellow: "#eab308",
                    blue: "#3b82f6",
                    purple: "#a855f7",
                    pink: "#ec4899",
                },
                text: {
                    primary: "#ffffff",
                    secondary: "#a1a1aa",
                    muted: "#71717a",
                },
                border: {
                    DEFAULT: "#27272a",
                    subtle: "#1f1f23",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            borderRadius: {
                xl: "1rem",
                "2xl": "1.25rem",
                "3xl": "1.5rem",
            },
            boxShadow: {
                glow: "0 0 20px rgba(34, 197, 94, 0.15)",
                card: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
            },
        },
    },
    plugins: [],
};
export default config;
