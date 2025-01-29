import Image from "next/image"

export function HardwareShowcase() {
  return (
    <section className="mb-16">
      <div className="aspect-[21/9] relative rounded-lg overflow-hidden bg-gray-200">
        <Image src="/placeholder.svg" alt="Hardware Showcase" fill className="object-cover" />
      </div>
    </section>
  )
}

