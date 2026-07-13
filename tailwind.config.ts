import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Calm, editorial palette — deliberately not the generic "AI purple".
        ink: "#1c1b19",
        paper: "#faf8f4",
      },
    },
  },
  plugins: [],
} satisfies Config;
