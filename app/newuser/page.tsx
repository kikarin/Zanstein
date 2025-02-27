"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { updateProfile } from "firebase/auth";
import Image from "next/image";

export default function NewUserPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  // Memastikan state diupdate ketika user data tersedia
  useEffect(() => {
    if (user) {
      setUsername(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      // Update displayName dan photoURL di Firebase Auth
      await updateProfile(user, {
        displayName: username,
        photoURL: photoURL // Memastikan photoURL tersimpan
      });

      // Simpan data user ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        displayName: username,
        photoURL: photoURL, // Menggunakan photoURL yang sudah diverifikasi
        email: user.email,
        updatedAt: new Date()
      });

      router.push("/");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-black border border-primary rounded-lg">
      <h2 className="text-2xl font-bold text-primary text-center">Lengkapi Profil</h2>
      <div className="flex flex-col items-center mt-4">
        {photoURL ? (
          // Menggunakan next/image untuk optimasi
          <Image
            src={photoURL}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full border border-primary"
            unoptimized // Penting untuk URL eksternal dari Google
          />
        ) : (
          <div className="w-20 h-20 rounded-full border border-primary bg-gray-700 flex items-center justify-center">
            <span className="text-2xl text-white">{username.charAt(0)}</span>
          </div>
        )}
      </div>
      <label className="block mt-4">Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mt-2 border rounded-lg bg-black text-white border-primary"
      />
      <button onClick={handleSaveProfile} className="mt-4 w-full p-2 bg-primary text-white rounded-lg">
        Simpan
      </button>
    </div>
  );
}