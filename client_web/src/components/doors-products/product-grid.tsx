// pages/products/[subcategoryId].tsx

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    _id: string;
    name: string;
  };
  subCategory: {
    _id: string;
    name: string;
  };
  images: string[];
  averageRating: number;
  totalReviews: number;
  sizes: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductGrid() {
  const router = useRouter();
  const { subcategoryId } = router.query; // Access the dynamic parameter from the URL
  const [products, setProducts] = useState<Product[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!subcategoryId) return; // Wait until the subcategoryId is available

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/products/getBySubcategory?subcategory=${subcategoryId}`
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products); // Set products from the API response
      } catch (err) {
        setError("Error fetching products");
        console.error("Fetch Error:", err);
      }
    };

    fetchProducts();
  }, [subcategoryId]); // Re-fetch products when subcategoryId changes

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div
          key={product._id}
          className="bg-white rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="aspect-square relative">
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="object-cover transition-transform duration-300"
              style={{
                transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
              }}
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <span className="bg-[#FFE4C4] text-[#8B4513] px-3 py-1 rounded text-sm">
                {product.subCategory.name}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
            <button className="text-[#FF8000] hover:text-[#FF6505] p-0">
              View Product &gt;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
