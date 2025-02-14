import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";
import { DataTable } from "./datatable"
import { columns } from "./columns"
import { z } from "zod";


// Define Zod schema to match the API response
const LedgerEntrySchema = z.object({
  BankTransactionId: z.number(),  // Changed from "id"
  Day: z.number(),
  Year: z.number(),
  Time: z.string(),
  Description: z.string(),
  RunningTotal: z.number(),
  Revenue: z.number().nullable(),
  Expense: z.number().nullable(),
  StarSystem: z.string(),
  SystemUWP: z.string(),
});

// Define TypeScript type from the updated schema
type LedgerEntry = z.infer<typeof LedgerEntrySchema>;

async function getData(): Promise<LedgerEntry[]> {
  try {
    const response = await fetch(`${API_URL}/ShipsLedger/${GAME_ID}/${SHIP_ID}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const jsonData = await response.json();
    console.log("Raw API Response:", jsonData); // Debugging

    if (!jsonData?.Data || !Array.isArray(jsonData.Data)) {
      console.error("Invalid API Response Structure:", jsonData);
      return [];
    }

    // Validate & Transform Data
    return jsonData.Data.map((entry: any) => {
      const validatedEntry = LedgerEntrySchema.parse(entry);
      return {
        BankTransactionId: validatedEntry.BankTransactionId,  // Renaming OfferId to id
        day: validatedEntry.Day,
        year: validatedEntry.Year,
        time: validatedEntry.Time,
        description: validatedEntry.Description,
        runningTotal: validatedEntry.RunningTotal,
        revenue: validatedEntry.Revenue,
        expense: validatedEntry.Expense,
        starSystem: validatedEntry.StarSystem,
        uwp: validatedEntry.SystemUWP,
      };
    });
  } catch (error) {
    console.error("Error fetching speculative offers:", error);
    return [];
  }
}
 

export default async function ShipsLedgerPage() {
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
