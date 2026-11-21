import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        rf: {
          verde: "#0F382A",
          dourado: "#CBA358",
          "verde-escuro": "#0A261C",
          vermelho: "#C0392B",
          cinza: "#2C3E50",
          branco: "#FFFFFF",
          "cinza-claro": "#F8F9FA",
          "cinza-medio": "#BDC3C7",
          "vermelho-escuro": "#962D22",
        },
      },
    },
  },
  plugins: [],
};
export default config;
