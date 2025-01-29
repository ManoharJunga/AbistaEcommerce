import Image from "next/image"

export function FrameShowcase() {
  return (
    <section className="mb-16">
      <div className="aspect-[21/9] relative rounded-lg overflow-hidden bg-gray-200">
        <Image src="/placeholder.svg" alt="Frame Showcase" fill className="object-cover" />
      </div>
    </section>
  )
}

