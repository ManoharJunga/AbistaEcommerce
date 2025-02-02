"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ProductGallery } from "@/components/product-gallery";
import { ProductDetails } from "@/components/product-details";
import { SimilarProducts } from "@/components/similar-products";
import Header from "@/components/Header";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    name: string;
    image: string;
  };
  subCategory: {
    name: string;
    image: string;
  };
  images: string[];
  height?: string;
  width?: string;
  quantity?: string;
}

export default function ProductPage() {
  const pathname = usePathname();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const pathSegments = pathname.split("/");
    const productId = pathSegments[pathSegments.length - 1];

    if (!productId) {
      setError("Invalid product ID");
      return;
    }

    const fetchProduct = async () => {
      try {
        console.log(`Fetching product details for ID: ${productId}`);
        const response = await fetch(`http://localhost:8000/api/products/${productId}`);

        if (!response.ok) throw new Error("Failed to fetch product details");

        const data = await response.json();
        console.log("Fetched product:", data);

        setProduct(data);
      } catch (err) {
        setError("Error fetching product details");
        console.error(err);
      }
    };

    fetchProduct();
  }, [pathname]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">{product.name}</h1>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery images={product.images.length > 0 ? product.images : ["/placeholder.svg"]} />
          <ProductDetails
            title={product.name}
            description={product.description}
            price={product.price}
            height={product.height || "N/A"}
            width={product.width || "N/A"}
            quantity={product.quantity || "1 pc"}
          />
        </div>

        <SimilarProducts products={[]} />
      </main>
    </div>
  );
}
