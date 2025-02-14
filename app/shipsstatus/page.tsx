"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { z } from 'zod';
import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";  //I created traveller.config.ts to hold global environment variables.

/*=========================================================================================================================
ShipsStatus
Brennen Beck
January 30, 2025

Synopsis: This is the Ship's Status page that shows the basic situation on the ship and critical management information.

Description: 
  The Ship's Status page displays key information about the ship's situation and critical management data in a card-based 
layout. It uses ShadCN components such as Cards, Labels, and Inputs for consistency, and leverages a custom ShipField 
component to maintain consistent formatting across all fields. The layout adapts to different screen sizes, with the cards 
displayed in a row on larger screens and a single column on mobile devices. The page fetches ship data from an API endpoint 
and uses Zod for schema validation to ensure data integrity.

  The whole page is setup as ShadCN Cards with ShadCN labels and inputs that are combined into a custom component called 
ShipField. ShipField also gives a central location to maintain the formatting on the label/input elements and is constantly
reused here. There is some responsive design where the cards are in a row on a large screen and a single column on mobile. 
This page is read-only for now.  

Notes:

  Version 1.0 (1/30/2025-BB) - Original code.
===========================================================================================================================*/
// Define Zod Schema for API Validation
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

// Define TypeScript type from Zod schema
type ShipData = z.infer<typeof ShipDataSchema>;


export default function ShipsStatusPage() {
  const [ship, setShip] = useState<ShipData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShipData() {
      try {
        const response = await fetch(`${API_URL}/ShipData/${GAME_ID}/${SHIP_ID}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const jsonData = await response.json();
        const parsedData = ShipDataSchema.parse(jsonData.Data[0]); // Validate with Zod

        setShip(parsedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching ship data:", err);
      }
    }

    fetchShipData();
  }, []);

  return (
    <section className='flex flex-col py-14 md:m-7 px-2 md:py-0 lg:m-3 lg:px-20 '>
      <div className='text-xl font-[orbitron] font-bold p-1'>
        <h1>{ship?.ShipName || "Unknown Ship"}</h1>
      </div>
      <div>
        <p className='pl-7 mb-2'>   {/* Indent this line */}
          {ship?.PreparingForDeparture
            ? "The ship is preparing for departure. (Buy Goods)"
            : "The ship is unprepared for departure. (Sell Goods)"}
        </p>
      </div>


      {error ? (
        <p className="text-red-500 font-bold">Error: {error}</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
          {/* Status Card */}
          <Card className='font-[roboto] w-[380px] min-w-[320px]'>
            <CardTitle className='font-[orbitron] m-0 p-3 px-5'>Status</CardTitle>
            <CardContent className='m-0 px-2'>
              <ShipField label="Stardate" value={`${ship?.Day}, ${ship?.Year} - ${ship?.Time}`} />
              <ShipField label="Ship's Location" value={`${ship?.System}, (${ship?.SystemUWP})`} />
              <ShipField label="Destination" value={ship?.DeclaredDestination || "Unknown"} />
              <ShipField
                cssInput={ship?.FuelOnboard<10 ? "bg-red-600" : ""}
                label="Fuel Onboard"
                value={`${ship?.FuelOnboard} of ${ship?.FuelCapacity} (${
                  ship?.RefinedFuel ? "Refined" : "Unrefined"
                })`}
              />
              <ShipField
                label="Cargo Hold"
                value={`${ship?.CargoSpaceFilled} of ${ship?.CargoSpace} dTons Filled`}
              />
            </CardContent>
          </Card>

          {/* Finances */}
          <Card className='font-[roboto] w-[380px] min-w-[320px]'>
            <CardTitle className='font-[orbitron] m-0 p-3 px-5'>Finance</CardTitle>
            <CardContent className='m-0 px-2'>
              <ShipField label="Ship's Bank" value={`${ship?.ShipsBank?.toLocaleString()} Cr`} />
              <ShipField
                cssInput={ship?.MaintenanceDue <0 ? "bg-red-600 text-yellow-300" : ""}
                label="Last Maintenance"
                value={`${ship?.MaintenanceDay}, ${ship?.MaintenanceYear} (${
                  ship?.MaintenanceDue !== undefined
                    ? ship.MaintenanceDue < 0
                      ? `${Math.abs(ship.MaintenanceDue)} days ago`
                      : `Due in ${ship.MaintenanceDue} days`
                    : "Not Available"
                })`}
              />
              {/* The spaghetti code here is pretty much all to defend against null values comming in */}
              <ShipField    
                label="Ship's Mortgage"
                value={
                  ship?.MortgageYear !== null
                    ? `${ship?.MortgageDay}, ${ship?.MortgageYear} (${
                        ship?.MortgageDue == null
                          ? "Not Available"
                          : ship?.MortgageDue < 0
                          ? `${Math.abs(ship?.MortgageDue)} days ago`
                          : `In ${ship?.MortgageDue} days`
                      })`
                    : "The ship has no mortgage."
                }
              />
              <ShipField label="Payments Made" value={`${ship?.Payments} of 520`} />
              <ShipField label="Payment Amount" value={`${ship?.Mortgage} Cr`} />
            </CardContent>
          </Card>


          {/* Properties */}
          <Card className="font-[roboto]  w-[380px] min-w-[320px]">
            <CardTitle className="font-[orbitron] m-0 p-3 px-5">Properties</CardTitle>
            <CardContent className="m-0 px-4">
              <ShipField label="Hull Size" value={`${ship?.HullSize} dTons`} />
              <ShipField label="J-Drive" value={`J-${ship?.JDrive}`} />
            </CardContent>
          </Card>

          {/* Passengers */}
          <Card className="font-[roboto]  w-[380px] min-w-[320px]">
            <CardTitle className="font-[orbitron] m-0 p-3 px-5">Passengers</CardTitle>
            <CardContent className="m-0 px-4">
              <ShipField
                  label="Low Berth"
                  value={`${ship?.LowPassengers} of ${ship?.LowBerths}`}
                />
                <ShipField
                  label="Basic Passage"
                  value={`${ship?.BasicPassengers} of ${ship?.Basic}`}
                />
                <ShipField
                  label="Middle Passage"
                  value={`${ship?.MiddlePassengers} of ${ship?.Middle}`}
                />
                <ShipField
                  label="High Passage"
                  value={`${ship?.HighPassengers} of ${ship?.High}`}
                />
                <ShipField
                  label="Luxury Passage"
                  value={`${ship?.LuxuryPassengers} of ${ship?.Luxury}`}
                />
            </CardContent>
          </Card>

        </div>
      )}
    </section>
  );
}


// Reusable Field Component
function ShipField({ label, value, cssInput }: { label: string; value: string | number | undefined; cssInput?: string}) {
  return (
    <div className="flex flex-row items-center py-1 gap-2">
      <Label className="w-[33%] text-right">{label}</Label>
      <Input disabled placeholder={value ?? ""} className={"flex-1 "+ cssInput ? cssInput : ""} />
    </div>
  );
}

              