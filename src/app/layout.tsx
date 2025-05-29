import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans'
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ScrollRestoration } from "@/components/ScrollRestoration";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Toaster } from 'sonner'
import { LoadingScreen } from '@/components/LoadingScreen'
import { GlobalTransition } from '@/components/GlobalTransition'

export const metadata: Metadata = {
  title: "PlayStation Games",
  description: "Experience the best PlayStation games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.className} antialiased min-h-screen flex flex-col`}>
        <LoadingScreen />
        <GlobalTransition>
          <AuthProvider>
            <SmoothScrollProvider>
              <ScrollRestoration />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster />
            </SmoothScrollProvider>
          </AuthProvider>
        </GlobalTransition>
      </body>
    </html>
  );
}
