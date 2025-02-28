"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../lib/firebaseConfig";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { calculateOrderPrice } from "../../../lib/utils/priceCalculator";
import { OrderData } from "../../../lib/types/order";
import { PRICE_LIST } from "../../../lib/utils/priceCalculator";

interface Step4Props {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
  prevStep: () => void;
}

const Step4 = ({ orderData, updateOrderData, prevStep }: Step4Props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [hasUsedDiscount, setHasUsedDiscount] = useState(false);

  useEffect(() => {
    const checkDiscountUsage = async () => {
      if (!user) return;
      
      try {
        const userOrdersRef = collection(db, "orders");
        const userOrdersSnap = await getDoc(doc(db, "users", user.uid));
        
        if (userOrdersSnap.exists() && userOrdersSnap.data().hasUsedDiscount) {
          setHasUsedDiscount(true);
          // Reset discount if user has already used it
          updateOrderData({ discount: 0 });
        }
      } catch (error) {
        console.error("Error checking discount usage:", error);
      }
    };

    checkDiscountUsage();
  }, [user]);

  const calculateTotal = () => {
    let total = 0;

    orderData.roles?.forEach(role => {
      total += PRICE_LIST.roles[role] || 0;
    });

    if (orderData.developmentMethod === "fullstack" && orderData.fullstackChoice) {
      total += PRICE_LIST.fullstackFrameworks[orderData.fullstackChoice.framework] || 0;
      total += PRICE_LIST.databases[orderData.fullstackChoice.database] || 0;
    } else if (orderData.mixmatchChoice) {
      total += PRICE_LIST.frontends[orderData.mixmatchChoice.frontend] || 0;
      total += PRICE_LIST.backends[orderData.mixmatchChoice.backend] || 0;
      total += PRICE_LIST.apis[orderData.mixmatchChoice.api] || 0;
      total += PRICE_LIST.databases[orderData.mixmatchChoice.database] || 0;
    }

    orderData.uiFramework?.forEach(framework => {
      total += PRICE_LIST.uiFrameworks[framework] || 0;
    });

    if (orderData.notificationType) {
      total += PRICE_LIST.notifications[orderData.notificationType] || 0;
    }

    if (orderData.deadline) {
      total += PRICE_LIST.deadlines[orderData.deadline] || 0;
    }

    return total;
  };

  

  const totalPriceBeforeDiscount = calculateTotal();
  const finalPrice = orderData.discount 
    ? totalPriceBeforeDiscount * (1 - orderData.discount/100) 
    : totalPriceBeforeDiscount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (orderData.discount && hasUsedDiscount) {
        alert("Anda sudah menggunakan diskon sebelumnya.");
        setLoading(false);
        return;
      }

      // Prepare complete order data
      const orderDataToSave = {
        // Customer Info
        customerName: orderData.customerName || 'Guest',
        whatsappNumber: orderData.whatsappNumber || '',
        paymentMethod: orderData.paymentMethod || '',
        userId: user?.uid || 'guest',
        
        // Project Details
        projectType: orderData.projectType || '',
        projectName: orderData.projectName || '',
        platform: orderData.platform || '',
        applicationType: orderData.applicationType || '',
        referenceLink: orderData.referenceLink || '',

        // Development Details
        developmentMethod: orderData.developmentMethod || 'fullstack',
        
        // Fullstack Choice
        ...(orderData.developmentMethod === 'fullstack' && {
          fullstackChoice: {
            framework: orderData.fullstackChoice?.framework || '',
            database: orderData.fullstackChoice?.database || ''
          }
        }),
        
        // Mix & Match Choice
        ...(orderData.developmentMethod === 'mixmatch' && {
          mixmatchChoice: {
            frontend: orderData.mixmatchChoice?.frontend || '',
            backend: orderData.mixmatchChoice?.backend || '',
            api: orderData.mixmatchChoice?.api || '',
            database: orderData.mixmatchChoice?.database || ''
          }
        }),

        // UI/UX Details
        roles: orderData.roles || [],
        uiFramework: orderData.uiFramework || [],
        themeChoice: orderData.themeChoice || { mode: 'light', style: '' },
        notificationType: orderData.notificationType || 'default',
        customColors: orderData.customColors || { count: 0, colors: [] },

        // Pricing
        totalPrice: calculateTotal(),
        originalPrice: totalPriceBeforeDiscount,
        finalPrice: finalPrice,
        discount: orderData.discount || 0,
        
        // Status & Metadata
        status: "Pending",
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        
        // Additional Info
        notes: orderData.notes || '',
        deadline: orderData.deadline || 'standard'
      };

      await addDoc(collection(db, "orders"), orderDataToSave);

      // Mark discount as used if user used it
      if (user && orderData.discount) {
        await updateDoc(doc(db, "users", user.uid), {
          hasUsedDiscount: true
        });
      }

      setShowPopup(true);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Terjadi kesalahan saat menyimpan order");
    } finally {
      setLoading(false);
    }
  };

  const generateWhatsAppMessage = () => {
    const message = `
📌 *ZanStein Solution - Order Baru*
 Nama: ${orderData.customerName || 'Guest'}
 WhatsApp: ${orderData.whatsappNumber}
 Jenis Proyek: ${getProjectTypeName(orderData.projectType)}
 Platform: ${orderData.platform || '-'}
 Aplikasi: ${orderData.projectName || '-'}

🔧 *Detail Teknologi:*
${orderData.developmentMethod === 'fullstack' ? `
*Fullstack Framework:* ${orderData.fullstackChoice?.framework || '-'}
*Database:* ${orderData.fullstackChoice?.database || '-'}
` : `
*Frontend:* ${orderData.mixmatchChoice?.frontend || '-'}
*Backend:* ${orderData.mixmatchChoice?.backend || '-'}
*API:* ${orderData.mixmatchChoice?.api || '-'}
*Database:* ${orderData.mixmatchChoice?.database || '-'}
`}

 *Role:* ${orderData.roles?.join(', ') || '-'}
 *UI Framework:* ${orderData.uiFramework?.join(', ') || '-'}
 *Tema:* ${orderData.themeChoice?.mode || '-'} (${orderData.themeChoice?.style || '-'})
 *Notifikasi:* ${orderData.notificationType || '-'}

 *Total Harga:* Rp ${finalPrice.toLocaleString()}
${orderData.discount ? `🎁 *Diskon:* ${orderData.discount}%` : ''}
 *Pembayaran via:* ${orderData.paymentMethod || 'Belum dipilih'}

    `;

    return message;
  };

  const getProjectTypeName = (type: string) => {
    switch (type) {
      case 'A': return 'Tugas Sekolah Harian';
      case 'B': return 'Uji Kompetensi (Ujikom)';
      case 'C': return 'Sidang PKL';
      case 'D': return 'Pengembangan Web/Aplikasi Profesional';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary text-center">
        Finalisasi Order
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white mb-2">Nama Lengkap</label>
          <input
            type="text"
            value={orderData.customerName}
            onChange={(e) => updateOrderData({ customerName: e.target.value })}
            className="w-full p-2 bg-black border border-gray-600 rounded-lg text-white"
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-2">Nomor WhatsApp</label>
          <input
            type="tel"
            value={orderData.whatsappNumber}
            onChange={(e) => updateOrderData({ whatsappNumber: e.target.value })}
            className="w-full p-2 bg-black border border-gray-600 rounded-lg text-white"
            placeholder="Contoh: 08123456789"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-2">Metode Pembayaran</label>
          <select
            value={orderData.paymentMethod}
            onChange={(e) => updateOrderData({ paymentMethod: e.target.value as any })}
            className="w-full p-2 bg-black border border-gray-600 rounded-lg text-white"
            required
          >
            <option value="">Pilih Metode Pembayaran</option>
            <option value="DANA">DANA</option>
            <option value="OVO">OVO</option>
            <option value="GOPAY">GOPAY</option>
          </select>
        </div>

        <div className="mt-6 p-4 bg-primary bg-opacity-10 border border-primary rounded-lg">
          <h3 className="text-lg font-medium text-white text-center">Total Harga</h3>
          {orderData.discount ? (
            <>
              <p className="text-lg text-gray-400 line-through text-center">
                Rp {totalPriceBeforeDiscount.toLocaleString()}
              </p>
              <p className="text-2xl font-bold text-primary text-center">
                Rp {finalPrice.toLocaleString()}
              </p>
              <p className="text-sm text-green-500 text-center">
                Hemat {orderData.discount}% (Rp {(totalPriceBeforeDiscount * orderData.discount/100).toLocaleString()})
              </p>
            </>
          ) : (
            <p className="text-2xl font-bold text-primary text-center">
              Rp {totalPriceBeforeDiscount.toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg"
          >
            Kembali
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Kirim Order"}
          </button>
        </div>
      </form>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-2xl font-bold text-primary">🎉 Order Berhasil!</h2>
            <p className="mt-2 text-gray-600">Order Anda telah tersimpan.</p>
            <p className="text-sm text-gray-500">Silakan kirim detail order ke WhatsApp admin.</p>
            <button
              onClick={() => {
                window.open(`https://wa.me/6285693531495?text=${encodeURIComponent(generateWhatsAppMessage())}`, "_blank");
                setShowPopup(false);
              }}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg w-full"
            >
              Kirim ke WhatsApp
            </button>
            <button 
              onClick={() => setShowPopup(false)} 
              className="mt-2 text-gray-600 block w-full"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4;
