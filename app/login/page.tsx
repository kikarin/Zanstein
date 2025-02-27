"use client";

import { auth, googleProvider, db } from "../../lib/firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Menampilkan pesan error

  // 🔹 Cek Role User (Admin atau Biasa)
  const checkUserRole = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const role = userDoc.data().role || "user"; // Default "user" jika tidak ada role
        if (role === "admin") {
          router.push("/adminzan");
        } else {
          router.push("/");
        }
      } else {
        router.push("/newuser"); // Jika user baru, arahkan ke halaman pengisian profil
      }
    } catch (error) {
      console.error("Gagal mengecek role:", error);
    }
  };

  // 🔹 Login dengan Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await checkUserRole(result.user.uid);
    } catch (error) {
      console.error("Login gagal:", error);
      setError("Gagal login dengan Google. Silakan coba lagi.");
    }
  };

  // 🔹 Login dengan Email & Password
  const loginWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await checkUserRole(result.user.uid);
    } catch (error: any) {
      console.error("Login gagal:", error);
      if (error.code === "auth/invalid-credential") {
        setError("Email atau password salah. Silakan coba lagi.");
      } else if (error.code === "auth/user-not-found") {
        setError("Akun tidak ditemukan. Silakan daftar terlebih dahulu.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-black border border-primary rounded-lg">
      <h2 className="text-2xl font-bold text-primary text-center mb-4">
        Login
      </h2>

      {/* Form Login Email */}
      <form onSubmit={loginWithEmail} className="space-y-3">
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-lg bg-black text-white border-gray-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-lg bg-black text-white border-gray-500"
          required
        />
        <button type="submit" className="w-full p-2 bg-primary text-white rounded-lg">
          Login
        </button>
      </form>

      {/* Garis Pemisah */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-600"></div>
        <p className="mx-4 text-gray-400">atau</p>
        <div className="flex-1 border-t border-gray-600"></div>
      </div>

      {/* Login dengan Google */}
      <button
        onClick={loginWithGoogle}
        className="w-full p-2 flex items-center justify-center bg-blue-500 text-white rounded-lg"
      >
        <FaGoogle className="mr-2" /> Masuk dengan Google
      </button>

      <p className="text-center text-sm text-gray-400 mt-4">
        Belum punya akun?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}
