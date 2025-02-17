"use client"; // Convert to a Client Component

import { useState, useEffect } from "react";
import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";
import { DataTable } from "./datatable";
import { columns } from "./columns";
import { z } from "zod";



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


export default function SpeculativeOffersPage() {
  const [offerData, setOfferData] = useState<Offer[]>([]);
  const [shipStatusData, setShipStatusData] = useState<ShipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount and when needed
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch speculative offers
        const offerResponse = await fetch(`${API_URL}/SpeculativeOffers/${GAME_ID}/${SHIP_ID}`, { cache: "no-store" });
        if (!offerResponse.ok) throw new Error(`HTTP error! Status: ${offerResponse.status}`);
        const offerJson = await offerResponse.json();

        // Validate & transform Offer Data
        const offers = offerJson.Data?.map((entry: any) => OfferSchema.parse(entry)) || [];
        setOfferData(offers);

        // Fetch ship data
        const shipResponse = await fetch(`${API_URL}/ShipData/${GAME_ID}/${SHIP_ID}`, { cache: "no-store" });
        if (!shipResponse.ok) throw new Error(`HTTP error! Status: ${shipResponse.status}`);
        const shipJson = await shipResponse.json();

        const shipData = shipJson.Data?.length ? ShipDataSchema.parse(shipJson.Data[0]) : null;
        setShipStatusData(shipData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []); // Runs only once on component mount

  return (
    <section className="flex flex-col font-[roboto] m-2.5">
      <div className="container mx-auto p-0">
        {loading ? <p>Loading offers...</p> : <DataTable columns={columns} data={offerData} ShipStatus={shipStatusData} />}
        {error && <p className="text-red-500">Error: {error}</p>}
      </div>
    </section>
  );
}
