import { NoticeBar } from "@/components/notice-bar"
import { DoorShowcase } from "@/components/doors/door-showcase"
import { DoorCategories } from "@/components/doors/door-categories"
import { DoorFeatures } from "@/components/doors/door-features"
import Header from "@/components/Header"
import { DoorsSliding } from "@/components/doors/doors-sliding"

export default function DoorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NoticeBar />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#FF8000] mb-12">Doors</h1>
        <DoorsSliding />
        <DoorShowcase />
        <DoorCategories />
        <DoorFeatures />
      </main>
    </div>
  )
}

