"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";


export type Offer = {
  OfferId: number;
  TradeGood: string;
  BasePrice: number;
  dTonsAvailable: number | null;
  Price: number;
  Percent: number;
  StarSystem: string;
  UWP: string;
  Day: number;
  Year: number;
  Time: string;
  OfferType: "Buy" | "Sell";
  Attempt: number;
};


export const columns: ColumnDef<Offer>[] = [
  {
    accessorKey: "OfferId",
    header: "ID",
  },
  {
    accessorKey: "TradeGood",
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Trade Goods
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: "Percent",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            %
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({row}) => {
      const Percentage = row.getValue("Percent");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof Percentage === "number" ? Percentage : 0);
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "Price",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({row}) => {
      const CommodityPrice = row.getValue("Price");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof CommodityPrice === "number" ? CommodityPrice : 0);
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "BasePrice",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Base Price
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({row}) => {
      const BasePrice = row.getValue("BasePrice");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof BasePrice === "number" ? BasePrice : 0);
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "dTonsAvailable",
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
    cell: ({ getValue }) => {
      const tons =getValue();
      const formatted = tons !=null ? new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof tons === "number" ? tons : 0) : "N/A"; // Handle null values
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "StarSystem",
    header: "Star System",
  },
  {
    accessorKey: "UWP",
    header: "UWP",
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
    accessorKey: "OfferType",
    header: "Offer Type",
  },
  {
    accessorKey: "Attempt",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Attempt
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({row}) => {
      const AttemptNumber = row.getValue("Attempt");
      const formatted = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(typeof AttemptNumber === "number" ? AttemptNumber : 0);
      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "Trade",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button className="m-0 p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Trade
            <ArrowUpDown className="ml-1 h-2 w-2" />
          </Button>
        </div>
      )
    },
    cell: ({row}) => {
        const TransactionType=String(row.getValue("OfferType"));
        const Commodity =String(row.getValue("TradeGood"));
        const IDOfOffer =Number(row.getValue("OfferId"));
        const dTonsInOffer = Number(row.getValue("dTonsAvailable"));
        const OfferPrice =Number(row.getValue("Price"));
        const router = useRouter();
        
        const handleNavigate = () => {
          const query = new URLSearchParams({
            Type: TransactionType,
            Good: Commodity,
            OfferID: IDOfOffer.toString(),
            OffersDTons: dTonsInOffer.toString(),
            PriceOffered: OfferPrice.toString(),
          }).toString();
  
          router.push(`/api/tradecommodity?${query}`);
        };

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-4 w-8 p-0 text-background bg-foreground">
                ...
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem  onClick={handleNavigate}>
                {TransactionType+" "+Commodity}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
];