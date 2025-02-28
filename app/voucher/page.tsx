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
  const [hasUsedDiscount, setHasUsedDiscount] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchDiscountInfo = async () => {
      try {
        // Check discount amount
        const discountRef = doc(db, "discounts", user.uid);
        const discountSnap = await getDoc(discountRef);

        // Check if discount has been used
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (discountSnap.exists()) {
          setDiscount(discountSnap.data().discountPercentage);
        }

        if (userSnap.exists()) {
          setHasUsedDiscount(userSnap.data().hasUsedDiscount || false);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching discount info:", error);
        setLoading(false);
      }
    };

    fetchDiscountInfo();
  }, [user, router]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-black border border-primary rounded-lg text-center">
      <h2 className="text-2xl font-bold text-primary">🎟️ Voucher Diskon</h2>
      {loading ? (
        <p className="text-gray-400 mt-4">Memuat voucher...</p>
      ) : discount !== null ? (
        <div className="mt-4 p-4 border border-primary rounded-lg bg-black">
          <p className="text-xl">
            {hasUsedDiscount 
              ? "Anda sudah menggunakan diskon Anda"
              : "Anda mendapatkan diskon:"}
          </p>
          {!hasUsedDiscount && (
            <>
              <h3 className="text-3xl font-bold text-green-500">{discount}%</h3>
              <p className="text-gray-400 mt-2">
                Gunakan diskon ini di halaman Order sebelum melakukan checkout.
              </p>
            </>
          )}
          {hasUsedDiscount && (
            <p className="text-yellow-500 mt-2">
              Diskon hanya bisa digunakan satu kali untuk setiap user.
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-400 mt-4">
          Anda belum memiliki voucher diskon. Berikan testimoni untuk mendapatkan diskon!
        </p>
      )}
    </div>
  );
}
