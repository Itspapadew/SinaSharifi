import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["300", "400"] });

export const metadata: Metadata = {
  title: "Sina Sharifi — The world, witnessed.",
  description: "Fine art photography by Sina Sharifi. Limited edition prints available.",
  openGraph: {
    title: "Sina Sharifi — The world, witnessed.",
    description: "Fine art photography by Sina Sharifi. Limited edition prints available.",
    url: "https://sharifisina.com",
    siteName: "Sina Sharifi",
    images: [{ url: "https://sharifisina.com/og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.variable} style={{ margin: 0, background: "#f7f5f1" }}>
        <Nav />
        <CartDrawer />
        {children}
      </body>
    </html>
  );
}
