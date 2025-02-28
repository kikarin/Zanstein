// "use client";

// import { useState } from "react";
// import { OrderData } from "../../../lib/types/order";
// import { PRICE_LIST } from "../../../lib/utils/priceCalculator";

// interface Step3CProps {
//   orderData: OrderData;
//   updateOrderData: (data: Partial<OrderData>) => void;
//   nextStep: () => void;
//   prevStep: () => void;
// }

// const Step3C = ({ orderData, updateOrderData, nextStep, prevStep }: Step3CProps) => {
//   const [needConsultation, setNeedConsultation] = useState(false);

//   const handleTechnologyChoice = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     const [category, tech] = name.split('.');
    
//     updateOrderData({
//       mixmatchChoice: {
//         ...orderData.mixmatchChoice,
//         [category]: checked ? tech : ''
//       }
//     });
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-primary text-center">
//         Pengembangan Web / Aplikasi Profesional
//       </h2>

//       {/* Pilihan Konsultasi */}
//       <div className="space-y-4">
//         <label className="block text-lg font-medium text-white">
//           Bagaimana Anda ingin melanjutkan?
//         </label>
//         <div className="space-y-2">
//           <button
//             onClick={() => setNeedConsultation(false)}
//             className={`w-full p-3 rounded-lg border ${
//               !needConsultation
//                 ? "bg-primary text-white border-primary"
//                 : "bg-transparent text-white border-gray-600"
//             }`}
//           >
//             🛠️ Saya sudah tahu teknologi yang ingin digunakan
//           </button>
//           <button
//             onClick={() => {
//               setNeedConsultation(true);
//               updateOrderData({ needsConsultation: true });
//             }}
//             className={`w-full p-3 rounded-lg border ${
//               needConsultation
//                 ? "bg-primary text-white border-primary"
//                 : "bg-transparent text-white border-gray-600"
//             }`}
//           >
//             💡 Saya butuh saran dari Admin
//           </button>
//         </div>
//       </div>

//       {!needConsultation && (
//         <>
//           {/* Frontend */}
//           <div className="space-y-3">
//             <label className="block text-lg font-medium text-white">
//               Frontend Technology
//             </label>
//             <div className="grid grid-cols-2 gap-3">
//               {Object.entries(PRICE_LIST.frontends).map(([tech, price]) => (
//                 <label key={tech} className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
//                   <input
//                     type="checkbox"
//                     name={`frontend.${tech}`}
//                     checked={orderData.mixmatchChoice?.frontend === tech}
//                     onChange={handleTechnologyChoice}
//                     className="form-checkbox"
//                   />
//                   <span className="text-white">
//                     {tech} - Rp {price.toLocaleString()}
//                   </span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Backend */}
//           <div className="space-y-3">
//             <label className="block text-lg font-medium text-white">
//               Backend Technology
//             </label>
//             <div className="grid grid-cols-2 gap-3">
//               {Object.entries(PRICE_LIST.backends).map(([tech, price]) => (
//                 <label key={tech} className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
//                   <input
//                     type="checkbox"
//                     name={`backend.${tech}`}
//                     checked={orderData.mixmatchChoice?.backend === tech}
//                     onChange={handleTechnologyChoice}
//                     className="form-checkbox"
//                   />
//                   <span className="text-white">
//                     {tech} - Rp {price.toLocaleString()}
//                   </span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Database */}
//           <div className="space-y-3">
//             <label className="block text-lg font-medium text-white">
//               Database
//             </label>
//             <div className="grid grid-cols-2 gap-3">
//               {Object.entries(PRICE_LIST.databases).map(([tech, price]) => (
//                 <label key={tech} className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg">
//                   <input
//                     type="checkbox"
//                     name={`database.${tech}`}
//                     checked={orderData.mixmatchChoice?.database === tech}
//                     onChange={handleTechnologyChoice}
//                     className="form-checkbox"
//                   />
//                   <span className="text-white">
//                     {tech} - Rp {price.toLocaleString()}
//                   </span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </>
//       )}

//       {/* Navigasi */}
//       <div className="flex justify-between pt-6">
//         <button
//           onClick={prevStep}
//           className="px-6 py-2 bg-gray-600 text-white rounded-lg"
//         >
//           Kembali
//         </button>
//         <button
//           onClick={nextStep}
//           className="px-6 py-2 bg-primary text-white rounded-lg"
//         >
//           Lanjut
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Step3C; 