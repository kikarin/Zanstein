"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function VoucherPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [discount, setDiscount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchDiscount = async () => {
      const discountRef = doc(db, "discounts", user.uid);
      const discountSnap = await getDoc(discountRef);

      if (discountSnap.exists()) {
        setDiscount(discountSnap.data().discountPercentage);
      }
      setLoading(false);
    };

    fetchDiscount();
  }, [user, router]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-black border border-primary rounded-lg text-center">
      <h2 className="text-2xl font-bold text-primary">🎟️ Voucher Diskon</h2>
      {loading ? (
        <p className="text-gray-400 mt-4">Memuat voucher...</p>
      ) : discount !== null ? (
        <div className="mt-4 p-4 border border-primary rounded-lg bg-black">
          <p className="text-xl">Anda mendapatkan diskon:</p>
          <h3 className="text-3xl font-bold text-green-500">{discount}%</h3>
          <p className="text-gray-400 mt-2">Gunakan diskon ini di halaman Order.</p>
        </div>
      ) : (
        <p className="text-gray-400 mt-4">Anda belum memiliki voucher diskon.</p>
      )}
    </div>
  );
}
