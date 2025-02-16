"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";


export type CargoData ={
  CargoID: number,
  CargoType: string,
  Description: string,
  dTons: number,
  ValuePerTon: number | null,
  StandardTradeLot: number | null,
};

export const columns: ColumnDef<CargoData>[] = [
  {
    accessorKey: "CargoID",
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
    accessorKey: "Description",
    header: "Description",
  },
  {
    accessorKey: "CargoType",
    header: "Cargo Type",
  },
  {
    accessorKey: "dTons",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            dTons
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({row}) => {
      const TonnageAmount = row.getValue("dTons");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof TonnageAmount === "number" ? TonnageAmount : 0);
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "ValuePerTon",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Value per dTon
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({row}) => {
      const ValuePerTonAmount = row.getValue("ValuePerTon");
      if (ValuePerTonAmount == null) {
        return <></>;
      }
      else
      {
        const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof ValuePerTonAmount === "number" ? ValuePerTonAmount : 0);
        return <div className="text-right">{formatted}</div>
      }
    },
  },
  {
    accessorKey: "StandardTradeLot",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Trade Lot
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({row}) => {
      const StandardTradeLotAmount = row.getValue("StandardTradeLot");
      if (StandardTradeLotAmount == null) {
        return <></>;
      }
      else
      {
        const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof StandardTradeLotAmount === "number" ? StandardTradeLotAmount : 0);
        return <div className="text-right">{formatted}</div>
      }
    },
  },
  
];

