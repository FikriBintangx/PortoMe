"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IProduct } from "@/models/Product";
import { useCart } from "@/context/CartContext";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/products/${id}`);
          if (!res.ok) {
            throw new Error("Product not found");
          }
          const data = await res.json();
          setProduct(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.name} (x${quantity}) added to cart!`);
    }
  };

  if (isLoading) {
    return <p>Loading product...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-12 items-start">
      <div className="relative w-full h-96">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <div>
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-2xl font-semibold text-blue-600 mb-6">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-gray-700 mb-6">{product.description}</p>
        <div className="flex items-center gap-4 mb-6">
          <label htmlFor="quantity" className="font-semibold">
            Quantity:
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            className="w-20 border border-gray-300 rounded-md p-2 text-center"
          />
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
