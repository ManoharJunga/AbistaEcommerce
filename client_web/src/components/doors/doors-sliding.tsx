"use client"
import { useEffect, useState } from "react";
import Image from "next/image";

// Define the Slideshow type
interface Slideshow {
  _id: string;
  name: string;
  title: string;
  tags: "doors" | "frames" | "hardware" | "main page";
  image: string;
}

export function DoorsSliding() {
  const [doorImage, setDoorImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlideshows = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/slideshow"); // Adjust API route if necessary
        const data: Slideshow[] = await response.json();

        // Filter slideshows with the tag "doors"
        const doorsSlide = data.find((slide: Slideshow) => slide.tags === "doors");

        if (doorsSlide) {
          setDoorImage(doorsSlide.image);
        }
      } catch (error) {
        console.error("Error fetching slideshow:", error);
      }
    };

    fetchSlideshows();
  }, []);

  return (
    <section className="mb-16">
      <div className="aspect-[21/9] relative rounded-lg overflow-hidden bg-gray-200">
        {doorImage ? (
          <Image src={doorImage} alt="Door Showcase" fill className="object-cover" />
        ) : (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">Loading...</p>
        )}
      </div>
    </section>
  );
}
