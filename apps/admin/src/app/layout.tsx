import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { brand } from "@westwinds/lib";
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
  title: brand.adminAppName,
  description: `${brand.adminAppName} staff console for inventory, orders, and pricing.`,
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
      </body>
    </html>
  );
}
