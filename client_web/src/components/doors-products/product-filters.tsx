"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"

const finishes = [
  "Smooth Finish",
  "Glossy Finish",
  "Simple Design",
  "Moderate Design",
  "Rich Design",
  "3D Design",
  "2D Design",
  "Texture Design",
  "Steel Beading",
]

const colors = [
  { name: "Teak", color: "#8B4513" },
  { name: "Rose Wood", color: "#8B4513" },
  { name: "Orange", color: "#FFA500" },
  { name: "Dark Blue", color: "#00008B" },
]

const categories = ["Bedroom", "Bathroom", "Decoration", "Kitchen", "Living", "lighting", "Decor"]

export function ProductFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Filter :</h2>
        <Input placeholder="Search" className="mb-4" />
      </div>

      <div>
        <h3 className="font-semibold mb-3">Finishes</h3>
        <div className="space-y-2">
          {finishes.map((finish) => (
            <div key={finish} className="flex items-center">
              <Checkbox id={finish} />
              <Label htmlFor={finish} className="ml-2">
                {finish}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Color</h3>
        <div className="space-y-2">
          {colors.map((color) => (
            <div key={color.name} className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.color }} />
              <Label>{color.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <Checkbox id={category} />
              <Label htmlFor={category} className="ml-2">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Applied Filters</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-8">
            Popular Tags <X className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            Furniture <X className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            Tag <X className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Filter By Price</h3>
        <Slider defaultValue={[500]} max={1000} step={1} className="mb-4" />
        <div className="flex justify-between text-sm text-gray-500">
          <span>₹0</span>
          <span>₹1000</span>
        </div>
        <Button className="w-full mt-4 bg-[#8B4513] hover:bg-[#6F3709]">Filter</Button>
      </div>
    </div>
  )
}

