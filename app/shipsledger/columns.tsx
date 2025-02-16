"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";


export type LedgerEntry = {
  BankTransactionId: number;
  Day: number;
  Year: number;
  Time: string;
  Description: string;
  RunningTotal: number;
  Revenue: number | null;
  Expense: number | null;
  StarSystem: string;
  SystemUWP: string;
};


export const columns: ColumnDef<LedgerEntry>[] = [
  {
    accessorKey: "BankTransactionId",
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: "Day",
    header: ()=> <div className="text-right">Day</div>,
    cell: ({row}) => {
      const DayOfTheYear = row.getValue("Day");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof DayOfTheYear === "number" ? DayOfTheYear : 0);
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "Year",
    header: "Year",
  },
  {
    accessorKey: "Time",
    header: "Time",
  },
  {
    accessorKey: "Description",
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: "RunningTotal",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Running Total
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({row}) => {
      const RunningTotal = row.getValue("RunningTotal");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof RunningTotal === "number" ? RunningTotal : 0);
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "Revenue",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Revenue
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({row}) => {
      const Revenue = row.getValue("Revenue");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof Revenue === "number" ? Revenue : 0);
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "Expense",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Expense
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({row}) => {
      const Expense = row.getValue("Expense");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof Expense === "number" ? Expense : 0);
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "StarSystem",
    header: "Star System",
  },
  {
    accessorKey: "SystemUWP",
    header: "UWP",
  },

];