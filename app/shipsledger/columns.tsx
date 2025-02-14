"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";


export type LedgerEntry = {
  BankTransactionId: number;
  day: number;
  year: number;
  time: string;
  description: string;
  runningTotal: number;
  revenue: number;
  expense: number;
  starSystem: string;
  uwp: string;
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
    accessorKey: "day",
    header: ()=> <div className="text-right">Day</div>,
    cell: ({row}) => {
      const DayOfTheYear = row.getValue("day");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(DayOfTheYear);
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "description",
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
    accessorKey: "runningTotal",
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
      const RunningTotal = row.getValue("runningTotal");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(RunningTotal);
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "revenue",
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
      const Revenue = row.getValue("revenue");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(Revenue);
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "expense",
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
      const Expense = row.getValue("expense");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(Expense);
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "starSystem",
    header: "Star System",
  },
  {
    accessorKey: "uwp",
    header: "UWP",
  },

];