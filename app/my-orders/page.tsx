    "use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebaseConfig";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function MyOrders() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;

    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: "Dibatalkan",
        lastUpdated: new Date()
      });

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: "Dibatalkan" }
          : order
      ));

      alert("Pesanan berhasil dibatalkan");
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Gagal membatalkan pesanan");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-500";
      case "Diproses":
        return "text-blue-500";
      case "Selesai":
        return "text-green-500";
      case "Dibatalkan":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-primary text-center mb-8">
        📦 Pesanan Saya
      </h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-400">
          Anda belum memiliki pesanan
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-700 rounded-lg p-6 space-y-4"
            >
              {/* Project Info */}
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  {order.projectName}
                </h3>
                <p className="text-gray-400">📱 Platform: {order.platform}</p>
                <p className="text-gray-400">
                  🔧 Tipe: {order.applicationType}
                </p>
              </div>

              {/* Development Info */}
              <div>
                <p className="text-gray-400">
                  ⚙️ Metode: {order.developmentMethod}
                </p>
                <p className="text-gray-400">
                  ⏰ Deadline: {order.deadline || "Standard"}
                </p>
              </div>

              {/* Price Info */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400">
                    💰 Total: Rp {order.finalPrice?.toLocaleString()}
                  </p>
                  {order.discount > 0 && (
                    <p className="text-green-500">
                      🎉 Diskon {order.discount}% diterapkan
                    </p>
                  )}
                </div>
                <div className={`${getStatusColor(order.status)}`}>
                  <p className="text-white">Status: </p><span className="font-bold">{order.status}</span>
                </div>
              </div>

              {/* Order Date */}
              <div className="text-sm text-gray-500">
                Dibuat: {new Date(order.createdAt?.seconds * 1000).toLocaleString()}
              </div>

              <div className="bg-zinc-500">
                  <p>note : pesanan tidak bisa di batalkan saat status sudah di proses</p>
                </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                {order.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Batalkan
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 