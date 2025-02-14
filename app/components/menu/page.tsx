"use client";
import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { Menu, X, Sun, Moon } from "lucide-react"; // Import icons
import { z } from "zod"; // Import Zod
import { 
        DropdownMenu, 
        DropdownMenuTrigger, 
        DropdownMenuContent, 
        DropdownMenuSeparator,
        DropdownMenuItem,
        DropdownMenuSub,
        DropdownMenuSubTrigger,
        DropdownMenuPortal,
        DropdownMenuSubContent
       } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";


/*=========================================================================================================================
Navigation Sidebar
Brennen Beck
January 29, 2025

Synopsis: Sidebar navigation menu - now displays at the top of screen in wide mode

Description: 
  An unordered list navigation bar component that is used in the layout.tsx outer wrapper of the entire web app. Most of what 
is here is just a simple navigation menu and Tailwind CSS formatting. Darkmode/Lightmode toggling is supported here. The site's
logo is at the top and links back to the home page.

  This is implemented this way so that there is a single navigation menu for the site providing a single place to maintain the
nav bar which is used on every page.

  There are two states, isOpen and isDarkMode. isOpen toggles hiding the menu and isDarkMode toggles dark mode and light mode.

Notes:

  Version 1.0 (1/29/2025) - Original code.
  Version 1.1 (2/10/2025-BB) - New menu options including submenu.

===========================================================================================================================*/
// Define the Zod schema for validating state
const sidebarStateSchema = z.object({
  isOpen: z.boolean(),
  isDarkMode: z.boolean(),
});

type SidebarState = z.infer<typeof sidebarStateSchema>;

export default function Sidebar({children}: {children: ReactNode}) {
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    isOpen: false,
    isDarkMode: true,
  });
  
  const router = useRouter(); // Initialize the router

  //Menu horizontal vs vertical
  const [isWideScreen, setIsWideScreen] = useState(false);
    // Check screen width on mount and window resize
    useEffect(() => {
      const checkScreenWidth = () => {
        setIsWideScreen(window.innerWidth >= 768); // breakpoint
      };
      checkScreenWidth();
      window.addEventListener("resize", checkScreenWidth);
      return () => window.removeEventListener("resize", checkScreenWidth);
    }, []);


  // Apply dark mode class when isDarkMode is true
  useEffect(() => {
    if (sidebarState.isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [sidebarState.isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode =!sidebarState.isDarkMode;
    setSidebarState((prevState) => ({
      ...prevState,
      isDarkMode: newDarkMode,
    }));
    document.documentElement.classList.toggle("dark", newDarkMode); // Toggle the dark class on the root element
  };

  return (
    <>
      {/* Sidebar Toggle Button - Only Show on Small Screens */}
      {!isWideScreen && (
        <button
          className="fixed top-2.5 left-1 z-50 p-2 bg-gray-800 text-primary-foreground rounded-full shadow-md"
          onClick={() => setSidebarState((prevState) => ({ ...prevState, isOpen: !prevState.isOpen }))}
        >
          {sidebarState.isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Background Dimming Overlay (only dims the background on small screens) */}
      {!isWideScreen && sidebarState.isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarState((prevState) => ({ ...prevState, isOpen: false }))}
        />
      )}

        {/* Navigation Bar (Sidebar for Small Screens, Horizontal for Wide Screens) */}
        <nav
          className={`font-[orbitron] bg-primary text-primary-foreground shadow-lg transition-transform duration-300 z-50
            ${isWideScreen 
              ? "w-full fixed left-0 top-0 flex flex-row items-center justify-between p-4"
              : `flex flex-col fixed top-0 left-0 h-full w-64 p-1.5 ${sidebarState.isOpen ? "translate-x-0" : "-translate-x-full"}`
            }`}
        >
        {/* Logo - Always Align Left */}
        {isWideScreen ? (
          // Content for wide screens
          <Link href="/" className="flex items-center">
            <div className="relative">
              <Image
                src="/images/Traveller Site Logo Cropped.webp"
                alt="BBeck Actuals Traveller Site logo"
                width={384}  // Specify width for wide screens
                height={72}  // Specify height for wide screens
                sizes="(max-width: 768px) 100vw, 256px"
                className="object-contain"
              />
            </div>
          </Link>
          ) : (
          // Content for narrow screens
          <Link href="/" className="flex items-center">
            <div className="relative w-full h-auto pt-2 pb-4">
              <Image
                src="/images/Traveller Site Logo Cropped.webp"
                alt="BBeck Actuals Traveller Site logo"
                width={384}  // Specify width for wide screens
                height={72}  // Specify height for wide screens
                className="object-contain"
              />
            </div>
          </Link>
        )}

            {/* Navigation Links */}
            <ul className={`flex ${isWideScreen ? "space-x-8" : "flex-col px-12 space-y-7"}`}>

              {/* Ship Managment Menu */}
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild> 
                    <Button variant="outline">Ship Management</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onSelect={() => router.push("/shipsstatus")}>Ship&apos;s Status</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push("/cargobay")}>Cargobay</DropdownMenuItem>                    
                    <DropdownMenuItem onSelect={() => router.push("/shipsledger")}>Ship&apos;s Ledger</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push("/crewroster")}>Crew Roster</DropdownMenuItem>   
                    <DropdownMenuItem onSelect={() => router.push("/spaceencounters")}>Encounters</DropdownMenuItem>   
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Actions</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onSelect={() => router.push("/movetheship")}>Jump!</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => router.push("/declaredestination")}>Declare Destination</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => router.push("/buyfuel")}>Buy Fuel</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => router.push("/preparefordeparture")}>Prepare for Departure</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => router.push("/monthlymaintenance")}>Monthly Maintenance</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => router.push("/refinefuelonboard")}>Refine Fuel Onboard</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>

              {/* Trade Menu */}
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild> 
                    <Button variant="outline">Trade</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onSelect={() => router.push("/speculativeoffers")}>Speculative Offers</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push("/speculativetransactions")}>Speculative Transactions</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push("/passengersavailable")}>Passengers</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push("/standardfreight")}>Standard Freight</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              
              {/* Application Menu */}
              <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild> 
                      <Button variant="outline">Application</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem onSelect={() => router.push("/")}>Home</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={toggleDarkMode} >Light/Dark Mode</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </li>
            </ul>

          {/* Dark Mode Toggle Icon displays only on narrow screens */}
          {!isWideScreen && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={toggleDarkMode}
                className="p-2 bg-gray-800 text-white rounded-full shadow-md"
              >
                {sidebarState.isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
          )}
        </nav>
        {/* The main content area */}
        <div
          className={`flex-1 overflow-y-auto p-4 ${
            isWideScreen ? "mt-10" : ""  // If wide screen, give margin-top to avoid overlap
          }`}
        >
          <main>{children}</main>
        </div>
    </>
  );
}
