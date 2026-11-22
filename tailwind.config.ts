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
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        rf: {
          green: "#0F382A",
          "green-dark": "#0A261C",
          "green-light": "#17523C",
          gold: "#CBA358",
          "gold-hover": "#B88F44",
          "gold-light": "#F6EEDB",
          cream: "#FBFBFA",
          // Mapeamento em português para retrocompatibilidade
          verde: "#0F382A",
          dourado: "#CBA358",
          "verde-escuro": "#0A261C",
          "verde-claro": "#17523C",
          "dourado-hover": "#B88F44",
          "dourado-claro": "#F6EEDB",
          cinza: "#1F2937",
          branco: "#FFFFFF",
          "cinza-claro": "#FBFBFA",
          "cinza-medio": "#E5E7EB",
          // Vermelho reservado estritamente para ações destrutivas (excluir/expurgo) e erros
          vermelho: "#DC2626",
          "vermelho-escuro": "#991B1B",
        },
      },
    },
  },
  plugins: [],
};
export default config;

