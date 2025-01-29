"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
  category: Category;
  image: string;
}

export function DoorShowcase() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/subcategories")
      .then((res) => res.json())
      .then((data: SubCategory[]) => {
        // Filter only subcategories under "Doors"
        const filteredData = data.filter((sub) => sub.category?.name === "Doors");
        setSubCategories(filteredData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching subcategories:", error);
        setError("Failed to load subcategories.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading subcategories...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-8">
        <span className="text-[#FF8000]">The Quality.</span>{" "}
        <span className="text-gray-600">Doors That Define Excellence.</span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {subCategories.length > 0 ? (
          subCategories.map((subCategory) => (
            <Link key={subCategory._id} href={`/doors/${subCategory._id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="aspect-square relative mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={subCategory.image || "/placeholder.svg"}
                      alt={subCategory.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{subCategory.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No doors available.</p>
        )}
      </div>
    </section>
  );
}
