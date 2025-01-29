import { Shield, Leaf, Cloud, PenToolIcon as Tool } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    title: "DURABILITY",
    description: "Our WPC frames are resistant to moisture, ensuring long-lasting performance in any environment.",
    icon: Shield,
  },
  {
    title: "ECO-FRIENDLY",
    description: "Made from recycled wood and plastic, these frames are environmentally sustainable.",
    icon: Leaf,
  },
  {
    title: "WEATHER-RESISTANT",
    description: "These frames withstand extreme weather conditions without warping or cracking.",
    icon: Cloud,
  },
  {
    title: "LOW MAINTENANCE",
    description: "No painting or sealing required – just easy, long-term care.",
    icon: Tool,
  },
]

export function DoorFeatures() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">Exceptional Quality. Frames That Set the Standard.</h2>

      <div className="grid md:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardContent className="p-6">
              <feature.icon className="h-8 w-8 text-[#FF8000] mb-4" />
              <h3 className="font-bold text-[#FF8000] mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

