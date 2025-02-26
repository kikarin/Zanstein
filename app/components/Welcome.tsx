"use client";

import { useEffect, useState } from "react";

const Welcome = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300); // Animasi fade-in setelah 300ms
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Teks Welcome dengan Animasi */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Selamat Datang di ZanStein Solution
        </h1>
        <p className="mt-1 text-xl text-gray-300 max-w-2xl">
          Kami menyediakan layanan coding profesional dengan kualitas terbaik.
        </p>
      </div>

      {/* Efek Glow di Latar Belakang (Cahaya Halus) */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500 opacity-30 blur-[150px] rounded-full top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[-1]"></div>
    </section>
  );
};

export default Welcome;
