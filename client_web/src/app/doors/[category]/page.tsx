"use client";

import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { ProductFilters } from "@/components/doors-products/product-filters";
import ProductGrid from "@/components/doors-products/product-grid";





export default function DoorsProductPage() {

  return (
    <div>
      <Header />

      <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <ProductFilters />
        <ProductGrid />
      </div>
    </div>
  );
}
