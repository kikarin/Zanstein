"use client";

import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { OrderData } from "../../../lib/types/order";

interface OrderSummaryProps {
  orderData: OrderData;
  isPreview?: boolean;
  prevStep?: () => void;
}

const OrderSummary = ({ orderData, isPreview, prevStep }: OrderSummaryProps) => {
  const router = useRouter();

  // 🔹 Cek apakah voucher sudah digunakan
  const checkVoucherUsage = async (voucherCode: string) => {
    if (!voucherCode) return false;
    try {
      const voucherRef = doc(db, "vouchers", voucherCode);
      const voucherSnap = await getDoc(voucherRef);
      return voucherSnap.exists() && voucherSnap.data().used;
    } catch (error) {
      console.error("Gagal memeriksa voucher:", error);
      return false;
    }
  };

  // 🔹 Simpan Order ke Firestore
  const saveOrderToFirestore = async () => {
    if (await checkVoucherUsage(orderData.voucherCode)) {
      alert("Voucher sudah digunakan dan tidak bisa digunakan lagi!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "orders"), {
        orderId: `ORD-${Date.now()}`,
        customerName: orderData.customerName,
        phoneNumber: orderData.phoneNumber,
        projectType: orderData.projectType,
        platform: orderData.platform,
        appName: orderData.appName,
        referenceLink: orderData.referenceLink || "Tidak ada",
        stackChoice: orderData.stackChoice,
        frontend: orderData.frontend || "Tidak ada",
        backend: orderData.backend || "Tidak ada",
        database: orderData.database || "Tidak ada",
        roles: orderData.roles || [],
        uiFramework: orderData.uiFramework || "Default",
        theme: orderData.theme,
        notificationType: orderData.notificationType,
        customColors: orderData.customColors || [],
        deadline: orderData.deadline,
        totalPrice: orderData.totalPrice,
        discount: orderData.discount || 0,
        voucherCode: orderData.voucherCode || null,
        paymentMethod: orderData.paymentMethod,
        orderDate: serverTimestamp(),
        orderStatus: "Pending",
      });

      if (orderData.voucherCode) {
        const voucherRef = doc(db, "vouchers", orderData.voucherCode);
        await updateDoc(voucherRef, { used: true });
      }

      console.log("Order berhasil disimpan:", docRef.id);
      alert("Pesanan berhasil disimpan!");
      router.push("/");
    } catch (error) {
      console.error("Gagal menyimpan order:", error);
      alert("Terjadi kesalahan saat menyimpan pesanan.");
    }
  };

  // Format array atau object untuk ditampilkan
  const formatArray = (arr: any[] | undefined) => {
    if (!arr || arr.length === 0) return "Tidak ada";
    return arr.join(", ");
  };

  const formatCustomColors = (colors: any) => {
    if (!colors) return "Default";
    if (Array.isArray(colors)) return colors.join(", ");
    if (colors.colors && Array.isArray(colors.colors)) return colors.colors.join(", ");
    return "Default";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary text-center">📝 Ringkasan Order</h2>

      <div className="mt-4 p-4 border border-gray-700 rounded-lg text-white">
        <p><strong>📌 Jenis Proyek:</strong> {orderData.projectType}</p>
        <p><strong>💻 Platform:</strong> {orderData.platform || "Belum dipilih"}</p>
        <p><strong>📌 Nama Aplikasi:</strong> {orderData.projectName || "Belum diisi"}</p>
        <p><strong>🔗 Link Referensi:</strong> {orderData.referenceLink || "Tidak ada"}</p>
        <p><strong>⚙️ Stack Teknologi:</strong> {orderData.developmentMethod || "Belum dipilih"}</p>
        
        {/* Tampilkan berdasarkan development method */}
        {orderData.developmentMethod === 'fullstack' ? (
          <>
            <p><strong>🛠️ Framework:</strong> {orderData.fullstackChoice?.framework || "Belum dipilih"}</p>
            <p><strong>📂 Database:</strong> {orderData.fullstackChoice?.database || "Belum dipilih"}</p>
          </>
        ) : (
          <>
            <p><strong>🛠️ Frontend:</strong> {orderData.mixmatchChoice?.frontend || "Belum dipilih"}</p>
            <p><strong>🖥️ Backend:</strong> {orderData.mixmatchChoice?.backend || "Belum dipilih"}</p>
            <p><strong>🔌 API:</strong> {orderData.mixmatchChoice?.api || "Belum dipilih"}</p>
            <p><strong>📂 Database:</strong> {orderData.mixmatchChoice?.database || "Belum dipilih"}</p>
          </>
        )}

        <p><strong>🧑‍💻 Role Sistem:</strong> {formatArray(orderData.roles)}</p>
        <p><strong>🎨 UI Framework:</strong> {formatArray(orderData.uiFramework)}</p>
        <p><strong>🎭 Tema UI:</strong> {orderData.themeChoice?.mode || "Default"}</p>
        <p><strong>🔔 Notifikasi:</strong> {orderData.notificationType || "Default"}</p>
        <p><strong>🎨 Warna Custom:</strong> {formatCustomColors(orderData.customColors)}</p>
        <p><strong>⏳ Deadline:</strong> {orderData.deadline || "Standard (30 hari)"}</p>
        <p><strong>💰 Total Harga:</strong> Rp {orderData.totalPrice?.toLocaleString() || "0"}</p>
        <p><strong>🎁 Diskon:</strong> {orderData.discount || 0}%</p>
        <p><strong>💳 Metode Pembayaran:</strong> {orderData.paymentMethod || "Belum dipilih"}</p>
        <p><strong>📝 Catatan:</strong> {orderData.notes || "Tidak ada"}</p>
      </div>

      {/* Tombol hanya ditampilkan jika bukan preview */}
      {!isPreview && prevStep && (
        <div className="flex justify-between mt-6">
          <button onClick={prevStep} className="p-2 bg-gray-700 text-white rounded-lg">
            Kembali
          </button>
          <button onClick={saveOrderToFirestore} className="p-2 bg-green-500 text-white rounded-lg">
            Konfirmasi & Simpan Pesanan
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
