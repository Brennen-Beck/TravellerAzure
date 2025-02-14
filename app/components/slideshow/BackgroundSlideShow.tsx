"use client";
import { useEffect, useState } from "react";
import Image from "next/image";


const contentOptions = [
  { type: "image", src: "/images/Free Pik Starport One.jpeg" },
  { type: "image", src: "/images/Starship.jpg" },
  { type: "video", src: "/videos/SpaceshipHallway.mp4" },
  { type: "image", src: "/images/Ship in Port.webp" },
  { type: "image", src: "/images/Spaceport.png" }
];

export default function BackgroundSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % contentOptions.length);
        setIsFading(false);
      }, 1500); // Fade-out duration
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const content = contentOptions[currentIndex];

  return (
    <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background wrapper with fading effect */}
      <div
        className={`absolute w-full h-screen transition-opacity duration-1000 ${isFading ? "opacity-0" : "opacity-100"}`}
      >
        {content.type === "video" ? (
           <div key={content.src}>
          <video
            src={content.src}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          />
          </div>
        ) : (
          <div key={content.src}>
          <Image
            src={content.src}
            alt="Background"
            width={1920} // Specify width for high-res images
            height={1080} // Specify height for the image
            className="object-cover w-full h-full"
          />
          </div>
        )}
      </div>
    </div>
  );
}
