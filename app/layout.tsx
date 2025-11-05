import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { NavigationProvider } from "./components/NavigationProvider";
import LoadingBar from "./components/LoadingBar";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Converso",
  description: "Real-time AI Teaching Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: "#fe5933" } }}>
      <html lang="en">
        <body className={`${bricolage.variable} antialiased`}>
          <NavigationProvider>
            <LoadingBar />
            <Navbar />
            {children}
            <Footer />
          </NavigationProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
