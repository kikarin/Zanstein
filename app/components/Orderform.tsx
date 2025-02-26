"use client";

import { useState } from "react";

const OrderForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    additionalNotes: "",
    price: 0,
  });

  const services = [
    { name: "Website Development", price: 5000000 },
    { name: "Mobile App Development", price: 7000000 },
    { name: "UI/UX Design", price: 3000000 },
    { name: "Backend Development", price: 6000000 },
  ];

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      price: name === "service" ? services.find((s) => s.name === value)?.price || 0 : prev.price,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Pesanan berhasil dikirim!");
    console.log(formData);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-black border border-primary rounded-lg">
      <h2 className="text-2xl font-bold text-primary text-center">Form Order</h2>

      {step === 1 && (
        <div className="mt-4">
          <label className="block">Nama Lengkap</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded-lg bg-black text-white border-primary"
            required
          />

          <label className="block mt-4">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded-lg bg-black text-white border-primary"
            required
          />

          <button onClick={handleNext} className="mt-4 w-full p-2 bg-primary text-white rounded-lg">
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-4">
          <label className="block">Pilih Layanan</label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded-lg bg-black text-white border-primary"
            required
          >
            <option value="">-- Pilih Layanan --</option>
            {services.map((service) => (
              <option key={service.name} value={service.name}>
                {service.name} - Rp{service.price.toLocaleString()}
              </option>
            ))}
          </select>

          <button onClick={handlePrev} className="mt-4 w-1/2 p-2 bg-gray-700 text-white rounded-lg">
            Back
          </button>
          <button onClick={handleNext} className="mt-4 w-1/2 p-2 bg-primary text-white rounded-lg">
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="mt-4">
          <label className="block">Catatan Tambahan</label>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 mt-2 border rounded-lg bg-black text-white border-primary"
          ></textarea>

          <p className="mt-4 text-lg font-bold">Total Harga: Rp{formData.price.toLocaleString()}</p>

          <button onClick={handlePrev} className="mt-4 w-1/2 p-2 bg-gray-700 text-white rounded-lg">
            Back
          </button>
          <button onClick={handleNext} className="mt-4 w-1/2 p-2 bg-primary text-white rounded-lg">
            Next
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold text-primary">Konfirmasi Pesanan</h3>
          <p>Nama: {formData.name}</p>
          <p>Email: {formData.email}</p>
          <p>Layanan: {formData.service}</p>
          <p>Total Harga: Rp{formData.price.toLocaleString()}</p>
          <p>Catatan: {formData.additionalNotes || "-"}</p>

          <button onClick={handlePrev} className="mt-4 w-1/2 p-2 bg-gray-700 text-white rounded-lg">
            Back
          </button>
          <button onClick={handleSubmit} className="mt-4 w-1/2 p-2 bg-green-500 text-white rounded-lg">
            Submit Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
