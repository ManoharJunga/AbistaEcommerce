// /src/app/page.tsx

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/Header"; // Import the Header component
import Footer from "@/components/Footer"; // Import the Footer component
import { Hero } from "@/components/hero";
import { ProductCategories } from "@/components/product-categories";
import { ProjectsShowcase } from "@/components/projects-showcase";
import { LatestUpdates } from "@/components/latest-updates";
import { StatsSection } from "@/components/stats-section";
import { NoticeBar } from "@/components/notice-bar";

export default function Home() {
  return (
    <div className="min-h-screen" >
      <NoticeBar />
      <Header /> {/* Add Header here */}
      
      <main>
        <Hero />
        <ProductCategories />
        <ProjectsShowcase />
        <LatestUpdates />
        <StatsSection />
      </main>

      <Footer /> {/* Add Footer here */}
    </div>
  );
}
