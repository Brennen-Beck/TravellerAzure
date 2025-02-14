"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export type SpaceEncounter = {
  Encounter: string
  Rolled: number
  System: string
  UWP: string
  SectorID: number
  SystemID: number
  Day: number
  EncounterYear: number
  LoggedTime: string
  combinedDateTime: string // Added combinedDateTime as a field
}

export const columns: ColumnDef<SpaceEncounter>[] = [
  {
    accessorKey: "Encounter",
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Encounter
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: "Rolled",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rolled
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const rolledValue = row.getValue("Rolled")
      return <div className="text-right">{rolledValue}</div>
    },
  },
  {
    accessorKey: "System",
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            System
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: "UWP",
    header: "UWP",
  },
  {
    accessorKey: "combinedDateTime",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const combinedDateTime = row.getValue("combinedDateTime"); // Access precomputed field
      return <div className="text-right">{combinedDateTime}</div>; // Right-align the content
    },

  },
]
