"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc,
  Timestamp,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import Image from "next/image";

// Komponen Modal Pop-up
const Modal = ({ isOpen, onClose, discount }: { isOpen: boolean; onClose: () => void; discount: number | null }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-2xl font-bold text-primary">🎉 Selamat!</h2>
        <p className="mt-2 text-lg text-black">Anda mendapatkan diskon {discount}%!</p>
        <button onClick={onClose} className="mt-4 bg-primary text-white px-4 py-2 rounded-lg">
          Tutup
        </button>
      </div>
    </div>
  );
};

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  createdAt: Timestamp;
  photoURL?: string;
  userId?: string;
  adminReply?: {
    text: string;
    timestamp: Timestamp;
  };
}

const Testimonials = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState<number>(5); // Default 5 bintang
  const [discount, setDiscount] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false); // Untuk pop-up modal
  const [isAdmin, setIsAdmin] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "testimonials"));
        const fetchedTestimonials = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Testimonial[];

        setTestimonials(
          fetchedTestimonials.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
        );
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkUserDiscount = async () => {
      if (!user) return;
      const discountRef = doc(db, "discounts", user.uid);
      const discountSnap = await getDoc(discountRef);

      if (discountSnap.exists()) {
        setDiscount(discountSnap.data().discountPercentage);
      }
    };

    const checkAdminRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setIsAdmin(userDoc.exists() && userDoc.data().role === "admin");
      }
    };

    fetchTestimonials();
    if (user) {
      checkUserDiscount();
      checkAdminRole();
    }
  }, [user]);

  const getRandomDiscount = (): number => {
    const probabilities = [10, 10, 25, 25, 10, 10, 5, 2.5, 2, 0.5];
    const discountValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let random = Math.random() * 100;
    let cumulativeProbability = 0;

    for (let i = 0; i < probabilities.length; i++) {
      cumulativeProbability += probabilities[i];
      if (random < cumulativeProbability) {
        return discountValues[i];
      }
    }

    return 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return router.push("/login");

    try {
      const newTestimonial = {
        name: user.displayName || "Anonim",
        text: newComment,
        rating,
        createdAt: Timestamp.now(),
        photoURL: user.photoURL || "",
        userId: user.uid
      };

      const docRef = await addDoc(collection(db, "testimonials"), newTestimonial);
      setTestimonials([{ id: docRef.id, ...newTestimonial }, ...testimonials]);
      setNewComment("");
      setRating(5); // Reset rating setelah kirim

      const discountRef = doc(db, "discounts", user.uid);
      const discountSnap = await getDoc(discountRef);

      if (!discountSnap.exists()) {
        const randomDiscount = getRandomDiscount();
        await setDoc(discountRef, { discountPercentage: randomDiscount });
        setDiscount(randomDiscount);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error adding testimonial:", error);
    }
  };

  // Handle reply submission
  const handleReply = async (testimonialId: string) => {
    if (!replyText.trim()) return;

    try {
      const testimonialRef = doc(db, "testimonials", testimonialId);
      await updateDoc(testimonialRef, {
        adminReply: {
          text: replyText,
          timestamp: serverTimestamp()
        }
      });

      setReplyText("");
      setSelectedTestimonial(null);
      // Refresh testimonials
      fetchTestimonials();
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-primary text-center">Testimoni Klien</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-6 max-w-lg mx-auto p-4 bg-black border border-primary rounded-lg">
          <h3 className="text-lg font-semibold">Tambahkan Testimoni</h3>
          {/* Rating */}
          <div className="flex justify-center mt-2 space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-2xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-400"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          {/* Input Testimoni */}
          <textarea
            className="w-full p-2 mt-2 border rounded-lg bg-black text-white border-primary"
            placeholder="Bagikan pengalaman Anda..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          ></textarea>
          <button type="submit" className="mt-4 w-full p-2 bg-primary text-white rounded-lg">
            Kirim
          </button>
        </form>
      ) : (
        <div className="text-center mt-6">
          <p className="text-gray-400">Silakan login untuk memberikan testimoni.</p>
          <button onClick={() => router.push("/login")} className="mt-2 p-2 bg-primary text-white rounded-lg">
            Login
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-400">Memuat testimoni...</p>
      ) : (
        <div className="mt-6 space-y-6 max-w-3xl mx-auto">
          {testimonials.length > 0 ? (
            testimonials.map((t) => (
              <blockquote key={t.id} className="p-4 border border-gray-700 rounded-lg">
                <div className="flex items-center gap-4">
                  {t.photoURL ? (
                    <Image
                      src={t.photoURL}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                      unoptimized
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-white">{t.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <p>"{t.text}"</p>
                    <footer className="mt-2 font-bold">- {t.name}</footer>
                    <div className="flex mt-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < t.rating ? "text-yellow-400" : "text-gray-400"} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Admin Reply Section */}
                {t.adminReply && (
                  <div className="mt-4 pl-4 border-l-2 border-primary">
                    <p className="text-primary font-bold">Mimin Ganteng Reply:</p>
                    <p className="text-gray-400">{t.adminReply.text}</p>
                  </div>
                )}

                {/* Reply Button & Form (Only for Admin) */}
                {isAdmin && (
                  <div className="mt-4">
                    {selectedTestimonial === t.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full p-2 bg-black border border-gray-600 rounded-lg text-white"
                          placeholder="Write your reply..."
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleReply(t.id)}
                            className="px-4 py-2 bg-primary text-white rounded-lg"
                          >
                            Send Reply
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTestimonial(null);
                              setReplyText("");
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedTestimonial(t.id)}
                        className="text-primary hover:underline"
                      >
                        Reply to this testimonial
                      </button>
                    )}
                  </div>
                )}
              </blockquote>
            ))
          ) : (
            <p className="text-center text-gray-400">Belum ada testimoni.</p>
          )}
        </div>
      )}

      {/* Modal Pop-up untuk Diskon */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} discount={discount} />
    </section>
  );
};

export default Testimonials;
