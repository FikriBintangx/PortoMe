import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/models/Product";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Menu - CosmiCoffee",
  description: "Browse our delicious selection of coffees and pastries.",
};

async function getProducts(): Promise<IProduct[]> {
  // In a real app, the base URL should be an environment variable
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    cache: "no-store", // Don't cache product list, always get the latest
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Our Menu</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products available at the moment. Please check back later.</p>
      )}
    </div>
  );
}
