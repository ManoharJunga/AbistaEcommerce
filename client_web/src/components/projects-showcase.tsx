import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function ProjectsShowcase() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8">
        <span className="text-[#FF8000]">Extraordinary products.</span>{" "}
        <span className="text-gray-600">Best prices. Big projects.</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0 relative aspect-video">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-27%20at%207.19.32%E2%80%AFPM-fBMNk60EzGfb0O1jczDnNDcjhhx0Cy.png"
              alt="School Projects"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <h3 className="text-white text-xl font-bold">SCHOOL PROJECTS</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0 relative aspect-video">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-27%20at%207.19.32%E2%80%AFPM-fBMNk60EzGfb0O1jczDnNDcjhhx0Cy.png"
              alt="Hospital Projects"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <h3 className="text-white text-xl font-bold">HOSPITAL PROJECTS</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0 relative aspect-video">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-27%20at%207.19.32%E2%80%AFPM-fBMNk60EzGfb0O1jczDnNDcjhhx0Cy.png"
              alt="Hotel Projects"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <h3 className="text-white text-xl font-bold">HOTEL PROJECTS</h3>
              <p className="text-white">Enhancing comfort and elegance-one door at a time.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

