"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ProductDetailsProps {
  title: string
  price: number
  height: string
  width: string
  quantity: string
  description: string
}

export function ProductDetails({
  title,
  price,
  height,
  width,
  quantity,
  description
}: ProductDetailsProps) {
  const [customHeight, setCustomHeight] = useState(height)
  const [customWidth, setCustomWidth] = useState(width)
  const [customQuantity, setCustomQuantity] = useState(quantity)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-2xl">₹{price.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
      </div>

      {/* Product Description */}
      <div>
        <h3 className="text-lg font-semibold">Description</h3>
        <p className="text-gray-700">{description}</p>
      </div>

      <div className="space-y-4">
        {/* Customizable Height */}
        <div className="flex items-center gap-4">
          <span className="w-20 font-medium">Height:</span>
          <input
            type="number"
            value={customHeight}
            onChange={(e) => setCustomHeight(e.target.value)}
            className="border rounded px-3 py-2 w-24"
          />
        </div>
        
        {/* Customizable Width */}
        <div className="flex items-center gap-4">
          <span className="w-20 font-medium">Width:</span>
          <input
            type="number"
            value={customWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
            className="border rounded px-3 py-2 w-24"
          />
        </div>
        
        {/* Customizable Quantity */}
        <div className="flex items-center gap-4">
          <span className="w-20 font-medium">Quantity:</span>
          <input
            type="number"
            value={customQuantity}
            onChange={(e) => setCustomQuantity(e.target.value)}
            className="border rounded px-3 py-2 w-24"
          />
        </div>
      </div>

      {/* Add To Cart Button */}
      <Button className="w-full" size="lg">
        Add To Cart
      </Button>

      <p className="text-sm text-green-600 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
        Dispatched in 1 day
      </p>
    </div>
  )
}
