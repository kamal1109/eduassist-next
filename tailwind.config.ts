import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // Ini menghubungkan variabel font dari layout.tsx ke Tailwind
                sans: ["var(--font-jakarta)", "sans-serif"],
            },
            colors: {
                // Warna custom yang konsisten dengan globals.css
                edu: {
                    primary: "#4f46e5",    // Indigo-600
                    secondary: "#f59e0b",  // Amber-500
                    bg: "#f8fafc",         // Slate-50
                    dark: "#0f172a",       // Slate-900
                }
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
        container: {
            center: true,
            padding: "1rem",
            screens: {
                "2xl": "1400px",
            },
        },
    },
    plugins: [],
};
export default config;