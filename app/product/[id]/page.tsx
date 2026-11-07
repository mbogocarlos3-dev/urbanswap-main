"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MarketplaceHome() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trending ads</h2>
        
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-bold">Loading items...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-md shadow-sm border border-gray-200">No items available.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link 
                href={`/product/${product.id}`} 
                key={product.id}
                className="block cursor-pointer bg-white rounded-md border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col h-full relative"
              >
                {/* Image Section */}
                <div className="h-48 bg-gray-100 relative flex items-center justify-center p-2">
                  
                  {/* Left Vertical Enterprise Badge */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-white border-r border-gray-200 flex items-center justify-center z-10">
                    <span className="text-[9px] font-bold text-[#00B53F] -rotate-90 tracking-widest whitespace-nowrap">
                      ENTERPRISE
                    </span>
                  </div>

                  {/* Top Right Verified Badge */}
                  <div className="absolute top-2 right-2 bg-white/95 text-blue-500 text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 z-10 border border-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified ID
                  </div>

                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-cover ml-6"
                    />
                  ) : (
                    <span className="text-gray-400 ml-6 text-sm">No Image</span>
                  )}
                </div>
                
                {/* Details Section */}
                <div className="p-3 flex flex-col flex-grow border-t border-gray-100">
                  <p className="text-[#00B53F] font-bold text-lg mb-1">
                    KSh {product.price.toLocaleString()}
                  </p>
                  <h3 className="text-gray-800 text-sm mb-1 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Location Pin */}
                  <div className="flex items-center text-gray-400 text-xs mt-auto pt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Nairobi
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 mt-3">
                    <span className="bg-gray-50 text-gray-600 text-[10px] px-2 py-1 rounded border border-gray-200">
                      Brand New
                    </span>
                    <span className="bg-gray-50 text-gray-600 text-[10px] px-2 py-1 rounded border border-gray-200 truncate max-w-[100px]">
                      {product.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}