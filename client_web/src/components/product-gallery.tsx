"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex gap-4 items-start">
      {/* Thumbnails */}
      <div className="flex flex-col gap-4">
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`border rounded-lg overflow-hidden w-20 h-20 ${
              selectedImage === index ? "ring-2 ring-primary" : ""
            }`}
          >
            <Image
              src={src || "/placeholder.svg"}
              alt={`Product thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="border rounded-lg overflow-hidden w-[500px] h-[500px] flex items-center justify-center">
        <Image
          src={images[selectedImage] || "/placeholder.svg"}
          alt="Main product image"
          width={500}
          height={500}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
