import type { Metadata } from "next";
import "./globals.css"; 
import Navbar from "./components/Navbar";
import Background from "./components/Background"; 
import { AuthProvider } from "../contexts/AuthContext";

export const metadata: Metadata = {
  title: "ZanStein Solution",
  description: "Jasa Coding Profesional",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="id">
        <body>
          {/* Background dengan efek bintang */}
          <Background />

          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="max-w-6xl mx-auto relative z-10 p-6">
            {children}
          </main>
        </body>
      </html>
    </AuthProvider>
  );
}
