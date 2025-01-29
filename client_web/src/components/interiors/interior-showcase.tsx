import Image from "next/image"

export function InteriorShowcase() {
  return (
    <section className="mb-16">
      <div className="aspect-[21/9] relative rounded-lg overflow-hidden border-2 border-blue-400">
        <Image src="/placeholder.svg" alt="Interior Design Showcase" fill className="object-cover" />
      </div>
    </section>
  )
}

