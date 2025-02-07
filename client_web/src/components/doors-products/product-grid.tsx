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
    const router = useRouter();
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
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 md:px-10 py-6">
            {products.map((product, index) => (
                <div
                    key={product._id}
                    className="bg-white overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => router.push(`/doors/preview/${product._id}`)}
                >
                    {/* Image Container */}
                    <div className="aspect-[7/10] relative flex justify-center items-center">
                        {product.images.length > 0 ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="object-cover h-full transition-transform duration-300 "
                                style={{
                                    transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                                }}
                            />
                        ) : (
                            <div className="text-gray-500 text-sm">No Image Available</div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="p-5">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                            <span className="bg-[#FFE4C4] text-[#8B4513] px-3 py-1 rounded text-sm">
                                {product.subCategory?.name}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {product.description}
                        </p>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-900 font-semibold">₹{product.price} / sqft</span>
                            <button className="text-[#FF8000] hover:text-[#FF6505] font-medium transition-colors">
                                View Product &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
