import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { UIProvider } from "@/context/UIContext"; // 👈 Import UIProvider
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartProvider from "@/components/providers/CartProvider";

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
          <UIProvider> {/* 👈 Wrap everything here */}
            <div className="flex flex-col min-h-screen">
              {/* Header is global and contains the Toggle Button */}
              <Header /> 
              
              {/* Main Content grows to fill space */}
              <div className="flex-grow">
                {children}
              </div>

              {/* Footer is global */}
              <Footer />
            </div>
          </UIProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}