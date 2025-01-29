import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function LatestUpdates() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8">
        <span className="text-[#FF8000]">The Latest.</span>{" "}
        <span className="text-gray-600">Unwrap the extraordinary.</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0 relative aspect-video">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-27%20at%207.19.32%E2%80%AFPM-fBMNk60EzGfb0O1jczDnNDcjhhx0Cy.png"
              alt="Warranty"
              fill
              className="object-cover"
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0 relative aspect-video">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-27%20at%207.19.32%E2%80%AFPM-fBMNk60EzGfb0O1jczDnNDcjhhx0Cy.png"
              alt="Delivery"
              fill
              className="object-cover"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

