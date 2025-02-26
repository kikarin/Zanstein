"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewUserPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState(user?.displayName || "");

  const handleSaveProfile = () => {
    console.log("Profil disimpan:", { username, avatar: user?.photoURL });
    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-black border border-primary rounded-lg">
      <h2 className="text-2xl font-bold text-primary text-center">Lengkapi Profil</h2>
      <div className="flex flex-col items-center mt-4">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt="Avatar"
          className="w-20 h-20 rounded-full border border-primary"
        />
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
``