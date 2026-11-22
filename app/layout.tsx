import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Trabalhe Conosco | RF Distribuidora",
    template: "%s | RF Distribuidora",
  },
  description:
    "Portal Oficial de Oportunidades e Banco de Talentos da RF Distribuidora de Alimentos no Estado do Rio de Janeiro.",
  icons: {
    icon: "/rf-monogram.png",
    apple: "/rf-monogram.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-[#FBFBFA] text-gray-800 selection:bg-rf-gold selection:text-rf-green-dark`}>
        {children}
      </body>
    </html>
  );
}

