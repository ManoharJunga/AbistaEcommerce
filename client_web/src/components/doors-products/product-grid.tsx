"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: { _id: string; name: string };
    subCategory: { _id: string; name: string };
    images: string[];
    averageRating: number;
    totalReviews: number;
    sizes: string[];
    createdAt: string;
    updatedAt: string;
}

export default function ProductGrid() {
    const pathname = usePathname();
    const router = useRouter(); // ✅ Add this for navigation
    const [subcategoryId, setSubcategoryId] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const pathSegments = pathname.split("/");
        const id = pathSegments[pathSegments.length - 1];
        setSubcategoryId(id);
    }, [pathname]);

    useEffect(() => {
        if (!subcategoryId) return;

        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/products/getBySubcategory?subcategory=${subcategoryId}`
                );
                if (!response.ok) throw new Error("Failed to fetch products");

                const data = await response.json();
                setProducts(data.products);
            } catch (err) {
                setError("Error fetching products");
                console.error(err);
            }
        };

        fetchProducts();
    }, [subcategoryId]);

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-24 px-10">
            {products.map((product, index) => (
                <div
                    key={product._id}
                    className="bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => router.push(`/doors/preview/${product._id}`)} // ✅ Navigate to preview page
                >
                    <div className="aspect-[9/20] relative">
                        <img
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover w-full h-full transition-transform duration-300"
                            style={{
                                transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                            }}
                        />
                    </div>

                    <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <span className="bg-[#FFE4C4] text-[#8B4513] px-3 py-1 rounded text-sm">
                                {product.subCategory?.name}
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
