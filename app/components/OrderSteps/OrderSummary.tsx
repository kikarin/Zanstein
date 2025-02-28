"use client";

import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";

const OrderSummary = ({ orderData, prevStep }: any) => {
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary text-center">📝 Ringkasan Order</h2>

      <div className="mt-4 p-4 border border-gray-700 rounded-lg text-white">
        <p><strong>📌 Jenis Proyek:</strong> {orderData.projectType}</p>
        <p><strong>💻 Platform:</strong> {orderData.platform}</p>
        <p><strong>📌 Nama Aplikasi:</strong> {orderData.appName}</p>
        <p><strong>🔗 Link Referensi:</strong> {orderData.referenceLink || "Tidak ada"}</p>
        <p><strong>⚙️ Stack Teknologi:</strong> {orderData.stackChoice}</p>
        <p><strong>🛠️ Frontend:</strong> {orderData.frontend || "Tidak ada"}</p>
        <p><strong>🖥️ Backend:</strong> {orderData.backend || "Tidak ada"}</p>
        <p><strong>📂 Database:</strong> {orderData.database || "Tidak ada"}</p>
        <p><strong>🧑‍💻 Role Sistem:</strong> {orderData.roles.join(", ") || "Tidak ada"}</p>
        <p><strong>🎨 UI Framework:</strong> {orderData.uiFramework || "Default"}</p>
        <p><strong>🎭 Tema UI:</strong> {orderData.theme}</p>
        <p><strong>🔔 Notifikasi:</strong> {orderData.notificationType}</p>
        <p><strong>🎨 Warna Custom:</strong> {orderData.customColors.join(", ") || "Default"}</p>
        <p><strong>⏳ Deadline:</strong> {orderData.deadline}</p>
        <p><strong>💰 Total Harga:</strong> Rp{orderData.totalPrice.toLocaleString()}</p>
        <p><strong>🎁 Diskon:</strong> {orderData.discount}%</p>
        <p><strong>💳 Metode Pembayaran:</strong> {orderData.paymentMethod}</p>
        <p><strong>📅 Tanggal Order:</strong> Akan Disimpan Otomatis</p>
        <p><strong>✅ Status Order:</strong> Pending</p>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="p-2 bg-gray-700 text-white rounded-lg">
          Kembali
        </button>
        <button onClick={saveOrderToFirestore} className="p-2 bg-green-500 text-white rounded-lg">
          Konfirmasi & Simpan Pesanan
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
