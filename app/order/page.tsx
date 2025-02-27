"use client";

import OrderForm from "../components/Orderform";
import { useAuth } from "../../contexts/AuthContext";

export default function OrderPage() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary text-center">📌 Buat Pesanan</h2>

      {/* 🔹 Notifikasi untuk user yang belum login */}
      {!user && (
        <p className="text-center text-gray-400 mt-4">
          Silakan login untuk menyimpan diskon & riwayat pesanan.
        </p>
      )}

      {/* 🔹 Form Order */}
      <OrderForm />
    </div>
  );
}
