import { DataTable } from "./datatable";
import { columns } from "./columns";
import { z } from "zod";
import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";

/*=========================================================================================================================
Speculative Transactions
Brennen Beck
February 3, 2025

Synopsis: Displays a table of speculative trade transactions for the user's ship.

Description: 
  This page fetches and displays speculative trade transactions using a TanStack table with sorting and pagination.

  I initially had ChatGPT code this, but it was so bad that I ended up rewritting 100% of it. ChatGPT's code "mostly" worked but
there were a whole slew of minor issues with it not the least of which was that it didn't follow the ui/ux design specified. I
started making minor tweaks to the code until I had pretty much rewritten the entire thing. I had hopes that ChatGPT would have
aced this one because this code is almost a copy paste from the Speculative Offers code. I gave ChatGPT that code as an example 
of what I wanted and it still decided to do its own thing instead of following the example given, which was a big part of why
visually the UI/UX was completely off from the rest of the site.

  This code is mostly just a table that displays the SQL Server stored procedure usp_SpeculativeTransactions which is provided
through an ASP.Net API. This code is pure user interface with no other logic.


Notes:
  Version 1.0 (2/3/2025-BB) - Initial implementation.
===========================================================================================================================*/

// Zod Schema for API Response Validation
const SpeculativeTransactionSchema = z.object({
  SpeculativeTransactionId: z.number(),
  Day: z.number(),
  Year: z.number(),
  Time: z.string(),
  TradeGood: z.string(),
  QuantityChange: z.number(),
  UnitValue: z.number(),
  Revenue: z.number().nullable(),
  Expense: z.number().nullable(),
  StarSystem: z.string(),
});


// Type Definitions
type SpeculativeTransaction = z.infer<typeof SpeculativeTransactionSchema>;



async function getData(): Promise<SpeculativeTransaction[]> {
  try{
      const response = await fetch(`${API_URL}/SpeculativeTransactions/${GAME_ID}/${SHIP_ID}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const jsonData = await response.json();
      console.log("Raw API Response:", jsonData); // Debugging
  
      if (!jsonData?.Data || !Array.isArray(jsonData.Data)) {
        console.error("Invalid API Response Structure:", jsonData);
        return [];
      }
  
      // Validate & Transform Data
      return jsonData.Data.map((entry: any) => {
        const validatedEntry = SpeculativeTransactionSchema.parse(entry);
        return {
          SpeculativeTransactionId: validatedEntry.SpeculativeTransactionId,
          Day: validatedEntry.Day,
          Year: validatedEntry.Year,
          Time: validatedEntry.Time,
          TradeGood: validatedEntry.TradeGood,
          QuantityChange: validatedEntry.QuantityChange,
          UnitValue: validatedEntry.UnitValue,
          Revenue: validatedEntry.Revenue,
          Expense: validatedEntry.Expense,
          StarSystem: validatedEntry.StarSystem,
        };
      });
    } catch (error) {
      console.error("Error fetching speculative offers:", error);
      return [];
    }
  }

export default async function SpeculativeTransactionsPage() {
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


