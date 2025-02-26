"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function OrderPage() {
  const { user } = useAuth();
  const [service, setService] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState(0);

  const services = [
    { name: "Website Development", price: 5000000 },
    { name: "Mobile App Development", price: 7000000 },
    { name: "UI/UX Design", price: 3000000 },
    { name: "Backend Development", price: 6000000 },
  ];

  useEffect(() => {
    const fetchDiscount = async () => {
      if (user) {
        const discountRef = doc(db, "discounts", user.uid);
        const discountSnap = await getDoc(discountRef);
        if (discountSnap.exists()) {
          setDiscount(discountSnap.data().discountPercentage);
        }
      }
    };

    fetchDiscount();
  }, [user]);

  useEffect(() => {
    if (discount !== null) {
      const discountAmount = (price * discount) / 100;
      setFinalPrice(price - discountAmount);
    } else {
      setFinalPrice(price);
    }
  }, [price, discount]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-black border border-primary rounded-lg">
      <h2 className="text-2xl font-bold text-primary text-center">Order Jasa Coding</h2>

      <label className="block mt-4">Pilih Layanan</label>
      <select
        value={service}
        onChange={(e) => {
          const selectedService = services.find((s) => s.name === e.target.value);
          setService(e.target.value);
          setPrice(selectedService?.price || 0);
        }}
        className="w-full p-2 mt-2 border rounded-lg bg-black text-white border-primary"
      >
        <option value="">-- Pilih Layanan --</option>
        {services.map((s) => (
          <option key={s.name} value={s.name}>
            {s.name} - Rp{(s.price).toLocaleString()}
          </option>
        ))}
      </select>

      <p className="mt-4 text-lg">Harga: <span className="font-bold">Rp{price.toLocaleString()}</span></p>

      {discount !== null && (
        <p className="mt-2 text-green-500">Diskon {discount}% digunakan! 🎉</p>
      )}

      <p className="mt-4 text-xl font-bold text-primary">
        Total Bayar: Rp{finalPrice.toLocaleString()}
      </p>

      <button className="mt-4 w-full p-2 bg-green-500 text-white rounded-lg">Pesan Sekarang</button>
    </div>
  );
}
