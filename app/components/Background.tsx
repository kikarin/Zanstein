"use client";

import { useEffect, useState } from "react";

const Background = () => {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const starArray = [];
      for (let i = 0; i < 50; i++) { // Jumlah bintang bisa disesuaikan
        starArray.push({
          id: i,
          x: Math.random() * 100, // Posisi X dalam persen
          y: Math.random() * 100, // Posisi Y dalam persen
          size: Math.random() * 3 + 1, // Ukuran antara 1px - 4px
          delay: Math.random() * 5, // Random delay untuk animasi
        });
      }
      setStars(starArray);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[-1]">
      {/* Bintang-Bintang */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: `${star.y}%`,
            left: `${star.x}%`,
            animationDelay: `${star.delay}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default Background;
