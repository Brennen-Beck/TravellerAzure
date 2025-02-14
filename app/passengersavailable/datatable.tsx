"use client";
import { useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SellTicketsDialog from "../components/SellTicketsDialog";
import CopyButton from "@/app/components/copybutton/page";
import { useRouter } from "next/navigation"; 
import { API_URL, GAME_ID, SHIP_ID } from "../traveller.config";


import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  ShipStatus: ShipData | null;
}


export function DataTable<TData, TValue>({
  columns,
  data,
  ShipStatus,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [sellDialogOpen, setSellDialogOpen] = useState(false); // Track dialog state
  const [error, setError] = useState<string | null>(null); // Track API error
  const [rolling, setRolling] = useState(false); // New state for button loading
  const router = useRouter();

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({        
    PassageName: true,
    PassengersAvailable: true,
    TotalRevenueEach: true,
    TicketPrice: true,
    Expenses: false,
    SoLExpense: false,
    Origin: true,
    Destination: true,
    OriginUWP: false,
    DestinationUWP: false,
    Day: false,
    Year: false,
    Time: false, // Representing TimeSpan as a string (e.g., "HH:mm:ss")
});



  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
    },
  })

  
  async function RollForPassengers(setError: (error: string | null) => void) {
    setError(null); // Clear any existing error
    setRolling(true); // Start loading
    const payload = { GameID: GAME_ID, ShipID: SHIP_ID };

    try {
      console.log(`RollForPassengers API call.`);
      const response = await fetch(`${API_URL}/RollForPassengers`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log("API Response Body:", responseData);

      setRolling(false);
      // If the response data doesn't start with "This API", then it's an error
      if (!responseData.Data.startsWith("This API")) {
        setError(responseData.Data); // Show error message
      }else
      {
        router.push("/passengersavailable");
      }
    } catch (err) {
      console.error("Error rolling for passengers:", err);
      setError("Failed to roll for passengers. Please try again.");
    }
  }

  return (
    <div>
      {/* Dialog Component */}
      <SellTicketsDialog open={sellDialogOpen} onClose={() => setSellDialogOpen(false)} PassengerClassData={data} ShipLevelData={ShipStatus}/>

      <div className="flex items-center py-1">
        <div className="flex items-center justify-between gap-16">
          <h1 className="text-xl font-[orbitron] font-bold mb-2 min-w-fit whitespace-nowrap">Passengers Available</h1>
          <div className="flex items-center flex-1 justify-center gap-2">
            <Label className="whitespace-nowrap font-[orbitron]">Declared Destination: {ShipStatus?.DeclaredDestination}</Label>
            {/*<Input disabled placeholder={ShipStatus?.DeclaredDestination} className="w-60" /> */}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Column Selection Menu */}
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter(
                    (column) => column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <CopyButton data={data} />        
          </div>
        </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
            <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" onClick={() => setSellDialogOpen(true)} disabled={data.length === 0}>  
              Sell Tickets
            </Button>
            {/* ShipStatus.DeclaredDestination should have a declared destination before you can Roll for Passengers and there's no point in rolling if you've already done so. */}
            {ShipStatus.DeclaredDestination == null ? 
            (
              <Button variant="outline" size="sm" onClick={() => router.push("/declaredestination")} disabled={false}> 
                Declare Destination
              </Button>
            ) 
            : (
              <Button variant="outline" size="sm" onClick={()=> RollForPassengers(setError)} disabled={data.length >0 || ShipStatus.DeclaredDestination === null  }> 
                Roll for Passengers
              </Button>
            )}
            
           
          </div>
        </div>
  )
}
