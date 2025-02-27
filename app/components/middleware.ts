import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

export async function middleware(req: NextRequest) {
  const user = auth.currentUser;

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Cek apakah user adalah admin di Firestore
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists() || userSnap.data().role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Middleware hanya berlaku untuk halaman admin
export const config = {
  matcher: "/adminzan/:path*",
};
