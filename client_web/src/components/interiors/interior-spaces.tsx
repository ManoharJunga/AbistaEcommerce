import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const spaces = [
  {
    name: "Living Room",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-29%20at%2012.23.33%E2%80%AFPM-E1LYIOgQT0u1lIRrhUcrZ24ITPXrcJ.png",
  },
  {
    name: "Master Bedroom",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-29%20at%2012.23.33%E2%80%AFPM-E1LYIOgQT0u1lIRrhUcrZ24ITPXrcJ.png",
  },
  {
    name: "Kids Room",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-29%20at%2012.23.33%E2%80%AFPM-E1LYIOgQT0u1lIRrhUcrZ24ITPXrcJ.png",
  },
  {
    name: "Kitchen",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-29%20at%2012.23.33%E2%80%AFPM-E1LYIOgQT0u1lIRrhUcrZ24ITPXrcJ.png",
  },
]

export function InteriorSpaces() {
  return (
    <section className="mb-16">
      <div className="grid md:grid-cols-2 gap-6">
        {spaces.map((space) => (
          <Card key={space.name} className="overflow-hidden">
            <CardContent className="p-0 relative aspect-video">
              <Image src={space.image || "/placeholder.svg"} alt={space.name} fill className="object-cover" />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-md">
                <h3 className="font-medium text-gray-900">{space.name}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

