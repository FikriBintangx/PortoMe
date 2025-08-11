"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
}

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const promise = fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName }),
    }).then(res => {
        if (!res.ok) throw new Error("Failed to add category");
        return res.json();
    });

    toast.promise(promise, {
      loading: 'Adding category...',
      success: () => {
        setNewCategoryName("");
        fetchCategories(); // Refresh list
        return <b>Category added!</b>;
      },
      error: <b>Could not add category.</b>,
    });
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const promise = fetch(`/api/categories/${editingCategory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingCategory.name }),
    }).then(res => {
        if (!res.ok) throw new Error("Failed to update category");
        return res.json();
    });

    toast.promise(promise, {
        loading: 'Updating category...',
        success: () => {
            setEditingCategory(null);
            fetchCategories(); // Refresh list
            return <b>Category updated!</b>;
        },
        error: <b>Could not update category.</b>,
    });
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
        const promise = fetch(`/api/categories/${id}`, { method: "DELETE" }).then(res => {
            if (!res.ok) throw new Error("Failed to delete category");
        });

        toast.promise(promise, {
            loading: 'Deleting category...',
            success: () => {
                fetchCategories(); // Refresh list
                return <b>Category deleted.</b>;
            },
            error: <b>Could not delete category.</b>,
        });
    }
  };

  if (isLoading) return <p>Loading categories...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      <div className="mb-8 p-4 border rounded-lg bg-white">
        <h2 className="text-xl font-semibold mb-2">{editingCategory ? "Edit Category" : "Add New Category"}</h2>
        <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={editingCategory ? editingCategory.name : newCategoryName}
            onChange={(e) => editingCategory ? setEditingCategory({...editingCategory, name: e.target.value}) : setNewCategoryName(e.target.value)}
            placeholder="Category Name"
            className="flex-grow border rounded-md p-2"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            {editingCategory ? 'Update' : 'Add'}
          </button>
          {editingCategory && (
            <button type="button" onClick={() => setEditingCategory(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Name</th>
              <th className="text-right py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t">
                <td className="py-2">{cat.name}</td>
                <td className="py-2 text-right">
                  <button onClick={() => setEditingCategory(cat)} className="text-blue-500 hover:underline mr-4">Edit</button>
                  <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
