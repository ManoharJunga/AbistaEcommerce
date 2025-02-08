"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const standardHeights = [72, 75, 78, 81, 84, 87, 90];
const standardWidths = [24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44];

// Function to find the next higher standard size (supports decimals)
const findNextHigherStandardSize = (value: number, standardSizes: number[]) => {
  for (const size of standardSizes) {
    if (value <= size) {
      return size;
    }
  }
  return standardSizes[standardSizes.length - 1]; // Return the largest size if value exceeds all standard sizes
};

interface ProductDetailsProps {
  title: string;
  price: number;
  height: string;
  width: string;
  quantity: string;
  description: string;
}

export function ProductDetails({
  title,
  price,
  height,
  width,
  quantity,
  description,
}: ProductDetailsProps) {
  const [rawHeight, setRawHeight] = useState(height);
  const [rawWidth, setRawWidth] = useState(width);
  const [customQuantity, setCustomQuantity] = useState(quantity);
  const [adjustedHeight, setAdjustedHeight] = useState<number | null>(null);
  const [adjustedWidth, setAdjustedWidth] = useState<number | null>(null);
  const [showTotalCost, setShowTotalCost] = useState(false); // Hide initially

  // When user finishes typing (onBlur), adjust the value and show total cost
  const handleHeightBlur = () => {
    if (!rawHeight) return;
    const heightValue = parseFloat(rawHeight);
    if (!isNaN(heightValue)) {
      setAdjustedHeight(findNextHigherStandardSize(heightValue, standardHeights));
      setShowTotalCost(true); // Show total cost after user enters value
    }
  };

  const handleWidthBlur = () => {
    if (!rawWidth) return;
    const widthValue = parseFloat(rawWidth);
    if (!isNaN(widthValue)) {
      setAdjustedWidth(findNextHigherStandardSize(widthValue, standardWidths));
      setShowTotalCost(true); // Show total cost after user enters value
    }
  };

  // Calculate Square Feet and Total Cost (only if height and width are entered)
  const squareFeet =
    adjustedHeight && adjustedWidth ? (adjustedWidth * adjustedHeight) / 144 : 0;
  const totalCost = squareFeet && customQuantity ? Math.ceil(squareFeet * price * parseFloat(customQuantity || "1")) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-2xl">₹{price.toFixed(2)} / sqft</p>
        <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
      </div>

      {/* Product Description */}
      <div>
        <h3 className="text-lg font-semibold">Description</h3>
        <p className="text-gray-700">{description}</p>
      </div>

      <div className="space-y-4">
        {/* Customizable Height (Auto-adjusted onBlur) */}
        <div className="flex items-center gap-4">
          <span className="w-20 font-medium">Height:</span>
          <input
            type="number"
            step="0.1"
            value={rawHeight}
            onChange={(e) => setRawHeight(e.target.value)}
            onBlur={handleHeightBlur} // Adjust when user leaves input
            className="border rounded px-3 py-2 w-24"
          />
          <span className="w-20 font-medium">in inchs</span>
        </div>

        {/* Customizable Width (Auto-adjusted onBlur) */}
        <div className="flex items-center gap-4">
          <span className="w-20 font-medium">Width:</span>
          <input
            type="number"
            step="0.1"
            value={rawWidth}
            onChange={(e) => setRawWidth(e.target.value)}
            onBlur={handleWidthBlur} // Adjust when user leaves input
            className="border rounded px-3 py-2 w-24"
          />
          <span className="w-20 font-medium">in inchs</span>
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
          <span className=" font-medium">No of doors</span>
        </div>

        {/* Total Cost Display (Only show when values are entered) */}
        {showTotalCost && adjustedHeight && adjustedWidth && (
          <div className="text-lg font-medium text-gray-700">
            Total Cost: ₹{totalCost}
          </div>
        )}
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
  );
}
