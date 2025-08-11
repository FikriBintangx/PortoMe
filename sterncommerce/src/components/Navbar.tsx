"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          CosmiCoffee
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>
          <Link href="/products" className="text-gray-600 hover:text-gray-800">
            Menu
          </Link>
          <Link href="/cart" className="text-gray-600 hover:text-gray-800">
            Cart
          </Link>
          {!isLoading && session ? (
            <>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-gray-800"
              >
                Profile
              </Link>
              {(session.user as any)?.role === "admin" && (
                 <Link
                    href="/admin"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Admin
                  </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-gray-600 hover:text-gray-800">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
