"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  pricePerItem: number;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  totalPrice: number;
  status: string;
  orderDate: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && id) {
      const fetchOrder = async () => {
        try {
          const res = await fetch(`/api/orders/${id}`);
          if (!res.ok) {
            throw new Error("Could not fetch order details.");
          }
          const data = await res.json();
          setOrder(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrder();
    } else if (status === "unauthenticated") {
        // Handle not logged in case
        setIsLoading(false);
        setError("You must be logged in to view this page.");
    }
  }, [id, status]);

  if (isLoading) {
    return <p>Loading order details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Order Details</h1>
      <p className="mb-6">
        Thank you for your order, {order.user.name}!
      </p>
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div><strong>Order ID:</strong> {order._id}</div>
            <div><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</div>
            <div><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</div>
            <div className="md:col-span-3"><strong>Status:</strong> <span className="font-semibold capitalize">{order.status}</span></div>
        </div>

        <h2 className="text-xl font-bold mb-4 border-t pt-4">Items</h2>
        <div className="space-y-4">
            {order.items.map(item => (
                <div key={item._id} className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                        <Image src={item.product.image || '/placeholder.svg'} alt={item.product.name} layout="fill" objectFit="cover" className="rounded-md" />
                    </div>
                    <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.pricePerItem.toFixed(2)}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
