"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../../lib/firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
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
      await updateDoc(orderRef, { orderStatus: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Gagal mengupdate status:", error);
    }
  };

  // 🔹 Filter Order Berdasarkan Status
  const filteredOrders =
    filterStatus === "Semua"
      ? orders
      : orders.filter((order) => order.orderStatus === filterStatus);

  if (!isAdmin) return <p className="text-center text-red-500">Akses Ditolak!</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-black border border-primary rounded-lg">
      <h2 className="text-2xl font-bold text-primary text-center">📊 Dashboard Admin</h2>

      <button onClick={handleLogout} className="mt-4 p-2 bg-red-500 text-white rounded-lg">
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
        </select>
      </div>

      <h3 className="mt-6 text-xl text-primary">📌 Daftar Orderan</h3>
      {loading ? (
        <p className="text-gray-400">Memuat data...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-gray-400">Tidak ada order dengan status {filterStatus}.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {filteredOrders.map((order) => (
            <li key={order.id} className="p-4 border border-gray-600 rounded-lg">
              <p className="text-white font-bold">👤 {order.customerName}</p>
              <p className="text-gray-400">📱 {order.phoneNumber}</p>
              <p className="text-gray-400">🛠️ {order.projectType}</p>
              <p className="text-gray-400">💰 {order.paymentMethod}</p>
              <p className="text-gray-400">💻 {order.platform}</p>
              <p className="text-gray-400">🔗 {order.referenceLink || "Tidak ada"}</p>
              <p className="text-gray-400">📅 {new Date(order.orderDate?.seconds * 1000).toLocaleDateString()}</p>

              {/* 🔹 Status Order */}
              <div className="mt-3">
                <p className="text-green-400">✅ Status: {order.orderStatus}</p>
                <select
                  className="w-full p-2 mt-2 border rounded-lg bg-black text-white border-gray-500"
                  value={order.orderStatus}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
