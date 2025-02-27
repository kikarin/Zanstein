"use client";

import { OrderData } from "../../../lib/types/order";

interface Step1Props {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
  nextStep: () => void;
}

const Step1 = ({ orderData, updateOrderData, nextStep }: Step1Props) => {
  const handleSelect = (value: "A" | "B" | "C" | "D") => {
    updateOrderData({ projectType: value });
    nextStep();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary text-center">Pilih Jenis Proyek</h2>
      <div className="mt-4 space-y-3">
        <button 
          onClick={() => handleSelect("A")} 
          className={`w-full p-3 rounded-lg border transition-colors ${
            orderData.projectType === "A"
              ? "bg-primary text-white border-primary"
              : "bg-gray-800 text-white border-gray-600 hover:border-primary"
          }`}
        >
          📚 Tugas Sekolah Harian
        </button>
        <button 
          onClick={() => handleSelect("B")} 
          className={`w-full p-3 rounded-lg border transition-colors ${
            orderData.projectType === "B"
              ? "bg-primary text-white border-primary"
              : "bg-gray-800 text-white border-gray-600 hover:border-primary"
          }`}
        >
          🎓 Ujikom (Ujian Kompetensi)
        </button>
        <button 
          onClick={() => handleSelect("C")} 
          className={`w-full p-3 rounded-lg border transition-colors ${
            orderData.projectType === "C"
              ? "bg-primary text-white border-primary"
              : "bg-gray-800 text-white border-gray-600 hover:border-primary"
          }`}
        >
          🏢 Sidang PKL
        </button>
        <button 
          onClick={() => handleSelect("D")} 
          className={`w-full p-3 rounded-lg border transition-colors ${
            orderData.projectType === "D"
              ? "bg-primary text-white border-primary"
              : "bg-gray-800 text-white border-gray-600 hover:border-primary"
          }`}
        >
          🚀 Pengembangan Web / Aplikasi Profesional
        </button>
      </div>
    </div>
  );
};

export default Step1;
