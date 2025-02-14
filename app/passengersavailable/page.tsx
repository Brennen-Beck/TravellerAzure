import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";
import { DataTable } from "./datatable"
import { columns } from "./columns"
import { z } from "zod";

/*=========================================================================================================================
Speculative Offers
Brennen Beck
February 4, 2025

Synopsis: Roll for passengers, view passengers available, and sell tickets for passage.

Description: 

Notes:
  TanStack tables -   https://tanstack.com/table/latest
  
  Version 1.0 (2/4/2025-BB) - Original code.
===========================================================================================================================*/

// Define Zod schema to match the API response
const PassengerClassesSchema = z.object({
    PassageName: z.string(),
    PassengersAvailable: z.number(),
    TotalRevenueEach: z.number(),
    TicketPrice: z.number(),
    Expenses: z.number(),
    SoLExpense: z.number(),
    Origin: z.string(),
    Destination: z.string(),
    OriginUWP: z.string(),
    DestinationUWP: z.string(),
    Day: z.number(),
    Year: z.number(),
    Time: z.string(), // Representing TimeSpan as a string (e.g., "HH:mm:ss")
    Description: z.string().nullable(),
});

// Define TypeScript type from the updated schema
export type PassengerClass = z.infer<typeof PassengerClassesSchema>;


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
  export type ShipData = z.infer<typeof ShipDataSchema>;
  

async function getData(): Promise<{PassengerData: PassengerClass[]; ShipStatusData: ShipData | null}> {
  try {
    const response = await fetch(`${API_URL}/PassengersAvailable/${GAME_ID}/${SHIP_ID}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const PassengerJSON = await response.json();
    console.log("Raw API Response:", PassengerJSON); // Debugging

    if (!PassengerJSON?.Data || !Array.isArray(PassengerJSON.Data)) {
      console.error("Invalid API Response Structure:", PassengerJSON);
      return { PassengerData: [], ShipStatusData: null};
    }

    // Validate & Transform Passenger Data
    const PassengerData = PassengerJSON.Data.map((entry: any) => {
    try {
        return PassengerClassesSchema.parse(entry);
    } catch (error) {
        console.error("Invalid Passenger Data:", entry, error);
        return null; // Filter out invalid entries
    }
    }).filter((entry): entry is PassengerClass => entry !== null); // Remove null entries
  

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
    
    
    // Validate & Transform Data
    return {PassengerData, ShipStatusData};
  } catch (error) {
    console.error("Error fetching passengers available:", error);
    return { PassengerData: [], ShipStatusData: null};
  }
}
 


export default async function PassengersPage() {
  const {PassengerData, ShipStatusData} = await getData();
return (
    <>
    <section className='flex flex-col font-[roboto] m-2.5'> 
      <div className="container mx-auto p-0">
        <DataTable columns={columns} data={PassengerData} ShipStatus={ShipStatusData} />
      </div>
    </section>
    </>
  );
}
