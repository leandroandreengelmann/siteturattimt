import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TurattiMT - Materiais de Construção",
    template: "%s | TurattiMT",
  },
  description:
    "Materiais de construção de qualidade. Tintas, ferramentas e tudo para sua obra.",
  keywords: [
    "materiais de construção",
    "tintas",
    "ferramentas",
    "construção",
    "obras",
  ],
  authors: [{ name: "TurattiMT" }],
  creator: "TurattiMT",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "TurattiMT - Materiais de Construção",
    description:
      "Materiais de construção de qualidade. Tintas, ferramentas e tudo para sua obra.",
    siteName: "TurattiMT",
  },
  twitter: {
    card: "summary_large_image",
    title: "TurattiMT - Materiais de Construção",
    description:
      "Materiais de construção de qualidade. Tintas, ferramentas e tudo para sua obra.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head></head>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
