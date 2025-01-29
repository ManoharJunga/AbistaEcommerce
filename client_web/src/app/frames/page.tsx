import { NoticeBar } from "@/components/notice-bar"
import { FrameShowcase } from "@/components/frames/frame-showcase"
import { WPCProducts } from "@/components/frames/wpc-products"
import { FrameFeatures } from "@/components/frames/frame-features"
import Header from "@/components/Header"

export default function FramesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NoticeBar />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#FF8000] mb-12">Frames</h1>
        <FrameShowcase />
        <WPCProducts />
        <FrameFeatures />
      </main>
    </div>
  )
}
