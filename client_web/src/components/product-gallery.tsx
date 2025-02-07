"use client";
import Image from "next/image";
import { useState, useRef } from "react";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<{
    display: string;
    backgroundImage?: string;
    backgroundPosition?: string;
    backgroundSize?: string;
  }>({ display: "none" });

  const zoomRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      display: "block",
      backgroundImage: `url(${images[selectedImage] || "/placeholder.svg"})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  return (
    <div className="flex gap-4 items-start relative">
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

      {/* Main Image with Zoom Effect */}
      <div
        className="border rounded-lg overflow-hidden w-[500px] h-[500px] flex items-center justify-center relative cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={images[selectedImage] || "/placeholder.svg"}
          alt="Main product image"
          width={500}
          height={500}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Zoomed Image Display */}
      <div
        ref={zoomRef}
        className="absolute top-0 right-[-520px] w-[500px] h-[500px] hidden lg:block border overflow-hidden rounded-lg"
        style={zoomStyle}
      ></div>
    </div>
  );
}