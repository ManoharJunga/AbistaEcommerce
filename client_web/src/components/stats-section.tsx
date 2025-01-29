import { Trophy, SmilePlus, Building2, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function StatsSection() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8">
        <span className="text-[#FF8000]">Only at Abista.</span>{" "}
        <span className="text-gray-600">We take pride in Delivering Exceptional Services</span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <Card>
          <CardContent className="p-6">
            <Trophy className="h-8 w-8 text-[#FF8000] mb-4" />
            <div className="text-2xl font-bold text-[#FF8000]">20+</div>
            <p className="text-gray-600">Decades of Expertise, Built on Trust and Excellence.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <SmilePlus className="h-8 w-8 text-[#FF8000] mb-4" />
            <div className="text-2xl font-bold text-[#FF8000]">5,800+</div>
            <p className="text-gray-600">Smiles Delivered, Trust Earned - Thousands of Happy Customers.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Building2 className="h-8 w-8 text-[#FF8000] mb-4" />
            <div className="text-2xl font-bold text-[#FF8000]">2,02,500+</div>
            <p className="text-gray-600">Unmatched Success – Millions of Units Sold and Counting!</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <MapPin className="h-8 w-8 text-[#FF8000] mb-4" />
            <div className="text-2xl font-bold text-[#FF8000]">115+</div>
            <p className="text-gray-600">Expanding Horizons – Proudly Serving Numerous Cities Nationwide!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

