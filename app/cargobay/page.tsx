import { DataTable } from "./datatable";
import { columns } from "./columns";
import { z } from "zod";
import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";

/*=========================================================================================================================
Cargobay
Brennen Beck
February 7, 2025

Synopsis: This page shows the contents of the ship's cargobay.

Description: 
  

Notes:
  Version 1.0 (2/7/2025-BB) - Initial implementation.
===========================================================================================================================*/
// Zod Schema for API Response Validation
// Define CargoType as an enum
const CargoTypeEnum = z.enum([
  "Speculative Freight",
  "Standard Freight",
  "Mail",
  "Spare Parts",
  "Vehicle",
  "Passengers as Cargo",
  "Misc"
]);

// Define the CargoHold schema
const CargoHoldSchema = z.object({
  CargoID: z.number(),                      // Unique identifier for cargo
  CargoType: CargoTypeEnum,                 // Cargo type (validated against predefined list)
  Description: z.string(),                   // Description of the cargo
  dTons: z.number(),                         // Cargo size in displacement tons
  ValuePerTon: z.number().nullable(),        // Value per ton (nullable in DB)
  StandardTradeLot: z.number().nullable(),   // Standard trade lot (nullable in DB)
});

// Define API response schema (array of CargoHold entries)
export const CargobaySchema = z.array(CargoHoldSchema);

// TypeScript type inferred from Zod schema
//export type CargoHold = z.infer<typeof CargoHoldSchema>;
export type CargobayItem = z.infer<typeof CargobaySchema>;



async function getData(): Promise<CargobayItem[]> {
  try{
      const response = await fetch(`${API_URL}/Cargo/${GAME_ID}/${SHIP_ID}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const jsonData = await response.json();
      console.log("Raw API Response:", jsonData); // Debugging
  
      if (!jsonData?.Data || !Array.isArray(jsonData.Data)) {
        console.error("Invalid API Response Structure:", jsonData);
        return [];
      }
  
      // Validate & Transform Data
      return jsonData.Data.map((entry: any) => {
        const validatedEntry = CargoHoldSchema.parse(entry);
        return {
            CargoID: validatedEntry.CargoID,
            CargoType: validatedEntry.CargoType,
            Description: validatedEntry.Description,
            dTons: validatedEntry.dTons,
            ValuePerTon: validatedEntry.ValuePerTon,
            StandardTradeLot: validatedEntry.StandardTradeLot,
        };
      });
    } catch (error) {
      console.error("Error fetching cargobay data:", error);
      return [];
    }
  }

export default async function CargobayPage() {
  const data = await getData();
  return (
        <>
          <section className='flex flex-col font-[roboto] m-3'>
            <div className="container mx-auto p-0">
              <DataTable columns={columns} data={data} />
            </div>
          </section>
        </>
  );
}


