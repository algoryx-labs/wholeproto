import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { brand } from "@calgarywholesale/lib";
import { Providers } from "@/components/providers";
import { AppChrome } from "@/components/app-chrome";
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
  title: brand.mobileAppName,
  description: `Order fresh groceries from ${brand.companyName}.`,
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
        <Providers>
          <AppChrome>{children}</AppChrome>
        </Providers>
      </body>
    </html>
  );
}