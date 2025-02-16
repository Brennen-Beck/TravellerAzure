"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";


export type PassengerClass = {
    PassageName: string;
    PassengersAvailable: number;
    TotalRevenueEach: number;
    TicketPrice: number;
    Expenses: number;
    SoLExpense: number;
    Origin: string;
    Destination: string;
    OriginUWP: string;
    DestinationUWP: string;
    Day: number;
    Year: number;
    Time: string; // Representing TimeSpan as a string (e.g., "HH:mm:ss")
    Description?: string | null;
  };
  
  export const columns: ColumnDef<PassengerClass>[] = [
    {
        accessorKey: "PassageName",
        header: "Passage",
    },
    {
        accessorKey: "PassengersAvailable",
        header: "Available",
    },
    {
        accessorKey: "TotalRevenueEach",
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
          cell: ({ getValue }) => {
            const TotalRevenue =getValue();
            const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof TotalRevenue === "number" ? TotalRevenue : 0); 
            return <div className="text-right">{formatted}</div>
          },
    },
    {
      accessorKey: "TicketPrice",
      header: ({ column }) => {
          return (
            <div className="text-right">
              <Button className="m-0 p-0"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Ticket Price
                <ArrowUpDown className="ml-1 h-2 w-2" />
              </Button>
            </div>
          )
        },
        cell: ({ getValue }) => {
          const TicketPrice =getValue();
          const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof TicketPrice === "number" ? TicketPrice : 0); 
          return <div className="text-right">{formatted}</div>
        },
    },
    {
      accessorKey: "Expenses",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button className="m-0 p-0"
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Expenses
              <ArrowUpDown className="ml-1 h-2 w-2" />
            </Button>
          </div>
        )
      },
      cell: ({ getValue }) => {
        const ExpenseValue =getValue();
        const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof ExpenseValue === "number" ? ExpenseValue : 0); 
        return <div className="text-right">{formatted}</div>
      },
    },
    {
        accessorKey: "SoLExpense",
        header: ({ column }) => {
          return (
            <div className="text-right">
              <Button className="m-0 p-0"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                SoL Expense
                <ArrowUpDown className="ml-1 h-2 w-2" />
              </Button>
            </div>
          )
        },
        cell: ({ getValue }) => {
          const SoLExpenseValue =getValue();
          const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof SoLExpenseValue === "number" ? SoLExpenseValue : 0); 
          return <div className="text-right">{formatted}</div>
        },
    },
    {
        accessorKey: "Origin",
        header: "Origin",
    },
    {
      accessorKey: "OriginUWP",
      header: "Origin UWP",
    },
    {
      accessorKey: "Destination",
      header: "Destination",
  },
  {
    accessorKey: "DestinationUWP",
    header: "Destination UWP",
  },
    {
        accessorKey: "Day",
        header: "Day",
    },
    {
        accessorKey: "Year",
        header: "Year",
    },
    {
        accessorKey: "Time",
        header: "Time",
    },
];    