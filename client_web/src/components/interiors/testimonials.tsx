import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    name: "Regina Miles",
    role: "Designer",
    text: "Slate helps you see how many more days you need to work to reach your financial goal.",
    rating: 5,
    image: "/placeholder.svg",
  },
  {
    name: "Regina Miles",
    role: "Designer",
    text: "Slate helps you see how many more days you need to work to reach your financial goal.",
    rating: 5,
    image: "/placeholder.svg",
  },
  {
    name: "Regina Miles",
    role: "Designer",
    text: "Slate helps you see how many more days you need to work to reach your financial goal.",
    rating: 5,
    image: "/placeholder.svg",
  },
]

export function Testimonials() {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-12">What they say about us</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 relative rounded-full overflow-hidden">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{testimonial.text}</p>
              <h3 className="font-semibold text-[#FF8000]">{testimonial.name}</h3>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

