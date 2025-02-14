import BackgroundSlideshow from "./components/slideshow/BackgroundSlideShow";

/*=========================================================================================================================
Landing Page
Brennen Beck
February 2, 2025

Synopsis: The home page for the site.Displays an image slideshow.

Description: 
  

Notes:

  Version 1.0 (2/2/2025-BB) - Original code.
===========================================================================================================================*/
export const metadata = {
  title: "BBeck Actual's Traveller Site",
};

export default function Home() {
  
  return (
    <main className="relative w-full h-screen m-0 p-0 overflow-hidden">
      <BackgroundSlideshow />

      {/* 
      <section className="relative z-10 flex flex-col text-white">
        <p className="text-2xl font-bold">Welcome to My Traveller Website</p>
        <p>This is some text on the page.</p>
      </section>
       */}
    </main>
  );
}
