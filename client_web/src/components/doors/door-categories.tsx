import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    name: "BEDROOM DOORS",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-29%20at%2011.09.59%E2%80%AFAM-SWWHZHkPaz4zGXa97is2AkQpp1YII1.png",
  },
  {
    name: "BATHROOM DOORS",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-29%20at%2011.09.59%E2%80%AFAM-SWWHZHkPaz4zGXa97is2AkQpp1YII1.png",
  },
  {
    name: "BEDROOM",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-29%20at%2011.09.59%E2%80%AFAM-SWWHZHkPaz4zGXa97is2AkQpp1YII1.png",
  },
  {
    name: "BEDROOM",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-29%20at%2011.09.59%E2%80%AFAM-SWWHZHkPaz4zGXa97is2AkQpp1YII1.png",
  },
]

export function DoorCategories() {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-8">
        <span className="text-[#FF8000]">Select Your Doors</span> <span className="text-gray-600">by Category.</span>
      </h2>

      <div className="grid md:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0 relative aspect-[4/3]">
              <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90">
                <h3 className="text-center font-medium text-gray-900">{category.name}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

