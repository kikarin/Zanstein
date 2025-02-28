"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-black text-white p-4 border-b border-primary">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1
          className="text-xl font-bold text-primary cursor-pointer"
          onClick={() => router.push("/")}
        >
          ZanStein Solution
        </h1>
        <ul className="flex space-x-6 items-center">
          <li>
            <button
              onClick={() => router.push("/")}
              className="text-lg hover:text-primary transition duration-300"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push("/order")}
              className="text-lg hover:text-primary transition duration-300"
            >
              Order
            </button>
          </li>
          <li className="relative" ref={dropdownRef}>
            {user ? (
              <div className="flex items-center space-x-3">
                <div
                  className="relative cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <Image
                    src={user.photoURL || "/default-avatar.png"}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full border border-white hover:opacity-80 transition duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/default-avatar.png";
                    }}
                  />
                </div>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-48 w-48 bg-white text-black shadow-lg rounded-md overflow-hidden z-50">
                    <button
                      className="block px-4 py-2 text-left hover:bg-gray-200 w-full transition duration-300"
                      onClick={() => router.push("/profile")}
                    >
                      My Profile
                    </button>
                    <button
                      className="block px-4 py-2 text-left hover:bg-gray-200 w-full transition duration-300"
                      onClick={() => router.push("/voucher")}
                    >
                      My Voucher
                    </button>
                    <button
                      className="block px-4 py-2 text-left hover:bg-gray-200 w-full transition duration-300"
                      onClick={() => router.push("/my-orders")}
                    >
                      Pesanan
                    </button>
                    <button
                      className="block px-4 py-2 text-left hover:bg-red-500 hover:text-white w-full transition duration-300"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="text-lg hover:text-primary transition duration-300"
              >
                Login
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
