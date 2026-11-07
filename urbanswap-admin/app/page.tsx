"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  "Laptops & Computers",
  "Phones & Tablets",
  "PC Components & Storage",
  "Monitors & TVs",
  "Audio Systems"
];

export default function AdminDashboard() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  
  // State for managing existing products
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch products when the page loads
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setProducts(data);
    setLoadingProducts(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Uploading image...");

    if (!imageFile) {
      setStatus("Error: Please select an image.");
      return;
    }

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, imageFile);

    if (uploadError) {
      setStatus(`Image Upload Error: ${uploadError.message}`);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    setStatus("Saving item details...");

    const { error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          price: parseFloat(price),
          category,
          image_url: publicUrl
        }
      ]);

    if (error) {
      setStatus(`Error: ${error.message}`);
    } else {
      setStatus("Item successfully added to marketplace!");
      setName("");
      setDescription("");
      setPrice("");
      setImageFile(null);
      const fileInput = document.getElementById('imageInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchProducts(); // Refresh the list after upload
    }
  };

  const handleDelete = async (id: any, imageUrl: string) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this item?");
    if (!confirmDelete) return;

    // 1. Delete image from storage
    try {
      if (imageUrl) {
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        await supabase.storage.from("images").remove([fileName]);
      }
    } catch (err) {
      console.error("Could not delete image from storage", err);
    }

    // 2. Delete item from database
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert(`Error deleting item: ${error.message}`);
    } else {
      // Update UI immediately
      setProducts(products.filter(product => product.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans flex flex-col items-center relative">
      <div className="absolute top-8 left-8">
        <h1 className="text-2xl font-extrabold text-blue-600">PulseImports Admin</h1>
        <p className="text-sm text-gray-500 mt-1">Marketplace Dashboard</p>
      </div>

      {/* Upload Form Section */}
      <div className="max-w-2xl w-full bg-white p-10 rounded-3xl shadow-sm mt-20 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Upload New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Item Name</label>
            <input
              type="text"
              required
              className="w-full p-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              required
              rows={3}
              className="w-full p-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (KES)</label>
              <input
                type="number"
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select
                className="w-full p-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Select Image</label>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              required
              className="w-full p-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl outline-none cursor-pointer"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition mt-4 shadow-md"
          >
            Upload Item
          </button>
        </form>

        {status && (
          <div className={`mt-6 p-4 rounded-xl text-center font-bold ${status.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {status}
          </div>
        )}
      </div>

      {/* Database Management Section */}
      <div className="max-w-4xl w-full bg-white p-10 rounded-3xl shadow-sm mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Manage Database Items</h2>
        
        {loadingProducts ? (
          <div className="text-gray-500 text-center py-4">Loading items...</div>
        ) : products.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No items currently in the marketplace.</div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-xs text-gray-400">No Img</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.category} | KES {product.price?.toLocaleString()}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(product.id, product.image_url)}
                  className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-lg font-bold text-sm transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}