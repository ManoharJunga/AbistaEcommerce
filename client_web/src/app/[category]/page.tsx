'use client'

import { NoticeBar } from "@/components/notice-bar"
import Header from "@/components/Header"
import { useParams } from "next/navigation"

// Import your reusable category components
import { DoorsSliding } from "@/components/doors/doors-sliding"
import { DoorShowcase } from "@/components/doors/door-showcase"
import { DoorCategories } from "@/components/doors/door-categories"
import { DoorFeatures } from "@/components/doors/door-features"

export default function CategoryPage() {
  const { category } = useParams();

  // Map categories to their components
  const categoryComponents: Record<string, JSX.Element> = {
    doors: (
      <>
        <DoorsSliding />
        <DoorShowcase />
        <DoorCategories />
        <DoorFeatures />
      </>
    ),
    hardware: (
      <>
        <h2 className="text-2xl font-semibold mb-4">Hardware Showcase</h2>
        {/* You can import hardware-specific components here */}
      </>
    ),
    // add more categories like "laminates", "frames", etc.
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NoticeBar />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#FF8000] mb-12 capitalize">
          {category}
        </h1>

        {categoryComponents[category as string] || (
          <p className="text-gray-500">No content available for this category yet.</p>
        )}
      </main>
    </div>
  );
}
