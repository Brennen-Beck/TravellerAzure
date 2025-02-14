"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";



export const columns: ColumnDef<SpeculativeTransactionData>[] = [
  {
    accessorKey: "SpeculativeTransactionId",
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
    accessorKey: "TradeGood",
    header: "Trade Good",
  },
  {
    accessorKey: "QuantityChange",
    header: "Quantity",
  },
  {
    accessorKey: "UnitValue",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Unit Value
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({row}) => {
      const UnitValueAmount = row.getValue("UnitValue");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(UnitValueAmount);
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
      const RevenueAmount = row.getValue("Revenue");
      if (RevenueAmount == null) {
        return <></>;
      }
      else
      {
        const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(RevenueAmount);
        return <div className="text-right">{formatted}</div>
      }
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
      const ExpenseAmount = row.getValue("Expense");
      if (ExpenseAmount == null) {
        return <></>;
      }
      else
      {
        const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(ExpenseAmount);
        return <div className="text-right">{formatted}</div>
      }
    },
  },
  {
    accessorKey: "StarSystem",
    header: "Star System",
  },
  {
    accessorKey: "Day",
    header: ()=> <div className="text-right">Day</div>,
    cell: ({row}) => {
      const DayOfTheYear = row.getValue("Day");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(DayOfTheYear);
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
];

