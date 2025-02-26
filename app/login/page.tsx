"use client";

import { auth, googleProvider } from "../../lib/firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      router.push("/newuser");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const loginWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/newuser");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-black border border-primary rounded-lg">
      <h2 className="text-2xl font-bold text-primary text-center">Login</h2>
      <form onSubmit={loginWithEmail} className="mt-4 space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-lg bg-black text-white border-primary"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-lg bg-black text-white border-primary"
          required
        />
        <button type="submit" className="w-full p-2 bg-primary text-white rounded-lg">
          Login
        </button>
      </form>
      <button
        onClick={loginWithGoogle}
        className="mt-4 w-full p-2 bg-blue-500 text-white rounded-lg"
      >
        Login dengan Google
      </button>
    </div>
  );
}
