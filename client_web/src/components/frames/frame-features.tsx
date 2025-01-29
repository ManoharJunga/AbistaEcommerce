import { Shield, Leaf, Cloud, PenToolIcon as Tool, Palette } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    title: "DURABILITY",
    description: "Our WPC frames are resistant to moisture, ensuring long-lasting performance in any environment.",
    icon: Shield,
    color: "#FF8000",
  },
  {
    title: "ECO-FRIENDLY",
    description: "Made from recycled wood and plastic, these frames are environmentally sustainable.",
    icon: Leaf,
    color: "#4CAF50",
  },
  {
    title: "WEATHER-RESISTANT",
    description: "These frames withstand extreme weather conditions without warping or cracking.",
    icon: Cloud,
    color: "#2196F3",
  },
  {
    title: "LOW MAINTENANCE",
    description: "No painting or sealing required – just easy, long-term care.",
    icon: Tool,
    color: "#9C27B0",
  },
  {
    title: "STYLISH DESIGN",
    description: "Modern aesthetics with sleek finishes that complement any interior decor.",
    icon: Palette,
    color: "#E91E63",
  },
]

export function FrameFeatures() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">Exceptional Quality. Frames That Set the Standard.</h2>

      <div className="grid md:grid-cols-5 gap-6">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardContent className="p-6">
              <feature.icon className="h-8 w-8 mb-4" style={{ color: feature.color }} />
              <h3 className="font-bold mb-2" style={{ color: feature.color }}>
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

