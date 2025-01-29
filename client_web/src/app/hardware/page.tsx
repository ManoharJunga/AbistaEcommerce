import { NoticeBar } from "@/components/notice-bar"
import { HardwareShowcase } from "@/components/hardware/hardware-showcase"
import { HardwareProducts } from "@/components/hardware/hardware-products"
import { HardwareFeatures } from "@/components/hardware/hardware-features"
import Header from "@/components/Header"

export default function HardwarePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NoticeBar />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-12">
          <span className="text-[#FF8000]">Hard</span>ware
        </h1>
        <HardwareShowcase />
        <HardwareProducts />
        <HardwareFeatures />
      </main>
    </div>
  )
}

