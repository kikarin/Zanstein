// "use client";

// import { useState, useEffect } from "react";

// const Step3A = ({ orderData, setOrderData, nextStep, prevStep }: any) => {
//   const [discount, setDiscount] = useState<number | null>(null);

//   // Simulasi Cek Diskon User di Firestore (Nanti beneran fetch dari DB)
//   useEffect(() => {
//     const fetchDiscount = async () => {
//       const storedDiscount = 10; // Misal, diskon dari database (hardcoded sementara)
//       setDiscount(storedDiscount);
//     };
//     fetchDiscount();
//   }, []);

//   // **Hitung Total Harga**
//   const calculateTotal = () => {
//     let total = 0;
//     if (orderData.platform === "Web") total += 50_000;
//     if (orderData.platform === "Mobile") total += 75_000;
//     if (orderData.platform === "Multiplatform") total += 100_000;

//     if (discount) {
//       total -= (total * discount) / 100;
//     }
//     return total;
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-bold text-primary text-center">Pilih Teknologi & UI</h2>

//       {/* Pilihan Framework */}
//       <label className="block text-white mt-4">Framework yang digunakan:</label>
//       <select
//         value={orderData.stackChoice}
//         onChange={(e) => setOrderData({ ...orderData, stackChoice: e.target.value })}
//         className="w-full p-2 border border-gray-700 rounded-lg bg-black text-white"
//       >
//         <option value="">Pilih Teknologi</option>
//         <option value="HTML/CSS/JS">🌐 HTML, CSS, JavaScript (No Framework)</option>
//         <option value="Laravel">🔥 Laravel</option>
//         <option value="Next.js">⚡ Next.js</option>
//         <option value="Flutter">📱 Flutter</option>
//         <option value="Rekomendasi">💡 Minta Rekomendasi</option>
//       </select>

//       {/* Total Harga */}
//       <div className="mt-6 p-4 border border-gray-700 rounded-lg text-center">
//         <h3 className="text-lg font-semibold text-white">💰 Total Harga:</h3>
//         <p className="text-2xl font-bold text-primary">Rp {calculateTotal().toLocaleString()}</p>
//         {discount && <p className="text-sm text-green-400">🎉 Diskon {discount}% telah diterapkan!</p>}
//       </div>

//       {/* Navigasi */}
//       <div className="flex justify-between mt-6">
//         <button onClick={prevStep} className="p-2 bg-gray-700 text-white rounded-lg">Kembali</button>
//         <button onClick={nextStep} className="p-2 bg-primary text-white rounded-lg">Lanjut</button>
//       </div>
//     </div>
//   );
// };

// export default Step3A;
