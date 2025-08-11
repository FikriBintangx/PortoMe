"use client";

import { useState, useEffect } from "react";
import { IProduct } from "@/models/Product";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
}

const emptyProduct: Omit<IProduct, '_id' | 'category'> & { category: string } = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: "",
    category: "",
};

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(emptyProduct);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      setProducts(await res.json());
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const fetchCategories = async () => {
    try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        setCategories(await res.json());
    } catch (err: any) {
        toast.error(err.message);
    }
  }

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]).finally(() => setIsLoading(false));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `/api/products/${currentProduct._id}` : '/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    const promise = fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProduct),
    }).then(res => {
        if (!res.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} product`);
        return res.json();
    });

    toast.promise(promise, {
        loading: `${isEditing ? 'Updating' : 'Creating'} product...`,
        success: () => {
            resetForm();
            fetchProducts();
            return `Product ${isEditing ? 'updated' : 'created'}!`;
        },
        error: `Could not ${isEditing ? 'update' : 'create'} product.`,
    });
  };

  const handleEdit = (product: IProduct) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsEditing(true);
    setCurrentProduct({
        ...product,
        category: typeof product.category === 'object' ? product.category._id : product.category,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
        const promise = fetch(`/api/products/${id}`, { method: 'DELETE' }).then(res => {
            if(!res.ok) throw new Error('Failed to delete product');
        });

        toast.promise(promise, {
            loading: 'Deleting product...',
            success: () => {
                fetchProducts();
                return 'Product deleted.';
            },
            error: 'Could not delete product.',
        });
    }
  }

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProduct(emptyProduct);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg bg-white space-y-4">
        <h2 className="text-xl font-semibold">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        <input name="name" value={currentProduct.name} onChange={handleInputChange} placeholder="Name" required className="w-full p-2 border rounded"/>
        <textarea name="description" value={currentProduct.description} onChange={handleInputChange} placeholder="Description" required className="w-full p-2 border rounded"/>
        <input name="price" type="number" step="0.01" value={currentProduct.price} onChange={handleInputChange} placeholder="Price" required className="w-full p-2 border rounded"/>
        <input name="stock" type="number" value={currentProduct.stock} onChange={handleInputChange} placeholder="Stock" required className="w-full p-2 border rounded"/>
        <input name="image" value={currentProduct.image} onChange={handleInputChange} placeholder="Image URL" required className="w-full p-2 border rounded"/>
        <select name="category" value={currentProduct.category} onChange={handleInputChange} required className="w-full p-2 border rounded">
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
        <div className="flex gap-4">
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">{isEditing ? 'Update' : 'Create'}</button>
            {isEditing && <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400">Cancel</button>}
        </div>
      </form>

      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Category</th>
              <th className="text-left py-2">Price</th>
              <th className="text-left py-2">Stock</th>
              <th className="text-right py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod._id} className="border-t">
                <td className="py-2">{prod.name}</td>
                <td className="py-2">{(prod.category as Category)?.name || 'N/A'}</td>
                <td className="py-2">${prod.price.toFixed(2)}</td>
                <td className="py-2">{prod.stock}</td>
                <td className="py-2 text-right whitespace-nowrap">
                  <button onClick={() => handleEdit(prod)} className="text-blue-500 hover:underline mr-4">Edit</button>
                  <button onClick={() => handleDelete(prod._id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
