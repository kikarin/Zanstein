"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../../lib/firebaseConfig";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Semua");

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().role === "admin") {
          setIsAdmin(true);
          fetchOrders();
        } else {
          router.push("/adminzan");
        }
      } else {
        router.push("/adminzan");
      }
    };

    checkAdmin();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const ordersRef = collection(db, "orders");
    const querySnapshot = await getDocs(ordersRef);
    const ordersList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setOrders(ordersList);
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/adminzan");
  };

  // 🔹 Update Status Order
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        lastUpdated: serverTimestamp(),
      });

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal mengupdate status order");
    }
  };

  // 🔹 Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Anda yakin ingin menghapus order ini?")) return;

    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Gagal menghapus order");
    }
  };

  // 🔹 Filter Order Berdasarkan Status
  const filteredOrders =
    filterStatus === "Semua"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  if (!isAdmin)
    return <p className="text-center text-red-500">Akses Ditolak!</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-black border border-primary rounded-lg">
      <h2 className="text-2xl font-bold text-primary text-center">
        📊 Dashboard Admin
      </h2>

      <button
        onClick={handleLogout}
        className="mt-4 p-2 bg-red-500 text-white rounded-lg"
      >
        Logout
      </button>

      {/* 🔹 Filter Status */}
      <div className="mt-6">
        <label className="text-white">Filter Status:</label>
        <select
          className="w-full p-2 mt-2 border rounded-lg bg-black text-white border-gray-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="Semua">Semua</option>
          <option value="Pending">Pending</option>
          <option value="Diproses">Diproses</option>
          <option value="Selesai">Selesai</option>
          <option value="Dibatalkan">Dibatalkan</option>
        </select>
      </div>

      <h3 className="mt-6 text-xl text-primary">📌 Daftar Orderan</h3>
      {loading ? (
        <p className="text-gray-400">Memuat data...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-gray-400">
          Tidak ada order dengan status {filterStatus}.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {filteredOrders.map((order) => (
            <li
              key={order.id}
              className="p-4 border border-gray-600 rounded-lg"
            >
              {/* Customer Info */}
              <div className="mb-4">
                <h4 className="text-lg font-bold text-primary">
                  Informasi Pelanggan
                </h4>
                <p className="text-white">👤 Nama: {order.customerName || "N/A"}</p>
                <p className="text-gray-400">
                  📱 WhatsApp: {order.whatsappNumber || "N/A"}
                </p>
                <p className="text-gray-400">
                  💳 Pembayaran: {order.paymentMethod || "N/A"}
                </p>
              </div>

              {/* Project Details */}
              <div className="mb-4">
                <h4 className="text-lg font-bold text-primary">
                  Detail Proyek
                </h4>
                <p className="text-gray-400">📌 Tipe: {order.projectType || "N/A"}</p>
                <p className="text-gray-400">📝 Nama: {order.projectName || "N/A"}</p>
                <p className="text-gray-400">💻 Platform: {order.platform || "N/A"}</p>
                <p className="text-gray-400">
                  🔧 Jenis: {order.applicationType || "N/A"}
                </p>
                <p className="text-gray-400">
                  🔗 Referensi: {order.referenceLink || "Tidak ada"}
                </p>
              </div>

              {/* Development Details */}
              <div className="mb-4">
                <h4 className="text-lg font-bold text-primary">
                  Detail Pengembangan
                </h4>
                <p className="text-gray-400">
                  ⚙️ Metode: {order.developmentMethod}
                </p>

                {order.developmentMethod === "fullstack" &&
                  order.fullstackChoice && (
                    <>
                      <p className="text-gray-400">
                        🛠️ Framework: {order.fullstackChoice.framework}
                      </p>
                      <p className="text-gray-400">
                        📦 Database: {order.fullstackChoice.database}
                      </p>
                    </>
                  )}

                {order.developmentMethod === "mixmatch" &&
                  order.mixmatchChoice && (
                    <>
                      <p className="text-gray-400">
                        🎨 Frontend: {order.mixmatchChoice.frontend}
                      </p>
                      <p className="text-gray-400">
                        ⚙️ Backend: {order.mixmatchChoice.backend}
                      </p>
                      <p className="text-gray-400">
                        🔌 API: {order.mixmatchChoice.api}
                      </p>
                      <p className="text-gray-400">
                        📦 Database: {order.mixmatchChoice.database}
                      </p>
                    </>
                  )}
              </div>

              {/* UI/UX Details */}
              <div className="mb-4">
                <h4 className="text-lg font-bold text-primary">Detail UI/UX</h4>
                <p className="text-gray-400">
                  👥 Roles: {order.roles?.join(", ") || "Tidak ada"}
                </p>
                <p className="text-gray-400">
                  🎨 UI Framework: {order.uiFramework?.join(", ") || "Default"}
                </p>
                <p className="text-gray-400">
                  🎭 Theme: {order.themeChoice?.mode || "Default"}
                </p>
                <p className="text-gray-400">
                  🔔 Notifikasi: {order.notificationType || "Default"}
                </p>
                {order.customColors?.colors?.length > 0 && (
                  <p className="text-gray-400">
                    🎨 Custom Colors: {order.customColors.colors.join(", ")}
                  </p>
                )}
              </div>

              {/* Pricing */}
              <div className="mb-4">
                <h4 className="text-lg font-bold text-primary">Harga</h4>
                <p className="text-gray-400">
                  💰 Harga Asli: Rp {order.originalPrice?.toLocaleString() || "0"}
                </p>
                {order.discount > 0 && (
                  <p className="text-green-500">🎉 Diskon: {order.discount}%</p>
                )}
                <p className="text-white font-bold">
                  💵 Total: Rp {order.finalPrice?.toLocaleString() || "0"}
                </p>
              </div>

              {/* Additional Info */}
              <div className="mb-4">
                <h4 className="text-lg font-bold text-primary">
                  Info Tambahan
                </h4>
                <p className="text-gray-400">⏰ Deadline: {order.deadline}</p>
                <p className="text-gray-400">
                  📝 Catatan: {order.notes || "Tidak ada"}
                </p>
                <p className="text-gray-400">
                  📅 Dibuat:{" "}
                  {new Date(order.createdAt?.seconds * 1000).toLocaleString()}
                </p>
              </div>

              {/* Status & Actions */}
              <div className="mt-4 space-y-2">
                <h4 className="text-lg font-bold text-primary">
                  Status & Tindakan
                </h4>
                <div className="flex items-center space-x-4">
                <select
                    className="flex-1 p-2 border rounded-lg bg-black text-white border-gray-500"
                    value={order.status || "Pending"}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                >
                  <option value="Pending">Pending</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
