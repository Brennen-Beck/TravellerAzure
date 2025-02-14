import { DataTable } from "./datatable";
import { columns } from "./columns";
import { z } from "zod";
import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";


/*=========================================================================================================================
Space Encounters
ChatGPT
February 12, 2025

Synopsis: This page shows the space encounters that have been logged as the ship has moved through space.

Description: Displays encounters information like the encounter type, system, rolled value, day, and time.

Notes:
  This code was written almost entirely by ChatGPT using the Cargo page as an example for it to follow. The supporting columns.tsx
was also written by ChatGPT separately with similar prompting. The dataTable file, so far, was a copy paste from cargobay's
datatable.tsx file. At first glance, this code appears to be working out of the box. Great job ChatGPT!

  Version 1.0 (2/12/2025-CG) - Initial implementation.

===========================================================================================================================*/

// Zod Schema for API Response Validation
export const SpaceEncounterSchema = z.object({
  Encounter: z.string(),                     // Name of the encounter
  Rolled: z.number(),                        // Rolled value for encounter
  System: z.string(),                        // The system where the encounter took place
  UWP: z.string(),                           // Universal World Profile code
  SectorID: z.number(),                      // Sector ID
  SystemID: z.number(),                      // System ID
  Day: z.number(),                           // Day of the year
  EncounterYear: z.number(),                 // Year of the encounter
  LoggedTime: z.string(),                    // Time the encounter was logged
});

// Define API response schema (array of SpaceEncounter entries)
export const SpaceEncountersSchema = z.array(SpaceEncounterSchema);

// TypeScript type inferred from Zod schema
export type SpaceEncounter = z.infer<typeof SpaceEncounterSchema>;

async function getData(): Promise<SpaceEncounter[]> {
  try {
    const response = await fetch(`${API_URL}/SpaceEncounters/${GAME_ID}/${SHIP_ID}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const jsonData = await response.json();
    console.log("Raw API Response:", jsonData); // Debugging

    if (!jsonData?.Data || !Array.isArray(jsonData.Data)) {
      console.error("Invalid API Response Structure:", jsonData);
      return [];
    }

    // Validate & Transform Data
    const transformedData = jsonData.Data.map((entry: any) => {
      const validatedEntry = SpaceEncounterSchema.parse(entry);
      const combinedDateTime = `${validatedEntry.EncounterYear}-${String(validatedEntry.Day).padStart(3, '0')} ${validatedEntry.LoggedTime}`;

      return {
        Encounter: validatedEntry.Encounter,
        Rolled: validatedEntry.Rolled,
        System: validatedEntry.System,
        UWP: validatedEntry.UWP,
        SectorID: validatedEntry.SectorID,
        SystemID: validatedEntry.SystemID,
        Day: validatedEntry.Day,
        EncounterYear: validatedEntry.EncounterYear,
        LoggedTime: validatedEntry.LoggedTime,
        combinedDateTime,
      };
    });

    // Sort the data by Year, Day, and Time to ensure chronological order
    const sortedData = transformedData.sort((a, b) => {
      if (a.EncounterYear !== b.EncounterYear) {
        return a.EncounterYear - b.EncounterYear; // Sort by year
      }
      if (a.Day !== b.Day) {
        return a.Day - b.Day; // Sort by day of the year
      }
      // Sort by time (HH:MM:SS)
      return a.LoggedTime.localeCompare(b.LoggedTime);
    });

    return sortedData;
    } catch (error) {
      console.error("Error fetching space encounters data:", error);
    return [];
  }
}

export default async function SpaceEncountersPage() {
  const data = await getData();
  return (
    <>
      <section className="flex flex-col font-[roboto] m-3">
        <div className="container mx-auto p-0">
          <DataTable columns={columns} data={data} />
        </div>
      </section>
    </>
  );
}
