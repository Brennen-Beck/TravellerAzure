"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";
import { z } from "zod";


// Define the schema for a single freight entry
const StandardFreightSchema = z.object({
  LotID: z.number(),
  System: z.string(),
  LotType: z.string(),
  dTons: z.number().int().min(0).max(255), // Matches TINYINT in SQL Server (0-255)
  Value: z.number().int(), // INT in SQL Server
});

// Define the schema for the API response
const StandardFreightResponseSchema = z.object({
  Data: z.array(StandardFreightSchema),
  Links: z.array(
    z.object({
      Href: z.string().nullable(), // Can be null based on response
      Rel: z.string(),
      Type: z.string(),
    })
  ),
});

// Infer TypeScript type
type StandardFreightLot =z.infer<typeof StandardFreightSchema>;
type StandardFreightResponse = z.infer<typeof StandardFreightResponseSchema>;



const ShipDataSchema = z.object({
  ShipName: z.string(),
  PreparingForDeparture: z.boolean(),
  Day: z.number(),
  Year: z.number(),
  Time: z.string(),
  System: z.string(),
  SystemUWP: z.string(),
  DeclaredDestination: z.string().nullable(),
  FuelOnboard: z.number(),
  FuelCapacity: z.number(),
  RefinedFuel: z.boolean(),
  CargoSpaceFilled: z.number(),
  CargoSpace: z.number(),
  ShipsBank: z.number(),
  MaintenanceDay: z.number(),
  MaintenanceYear: z.number(),
  MaintenanceDue: z.number(),
  MortgageYear: z.number().nullable(),
  MortgageDay: z.number().nullable(),
  MortgageDue: z.number().nullable(),
  Payments: z.number(),
  Mortgage: z.number().nullable(),
  HullSize: z.number(),
  JDrive: z.number(),
  LowBerths: z.number(),
  LowPassengers: z.number(),
  Basic: z.number(),
  BasicPassengers: z.number(),
  Middle: z.number(),
  MiddlePassengers: z.number(),
  High: z.number(),
  HighPassengers: z.number(),
  Luxury: z.number(),
  LuxuryPassengers: z.number(),
});

type ShipData = z.infer<typeof ShipDataSchema>;



export default function StandardFreightPage() {
  const router = useRouter();
  const [ship, setShip] = useState<ShipData | null>(null);
  const [freight, setFreight] = useState<StandardFreightLot[]>([]); // Initialize as an empty array
  const ShipsBank = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(ship?.ShipsBank);
  const [error, setError] = useState<string | null>(null);
  const [openFreightList, setOpenFreightList] = React.useState(false)
  const [selectedFreight, setSelectedFreight] = useState<StandardFreightLot | null>(null);
  const availableCargoSpace = ship ? ship.CargoSpace - ship.CargoSpaceFilled : 0;
  {/* Compute the list of available freight lots */}
  const availableFreight = freight
    .slice() // Create a shallow copy to avoid mutating state
    .filter((item) => item.dTons <= availableCargoSpace) // Only show lots that fit
    .sort((a, b) => a.dTons - b.dTons); // Sort in ascending order by dTons
  //const [valueFreightList, setValueFreightList] = React.useState("")



  useEffect(() => {
    async function fetchShipData() {
      try {
        const response = await fetch(`${API_URL}/ShipData/${GAME_ID}/${SHIP_ID}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const jsonData = await response.json();
        const parsedData = ShipDataSchema.parse(jsonData.Data[0]);

        setShip(parsedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching ship data:", err);
      }
    }

    fetchShipData();
  }, []);


  useEffect(() => {
    async function fetchStandardFreight() {
      try {
        const response = await fetch(`${API_URL}/StandardFreight/${GAME_ID}/${SHIP_ID}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const jsonData = await response.json();
        const parsedData = StandardFreightResponseSchema.parse(jsonData);

        setFreight(parsedData.Data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching standard freight data:", err);
      }
    }

    fetchStandardFreight();
  }, []);


  async function handleLoadFreight() {
    if (!selectedFreight) return;
  
    try {
      const response = await fetch(`${API_URL}/LoadStandardFreight`, {
        method: "PATCH",
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          GameID: GAME_ID,
          ShipID: SHIP_ID,
          LotID: selectedFreight.LotID,
        }),
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const result = await response.json();
      console.log("Load Freight Response:", result.Data);
  
      // Handle success (optional: update UI, show confirmation, etc.)
      alert(`Freight Lot ${selectedFreight.LotID} loaded successfully!`);
      router.back();
    } catch (err) {
      console.error("Error loading freight:", err);
      alert("Failed to load freight. Please try again.");
    }
  }
  


  return (
    <div className="flex flex-col items-center p-6">
      <Card className="p-0 m-0 max-w-md">
        <CardHeader className="p-3">
          <CardTitle className="text-xl font-[orbitron] font-bold">
            Standard Freight
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col p-4 gap-4">
        <div className="flex flex-col gap-12">
            {ship?.PreparingForDeparture ? (
              <div className="flex flex-col gap-8 indent-5">
                <p>
                  The {ship?.ShipName} must declare its destination before the freight going to that system can be determined.
                </p>
                <Button onClick={() => router.push("/declaredestination")}>
                  Declare Destination
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {availableFreight.length === 0 ? (
                  <Label>There is no space available in the cargo bay for the standard freight available.</Label>
                ) : selectedFreight == null ? (
                  <Label>Choose which freight lot to load aboard the {ship?.ShipName}.</Label>
                ) : (
                  <Label>Click &quot;Load Freight&quot; to load the selected freight into the hold.</Label>
                )}

                <Label>Cargo Space: {availableCargoSpace}dTons</Label>
                {/* Freight Selection Popover */}
                <div className="mt-4">
                  <Popover open={openFreightList} onOpenChange={setOpenFreightList}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openFreightList}
                        className="w-[250px] justify-between"
                      >
                        {selectedFreight
                          ? `Lot ${selectedFreight.LotID}: ${selectedFreight.LotType} - ${selectedFreight.dTons} dTons`
                          : "Select Freight Lot"}
                        <ChevronsUpDown className="ml-2 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0">
                      <Command>
                        <CommandInput placeholder="Select freight lot..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No freight found.</CommandEmpty>
                          <CommandGroup>
                            {availableFreight.map((item) => (
                              <CommandItem
                                key={item.LotID}
                                value={item.LotID.toString()}
                                onSelect={() => {
                                  setSelectedFreight(item);
                                  setOpenFreightList(false);
                                }}
                              >
                                Lot {item.LotID}: {item.LotType} - {item.dTons} dTons
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    selectedFreight?.LotID === item.LotID ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
        <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-row gap-5 justify-end">
            <Button onClick={handleLoadFreight} disabled={!selectedFreight}>Load Freight</Button>
              <Button onClick={() => router.back()}>Cancel</Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}