"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Connect to your Supabase database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  "All",
  "Laptops & Computers",
  "Phones & Tablets",
  "PC Components & Storage",
  "Monitors & TVs",
  "Audio Systems"
];

// Define the shape of a Product
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen font-sans bg-white text-gray-800 flex flex-col">
      
      {/* Main Header - Grey Background */}
      <header className="bg-gray-100 py-4 md:py-6 px-4 md:px-8 flex items-center justify-between border-b border-gray-200">
        
        {/* Logo */}
        <div className="flex items-center cursor-pointer">
          <div className="text-2xl md:text-3xl font-extrabold text-gray-700 tracking-tight">
            PulseImports<span className="text-gray-400 font-normal">.ke</span>
          </div>
        </div>

        {/* Cart Button */}
        <div className="flex items-center">
          <div className="flex items-center gap-2 bg-[#5282a1] text-white px-3 py-2 md:px-4 rounded-sm font-semibold cursor-pointer hover:bg-[#3f6782] transition text-sm shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span>Cart (0)</span>
          </div>
        </div>

      </header>

      {/* Categories & Search Section - A Bit Dark Grey Background */}
      <section className="bg-gray-200 w-full px-4 sm:px-8 py-6 border-b border-gray-300">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Shopping categories list</h1>

          {/* Pill-shaped Categories */}
          <div className="mb-6 flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            <span className="py-2 text-sm font-bold text-gray-700 whitespace-nowrap mr-2">Categories</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 text-sm font-semibold whitespace-nowrap rounded-full transition-colors border bg-white ${
                  activeCategory === category
                    ? "border-orange-400 text-orange-500 bg-orange-50" 
                    : "border-gray-300 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="w-full flex bg-white border border-gray-300 rounded-sm overflow-hidden focus-within:border-orange-400 transition shadow-sm">
            <div className="flex items-center px-4 text-gray-400 bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder="Enter Item Name"
              className="w-full px-2 py-3 text-sm outline-none text-gray-700 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main Content Area - White Background */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-grow bg-white">
        
        <h2 className="text-lg font-bold text-gray-800 mb-4">Featured Items on PulseImports</h2>

        {/* Dynamic Hero Layout */}
        {!loading && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
            {/* Main Left Banner */}
            <div className="lg:col-span-2 bg-gray-50 rounded-sm border border-gray-100 overflow-hidden relative h-64 md:h-80 flex p-6 md:p-8 group cursor-pointer">
              <div className="z-10 w-3/5 md:w-1/2 flex flex-col justify-center">
                <span className="text-orange-500 text-xs md:text-sm font-bold mb-1 uppercase tracking-wider">Top Pick</span>
                <h2 className="text-2xl md:text-4xl font-black text-gray-800 leading-tight mb-2 line-clamp-2">{featuredProducts[0].name}</h2>
                <div className="text-lg md:text-xl font-bold text-gray-600 mb-6">KES {featuredProducts[0].price.toLocaleString()}</div>
                <button className="bg-orange-500 text-white font-bold px-6 py-2 w-max text-sm rounded-sm hover:bg-orange-600 transition shadow-sm">View Details</button>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-2/5 md:w-1/2 p-2 md:p-6">
                <img src={featuredProducts[0].image_url} alt={featuredProducts[0].name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>

            {/* Right Stacked Banners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:h-80">
              {featuredProducts.slice(1, 3).map((prod) => (
                <div key={prod.id} className="bg-gray-50 rounded-sm border border-gray-100 h-32 sm:h-48 lg:h-full flex flex-row items-center p-4 relative cursor-pointer group">
                  <div className="w-1/2 z-10 pr-2">
                    <span className="inline-block bg-white border border-orange-200 text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-sm mb-1">Recommended</span>
                    <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-orange-500 transition">{prod.name}</h3>
                  </div>
                  <div className="w-1/2 h-full absolute right-2 py-4">
                    <img src={prod.image_url} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-10 md:py-20 text-sm">Loading items...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-10 md:py-20 text-sm">No items found matching your search.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-gray-100 rounded-sm hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 relative group p-3 flex flex-col cursor-pointer">
                
                {/* Product Image */}
                <div className="h-32 md:h-40 w-full mb-3 relative flex items-center justify-center bg-gray-50/50 p-2 rounded-sm">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                    />
                  ) : (
                    <div className="text-gray-300 text-xs">No Image</div>
                  )}
                </div>

                {/* Product Info */}
                <div className="mt-auto">
                  <p className="text-[10px] text-gray-400 mb-1 truncate">{product.category}</p>
                  <h3 className="text-xs md:text-sm font-medium text-gray-800 group-hover:text-orange-500 mb-1 line-clamp-2 leading-tight transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Price Block */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm md:text-base font-bold text-gray-900">KES {product.price.toLocaleString()}</span>
                    {/* Add to Cart small icon */}
                    <div className="text-gray-300 group-hover:text-orange-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}