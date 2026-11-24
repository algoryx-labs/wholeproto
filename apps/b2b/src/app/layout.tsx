import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { brand } from "@calgarywholesale/lib";
import { InteractionEffects } from "@calgarywholesale/ui";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: brand.b2bAppName,
    template: `%s · ${brand.b2bAppName}`,
  },
  description: `${brand.companyName} wholesale ordering portal for grocery and foodservice buyers.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA">
      <body
        className={`${inter.variable} ${bricolage.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
        <InteractionEffects />
      </body>
    </html>
  );
}
