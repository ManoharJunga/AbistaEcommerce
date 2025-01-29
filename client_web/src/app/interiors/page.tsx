import { NoticeBar } from "@/components/notice-bar"
import { InteriorShowcase } from "@/components/interiors/interior-showcase"
import { InteriorSpaces } from "@/components/interiors/interior-spaces"
import { EstimateCalculators } from "@/components/interiors/estimate-calculators"
import { Testimonials } from "@/components/interiors/testimonials"
import { FAQ } from "@/components/interiors/faq"
import Header from "@/components/Header"

export default function InteriorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NoticeBar />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-12">
          <span className="text-[#FF8000]">Inter</span>iors
        </h1>
        <InteriorShowcase />
        <InteriorSpaces />
        <EstimateCalculators />
        <Testimonials />
        <FAQ />
      </main>
    </div>
  )
}

