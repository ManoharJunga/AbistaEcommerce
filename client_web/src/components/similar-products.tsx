import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface SimilarProduct {
  id: number
  image: string
  code: string
}

interface SimilarProductsProps {
  products: SimilarProduct[]
}

export function SimilarProducts({ products }: SimilarProductsProps) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-8">More Similar Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={`Similar product ${product.id}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <Link href="#" className="text-primary hover:underline">
                View Product &gt;
              </Link>
              <div className="mt-2 inline-block bg-orange-100 px-3 py-1 rounded-full">{product.code}</div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

