import type { Metadata } from "next";
import "./globals.css"; 
import Navbar from "./components/Navbar";
import { AuthProvider } from "../contexts/AuthContext";

export const metadata: Metadata = {
  title: "ZanStein Solution",
  description: "Jasa Coding Profesional",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="id">
        <body className="bg-black text-white font-sans relative">
          {/* Efek Glow Lembut di Background */}
          <div className="glow-effect"></div>
          
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="max-w-6xl mx-auto relative z-10">
            {children}
          </main>
        </body>
      </html>
    </AuthProvider>
  );
}
