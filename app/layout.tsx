import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";

import "./site.css";
import { siteConfig } from "@/lib/siteConfig";
import { businessJsonLd, personJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

// Fontes servidas pelo próprio domínio: elimina o request ao Google Fonts
// e o layout shift que ele causa enquanto a fonte não chega.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-fraunces",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.role} em ${siteConfig.address.city}`,
    // As páginas internas preenchem só o próprio nome; o sufixo vem daqui.
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Farmacêutico esteta em Jaraguá do Sul especializado em Arquitetura Facial, Estética Regenerativa e Envelhecimento Saudável. Avaliação individual, sem protocolo padrão.",
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.url,
    siteName: `${siteConfig.name} — ${siteConfig.role}`,
    title: `${siteConfig.name} — ${siteConfig.role} em ${siteConfig.address.city}`,
    description:
      "Estética avançada com planejamento individual: arquitetura facial, estética regenerativa e envelhecimento saudável em Jaraguá do Sul.",
    images: [
      {
        url: "/images/dr-victor-folster-hero.png",
        width: 1600,
        height: 1600,
        alt: `${siteConfig.name}, ${siteConfig.role.toLowerCase()} em ${siteConfig.address.city}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description:
      "Estética avançada com planejamento individual em Jaraguá do Sul. Avaliação antes de qualquer indicação.",
    images: ["/images/dr-victor-folster-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  category: "health",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4B5A45",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        {children}
        {/* Identidade do negócio e do profissional — vale para o site inteiro */}
        <JsonLd data={[businessJsonLd(), personJsonLd()]} />
      </body>
    </html>
  );
}
