"use client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";
/*=========================================================================================================================
Declare Destination
ChatGPT
February 3, 2025

Synopsis: Allows a user to select a Star System for the ship's next destination from a list of systems. 

Description: 
  This is the first page I've let ChatGPT design. Overall, CG did a pretty good job, although I think it took a good 2 or 3 hours
of back and forth to get it to code something that worked. Probably not really that long since half the time was spent tweaking 
the color scheme which really doesn't count. Even then, there was at least an hour of correcting GPT's code and going back to the 
"drawing board" with architetural choices since it's initial choice didn't seem to work no matter how many times it tried to fix
the problems.

  Ultimately, this provides an input box for the user to begin typing in the name of a Star System. Once the user types in at
least 3 characters, the drop down provides a list of Star Systems that match the letters typed. The database requires 3 characters
to be sent to prevent returning all the star systems every time the page is called. Forcing the request to the server to ahve at 
least the first 3 characters reduces the number of systems to something that is managable in a drop down list both for the user to
scroll through and for the query to return. Once a star system is selected, the user must confirm the choice by pressing a 
confirmation button. This calls the database with the system the user chose. If the system is within the ship's jump distance
capability, the destination will be recorded as the ship's next destination. This is required before the ship can do things such
as take on passengers or view standard freight.

  I probably should have had ChatGPT generate it's own comments here, but it doesn't understand the context of the entire 
application and how this fits in. Not to mention the fact that I wanted to get my two cents in. Still, I have to give it credit
for it's work because this component was written about 99% by ChatGPT. I still need to go over it line by line, understand it, 
comment it, and make sure everything in the code makes sense. I think it is putting a popup at the end of the card that doesn't
make good sense although it's not hurting anything and I could get away with leaving it there and few would likely notice.

Notes:

  Version 1.0 (3/3/2025-CG) - Original code.
  Version 1.1 (3/9/2025-BB) - Changed to use Route to route to the Ship Status page when a selection is confirmed.
===========================================================================================================================*/
// Zod Schema for API Response Validation
const StarSystemSchema = z.object({
  System: z.string(),
  Sector: z.string(),
  UWP: z.string(),
  SectorID: z.number(),
  SystemID: z.number(),
  Zone: z.string(),
});

const SystemsResponseSchema = z.object({
  Data: z.array(StarSystemSchema),
});

// Type Definitions
type StarSystem = z.infer<typeof StarSystemSchema>;

export default function SelectStarSystem() {
  const [query, setQuery] = useState("");
  const [starSystems, setStarSystems] = useState<StarSystem[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<StarSystem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  // Ref for handling clicks outside the dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch Star Systems when user types (debounced)
  useEffect(() => {
    if (query.length < 3) {
      setStarSystems([]);
      setDropdownOpen(false);
      return;
    }

    const fetchStarSystems = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/GetSystemsByName/${query}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const jsonData = await response.json();
        const parsedData = SystemsResponseSchema.parse(jsonData);
        setStarSystems(parsedData.Data);
        setDropdownOpen(parsedData.Data.length > 0); // Open dropdown only if results exist
      } catch (err) {
        setError("Failed to fetch star systems.");
        console.error("Error fetching star systems:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => fetchStarSystems(), 500); // Debounce API call
    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Handle selection of a system
  const handleSelectSystem = (system: StarSystem) => {
    setSelectedSystem(system);
    setQuery(system.System); // Update input field with selection
    setDropdownOpen(false); // Close dropdown immediately
  };

  // Handle declaring the destination
  const handleConfirmSelection = async () => {
    if (!selectedSystem) return;

    const { SectorID, SystemID } = selectedSystem;
    const endpoint = `${API_URL}/DeclareDestination/${GAME_ID}/${SHIP_ID}/${SectorID}/${SystemID}`;
    
    try {
      setLoading(true);
      const response = await fetch(endpoint, { method: "PATCH" });
      if (!response.ok) {
        console.log("Response Header: ", response.headers)
        throw new Error(`Failed to declare destination. Status: ${response.status}`);
      };

      alert(`Destination set to ${selectedSystem.System}, Sector: ${selectedSystem.Sector}`);
      /* Route to the Ship's Status page after a good selection is made */
      router.push("/shipsstatus"); // Added routing here
    } catch (err) {
      console.error("Error declaring destination:", err);
      alert("Failed to set destination.");
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="flex flex-col items-center mt-4 min-h-screen p-4">
      <Card className="w-full max-w-lg bg-card text-card-foreground">
        <CardTitle className="text-center p-4">Select Star System</CardTitle>
        <CardContent className="relative flex flex-col gap-4">
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Type a Star System name..."
            value={query}
            onChange={(e) => {
              const newQuery = e.target.value;
              setQuery(newQuery);
          
              // Reset selectedSystem if input no longer matches
              if (selectedSystem && newQuery !== selectedSystem.System) {
                setSelectedSystem(null);
              }
            }}
            onFocus={() => isDropdownOpen || setDropdownOpen(true)} // Open on focus if results exist
          />

          {/* Floating Dropdown */}
          {isDropdownOpen && !selectedSystem && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 w-full bg-popover text-popover-foreground border rounded-md shadow-md max-h-60 overflow-y-auto z-50"
            >
              {starSystems.length > 0 ? (
                <ul>
                  {starSystems.map((system) => (
                    <li
                      key={system.SystemID}
                      onClick={() => handleSelectSystem(system)}
                      className="p-2 hover:bg-primary cursor-pointer"
                    >
                      {system.System} ({system.Sector}) [{system.UWP}]
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-2 text-gray-500">No results found</p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Selected System Details */}
          {selectedSystem && (
            <div className="p-3 border border-border rounded-md bg-input">
              <p>
                <strong>System:</strong> {selectedSystem.System}
              </p>
              <p>
                <strong>Sector:</strong> {selectedSystem.Sector}
              </p>
              <p>
                <strong>UWP:</strong> {selectedSystem.UWP}
              </p>
              <p>
                <strong>Zone:</strong> {selectedSystem.Zone}
              </p>
              <Button onClick={handleConfirmSelection} disabled={loading} className="mt-2">
                {loading ? "Setting Destination..." : "Confirm Destination"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
