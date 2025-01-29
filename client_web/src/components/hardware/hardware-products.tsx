import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const products = [
  {
    label: "New Series",
    name: "Sun Mica Doors",
    price: "₹2500.00",
    image: "/placeholder.svg",
  },
  {
    label: "Top Quality",
    name: "Classic Doors",
    price: "₹2500.00",
    image: "/placeholder.svg",
  },
  {
    label: "Crystal Clear",
    name: "Glossy Doors",
    price: "₹2100.00",
    image: "/placeholder.svg",
  },
  {
    label: "New Product",
    name: "Laminate Groove Doors",
    price: "₹2500.00",
    image: "/placeholder.svg",
  },
  {
    label: "Top Quality",
    name: "Classic Doors",
    price: "₹2500.00",
    image: "/placeholder.svg",
  },
]

export function HardwareProducts() {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-8">
        <span className="text-[#FF8000]">The Quality.</span>{" "}
        <span className="text-gray-600">Doors That Define Excellence.</span>
      </h2>

      <div className="grid md:grid-cols-5 gap-6">
        {products.map((product, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-gray-100">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-[#FF8000]">{product.label}</p>
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

