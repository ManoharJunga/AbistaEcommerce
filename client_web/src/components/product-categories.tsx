import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type Category = {
  name: string;
  image: string;
};

export function ProductCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch categories data from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }
        const data: Category[] = await response.json();
        setCategories(data); // Store fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false); // Done loading
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or loading indicator
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {categories.map((category, index) => (
          <Link key={index} href="/doors">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="aspect-square relative mb-4">
                  {/* Image with fallback if not available */}
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
