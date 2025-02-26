"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="bg-black text-white p-4 border-b border-primary">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary cursor-pointer" onClick={() => router.push("/")}>
          ZanStein Solution
        </h1>
        <ul className="flex space-x-6">
          <li>
            <button onClick={() => router.push("/")} className="text-lg hover:text-primary">
              Home
            </button>
          </li>
          <li>
            <button onClick={() => router.push("/order")} className="text-lg hover:text-primary">
              Order
            </button>
          </li>
          {user && (
            <li>
              <button onClick={() => router.push("/voucher")} className="text-lg hover:text-primary flex items-center">
                🎟️ Voucher
              </button>
            </li>
          )}
          <li>
            {user ? (
              <button onClick={logout} className="text-lg hover:text-primary">Logout</button>
            ) : (
              <button onClick={() => router.push("/login")} className="text-lg hover:text-primary">Login</button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
