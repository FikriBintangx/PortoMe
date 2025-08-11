"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  user: {
    name: string;
  };
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  orderDate: string;
}

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    const promise = fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
    }).then(res => {
        if (!res.ok) throw new Error('Failed to update order status');
        return res.json();
    });

    toast.promise(promise, {
        loading: 'Updating status...',
        success: () => {
            fetchOrders(); // Refresh the list
            return <b>Status updated!</b>;
        },
        error: <b>Could not update status.</b>,
    });
  };

  if (isLoading) return <p>Loading orders...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-2 px-4">Order ID</th>
              <th className="text-left py-2 px-4">Customer</th>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">Total</th>
              <th className="text-left py-2 px-4">Status</th>
              <th className="text-left py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="py-2 px-4 font-mono text-sm">{order._id}</td>
                <td className="py-2 px-4">{order.user?.name || "N/A"}</td>
                <td className="py-2 px-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="py-2 px-4">${order.totalPrice.toFixed(2)}</td>
                <td className="py-2 px-4">
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value as Order['status'])}
                        className={`p-1 rounded-md ${
                            order.status === 'completed' ? 'bg-green-200 text-green-800' :
                            order.status === 'cancelled' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                        }`}
                    >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </td>
                <td className="py-2 px-4">
                  <Link href={`/profile/orders/${order._id}`} className="text-blue-500 hover:underline">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
