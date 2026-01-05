import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                eduBlue: "#2563eb",
                eduAmber: "#f59e0b",
            },
        },
    },
    plugins: [],
};
export default config;