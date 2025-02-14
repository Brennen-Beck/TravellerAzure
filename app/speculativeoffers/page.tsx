import { useState } from "react";
import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";
import { DataTable } from "./datatable"
import { columns } from "./columns"
import { z } from "zod";

/*=========================================================================================================================
Speculative Offers
Brennen Beck
February 1, 2025

Synopsis: The primary Trade window that supports buying and selling of commodities.

Description: 
  Most of the code for this is actually in the columns.tsx and datatable.tsx, not to mention the components/ui/table.tsx ShadCN
component. In short, there's currently nothing on the page except a table which is a TanStack table.  

Notes:
  TanStack tables -   https://tanstack.com/table/latest
  
  Version 1.0 (2/1/2025) - Original code.
===========================================================================================================================*/

// Define Zod schema to match the API response
const OfferSchema = z.object({
  OfferId: z.number(),  // Changed from "id"
  TradeGood: z.string(),
  BasePrice: z.number(),
  dTonsAvailable: z.number().nullable(), // Changed from "dTons"
  Price: z.number(),
  Percent: z.number(),
  StarSystem: z.string(),
  UWP: z.string(),
  Day: z.number(),
  Year: z.number(),
  Time: z.string(),
  OfferType: z.enum(["Buy", "Sell"]),
  Attempt: z.number(),
});

// Define TypeScript type from the updated schema
type Offer = z.infer<typeof OfferSchema>;

const ShipDataSchema = z.object({
  ShipName: z.string(),
  HullSize: z.number(),
  JDrive: z.number(),
  FuelCapacity: z.number(),
  FuelOnboard: z.number(),
  RefinedFuel: z.boolean(),
  ShipsBank: z.number(),
  Day: z.number(),
  Year: z.number(),
  Time: z.string(),
  CargoSpaceFilled: z.number(),
  CargoSpace: z.number(),
  System: z.string(),
  SystemUWP: z.string(),
  CrewStandardOfLiving: z.number(),
  PassengersStandardOfLiving: z.number(),
  MaintenanceDay: z.number(),
  MaintenanceYear: z.number(),
  MaintenanceDue: z.number(),
  Mortgage: z.number().nullable(),
  Payments: z.number(),
  MortgageDay: z.number().nullable(),
  MortgageYear: z.number().nullable(),
  MortgageDue: z.number().nullable(),
  BuyBrokerAttempts: z.number(),
  SellBrokerAttempts: z.number(),
  PreparingForDeparture: z.boolean(),
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
  DeclaredDestination: z.string().nullable(),  
  DeclaredDestinationSector: z.number().nullable(),
  DeclaredDestinationSystem: z.number().nullable(),
});

// Define TypeScript type from Zod schema
export type ShipData = z.infer<typeof ShipDataSchema>;



async function getData(): Promise<{OfferData: Offer[]; ShipStatusData: ShipData | null}> {
  
  try {
    const response = await fetch(`${API_URL}/SpeculativeOffers/${GAME_ID}/${SHIP_ID}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const OfferJSON = await response.json();
    console.log("Raw API Response:", OfferJSON); // Debugging

    if (!OfferJSON?.Data || !Array.isArray(OfferJSON.Data)) {
      console.error("Invalid API Response Structure:", OfferJSON);
      return {OfferData: [], ShipStatusData: null};
    }

    // Validate & Transform Offer Data
    const OfferData = OfferJSON.Data.map((entry: any) => {
    try {
        return OfferSchema.parse(entry);
    } catch (error) {
        console.error("Invalid Offer Data:", entry, error);
        return null; // Filter out invalid entries
    }
    }).filter((entry): entry is Offer => entry !== null); // Remove null entries

    // Fetch Ship Data
    let ShipStatusData: ShipData | null = null;
    try {
        const ShipResponse = await fetch(`${API_URL}/ShipData/${GAME_ID}/${SHIP_ID}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${ShipResponse.status}`);

        const ShipJSON = await ShipResponse.json();
        ShipStatusData = ShipJSON?.Data?.length ? ShipDataSchema.parse(ShipJSON.Data[0]) : null;
    } catch (err) {
      console.error("Error fetching ship data:", err);
    }
  return {OfferData, ShipStatusData};
  } catch (error) {
    console.error("Error fetching speculative offers:", error);
    return {OfferData: [], ShipStatusData: null};
  }
}
 

export default async function SpeculativeOffersPage() {
  const {OfferData, ShipStatusData} = await getData();


return (
    <>
    <section className='flex flex-col font-[roboto] m-2.5'> 
      <div className="container mx-auto p-0">
        <DataTable columns={columns} data={OfferData} ShipStatus={ShipStatusData}/>
      </div>
      <h1>{}</h1>
    </section>
    </>
  );
}
