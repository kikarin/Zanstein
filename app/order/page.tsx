"use client";

import OrderForm from "../components/Orderform";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function OrderPage() {
  const { user } = useAuth();
  const [hasDiscount, setHasDiscount] = useState(false);
  const [hasUsedDiscount, setHasUsedDiscount] = useState(false);

  useEffect(() => {
    const checkDiscountStatus = async () => {
      if (!user) return;

      try {
        const discountDoc = await getDoc(doc(db, "discounts", user.uid));
        const userDoc = await getDoc(doc(db, "users", user.uid));

        setHasDiscount(discountDoc.exists());
        setHasUsedDiscount(userDoc.exists() && userDoc.data().hasUsedDiscount);
      } catch (error) {
        console.error("Error checking discount status:", error);
      }
    };

    checkDiscountStatus();
  }, [user]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary text-center mb-14">📌 Buat Pesanan</h2>


      {/* Form Order */}
      <OrderForm />
    </div>
  );
}
