"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  _id: string;
  totalPrice: number;
  status: string;
  orderDate: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
    }

    if (status === "authenticated") {
      const fetchOrders = async () => {
        try {
          const res = await fetch("/api/orders");
          if (!res.ok) {
            throw new Error("Failed to fetch orders");
          }
          const data = await res.json();
          setOrders(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return <p>Loading your profile...</p>;
  }

  if (!session) {
    return null; // Should be redirected by the useEffect
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Hello, {session.user?.name}</h1>
      <h2 className="text-2xl font-semibold mb-6">Your Order History</h2>
      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Order ID</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-right">Total</th>
                <th className="py-2 px-4 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="py-2 px-4 border-b font-mono text-sm">{order._id}</td>
                  <td className="py-2 px-4 border-b">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b capitalize">{order.status}</td>
                  <td className="py-2 px-4 border-b text-right">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <Link href={`/profile/orders/${order._id}`} className="text-blue-500 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>You have not placed any orders yet.</p>
      )}
    </div>
  );
}
