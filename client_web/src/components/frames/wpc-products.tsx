import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const products = [
  {
    type: "WPC Frames",
    name: "3×2 inch thickness",
    price: "₹500.00",
    image: "/placeholder.svg",
  },
  {
    type: "WPC Frames",
    name: "4×2 inch thickness",
    price: "₹500.00",
    image: "/placeholder.svg",
  },
  {
    type: "WPC Frames",
    name: "5×2 inch thickness",
    price: "₹500.00",
    image: "/placeholder.svg",
  },
]

export function WPCProducts() {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">WPC Products</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-gray-100">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">{product.type}</p>
                <h3 className="font-medium text-gray-900">{product.name}</h3>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <p className="text-sm text-gray-500">From {product.price}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

