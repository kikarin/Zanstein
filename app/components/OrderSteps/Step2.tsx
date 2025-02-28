"use client";

import { useState } from "react";
import { OrderData } from "../../../lib/types/order";

interface Step2Props {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const Step2 = ({ orderData, updateOrderData, nextStep, prevStep }: Step2Props) => {
  const [customAppType, setCustomAppType] = useState(orderData.applicationType === "Custom" ? orderData.customApplicationType || "" : "");

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary text-center">Detail Proyek</h2>
      <div className="mt-4 space-y-3">
        {/* Platform */}
        <label className="block text-white">Platform:</label>
        <select
          value={orderData.platform}
          onChange={(e) => updateOrderData({ platform: e.target.value as "Web" | "Mobile" | "Multiplatform" })}
          className="w-full p-2 border border-gray-700 rounded-lg bg-black text-white"
        >
          <option value="">Pilih Platform</option>
          <option value="Web">🌐 Web</option>
          <option value="Mobile">📱 Mobile</option>
          <option value="Multiplatform">🔀 Multiplatform</option>
        </select>

        {/* Nama Aplikasi */}
        <label className="block text-white">Nama Proyek:</label>
        <input
          type="text"
          value={orderData.projectName}
          onChange={(e) => updateOrderData({ projectName: e.target.value })}
          className="w-full p-2 border border-gray-700 rounded-lg bg-black text-white"
          placeholder="Masukkan nama proyek..."
        />

        {/* Jenis Aplikasi */}
        <label className="block text-white">Jenis Aplikasi:</label>
        <select
          value={orderData.applicationType}
          onChange={(e) => {
            const value = e.target.value;
            updateOrderData({ applicationType: value });

            if (value !== "Custom") {
              updateOrderData({ customApplicationType: "" });
            }
          }}
          className="w-full p-2 border border-gray-700 rounded-lg bg-black text-white"
        >
          <option value="">Pilih Jenis Aplikasi</option>
          <option value="Company Profile">🏢 Company Profile</option>
          <option value="E-Commerce">🛒 E-Commerce</option>
          <option value="Sistem Manajemen">📊 Sistem Manajemen</option>
          <option value="Social Media">📱 Social Media App</option>
          <option value="Reservasi">📝 Aplikasi Pemesanan / Reservasi</option>
          <option value="Custom">✍️ Custom</option>
          <option value="Rekomendasi">💡 Minta Rekomendasi</option>
        </select>

        {/* Input untuk jenis aplikasi custom */}
        {orderData.applicationType === "Custom" && (
          <>
            <label className="block text-white">Tulis Jenis Aplikasi:</label>
            <input
              type="text"
              value={customAppType}
              onChange={(e) => {
                setCustomAppType(e.target.value);
                updateOrderData({ customApplicationType: e.target.value });
              }}
              className="w-full p-2 border border-gray-700 rounded-lg bg-black text-white"
              placeholder="Masukkan jenis aplikasi yang diinginkan..."
            />
          </>
        )}

        {/* Note untuk rekomendasi */}
        {orderData.applicationType === "Rekomendasi" && (
          <p className="text-yellow-400 italic">Nanti konsultasi bareng mimin ganteng ya hehe 😆</p>
        )}

        {/* Link Referensi */}
        <label className="block text-white">Link Referensi (Opsional):</label>
        <input
          type="text"
          value={orderData.referenceLink}
          onChange={(e) => updateOrderData({ referenceLink: e.target.value })}
          className="w-full p-2 border border-gray-700 rounded-lg bg-black text-white"
          placeholder="Masukkan link referensi jika ada..."
        />
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="p-2 bg-gray-700 text-white rounded-lg">Kembali</button>
        <button onClick={nextStep} className="p-2 bg-primary text-white rounded-lg">Lanjut</button>
      </div>
    </div>
  );
};

export default Step2;
