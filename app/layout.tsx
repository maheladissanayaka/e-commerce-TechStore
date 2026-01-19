import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { UIProvider } from "@/context/UIContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartProvider from "@/components/providers/CartProvider";
import { Suspense } from "react"; // 👈 1. Import Suspense

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechStore E-commerce",
  description: "Best products at best prices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <UIProvider>
              <div className="flex flex-col min-h-screen">
                
                {/* 👇 2. Wrap Header in Suspense to fix the Vercel build error */}
                <Suspense fallback={<div className="h-16 bg-white border-b" />}>
                  <Header /> 
                </Suspense>
                
                <div className="flex-grow">
                  {children}
                </div>

                <Footer />
              </div>
            </UIProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}