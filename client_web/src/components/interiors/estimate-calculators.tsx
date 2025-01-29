import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const calculators = [
  {
    title: "Complete Home Makeover",
    description: "Explore the estimated cost for designing your entire home interior.",
  },
  {
    title: "Kitchen Design Estimate",
    description: "Check the approximate pricing for your dream kitchen.",
  },
  {
    title: "Wardrobe Cost Estimate",
    description: "Discover how much it will cost to build your perfect wardrobe.",
  },
]

export function EstimateCalculators() {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Get the estimate</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {calculators.map((calc) => (
          <Card key={calc.title}>
            <CardContent className="p-6">
              <h3 className="font-semibold text-xl mb-2">{calc.title}</h3>
              <p className="text-gray-600 text-sm">{calc.description}</p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full bg-[#8B4513] hover:bg-[#6F3709]">Calculate &gt;</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

