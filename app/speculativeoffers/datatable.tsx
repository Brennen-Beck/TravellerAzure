"use client"
import { useState, useEffect } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation"; 
import CopyButton from "@/app/components/copybutton/page";
import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";
import { ShipData } from "./page";


import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
  const router = useRouter(); // Initialize the router
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 23, //default page size
  });
  const [isOnlineDisabled, setIsOnlineDisabled] = useState(true);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({        
    OfferId: false,
    TradeGood: true,
    BasePrice: true,
    dTonsAvailable: true,
    Price: true,
    Percent: true,
    StarSystem: false,
    UWP: false,
    Day: false,
    Year: false,
    Time: false,
    OfferType: false,
});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    enableMultiRowSelection: false, //only allow a single row to be selected at once
    enableRowSelection: true,
    state: {
      pagination,
      sorting,
      columnVisibility,
    },
  })

  
    const [searchType, setSearchType] = useState("option-standard"); // Default value
    const FormattedShipsBank = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(ShipStatus && typeof ShipStatus.ShipsBank === "number" ? ShipStatus.ShipsBank : 0);
  // Determine if the Online option should be disabled
  // Use useEffect to update isOnlineDisabled when the component mounts or when ShipStatus changes
  useEffect(() => {
    if (ShipStatus) {
      const uwpHexChar = ShipStatus.SystemUWP?.charAt(7); // Get 8th character (0-based index)
      const uwpDecimalValue = uwpHexChar ? parseInt(uwpHexChar, 16) : 0;
      setIsOnlineDisabled(uwpDecimalValue < 8);
    }
  }, [ShipStatus]); // Only run when ShipStatus changes or when the component mounts

  // Update the searchType when isOnlineDisabled changes
  useEffect(() => {
    setSearchType(isOnlineDisabled ? "option-standard" : "option-online");
  }, [isOnlineDisabled]); // This effect runs when isOnlineDisabled changes

  // Handle search type change
  const handleSearchTypeChange = (value: string) => {
    //console.log("Selected Search Type:", value);
    setSearchType(value);
  };


  // Convert search type to API parameter
  const getSkillUsed = (type: string) => {
    switch (type) {
      case "option-standard": return "B";
      case "option-online": return "A";
      case "option-illegal": return "S";
      default: return "B";
    }
  };

  // Determine Offer Type (B=Buying, S=Selling)
  const offerType = ShipStatus?.PreparingForDeparture ? "B" : "S";


   // API call function
   const findOffer = async () => {
    const skillUsed = getSkillUsed(searchType);
    const apiUrl = `${API_URL}/FindBrokerOffer`;

    const payload = {
      GameID: GAME_ID,
      ShipID: SHIP_ID,
      SkillUsed: skillUsed,
      OfferType: offerType,
    };

    console.log("Sending request:", payload);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      // Handle response (no data is expected, but we might log it for debugging)
      if (response.ok) {
        alert("Broker offer request sent successfully!");
        window.location.reload(); // Full page refresh
      } else {
        console.error("API Error:", responseData);
        alert(`Error: ${responseData.Data || "Unknown error occurred"}`);
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Failed to contact the API.");
    }
  };

  return (
    <div>
      <div className="flex items-center py-1">
        <div className="flex items-center justify-between gap-16">
          <h1 className="text-xl font-[orbitron] font-bold p-1">Speculative Offers</h1>
          <Label className="whitespace-nowrap font-[orbitron] font-light pt-1">{ShipStatus && ShipStatus.PreparingForDeparture ? "Buying Cargo" : "Selling Cargo"}</Label>
          <Label className="whitespace-nowrap font-[orbitron] font-light pt-1">Ship&apos;s Bank: {FormattedShipsBank}Cr</Label>
          <Label className="whitespace-nowrap font-[orbitron] font-light pt-1">Offers Persued: { ShipStatus && ShipStatus.PreparingForDeparture ? ShipStatus.BuyBrokerAttempts : ShipStatus?.SellBrokerAttempts}</Label>
        </div>
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
      <div className="flex flex-row justify-between p-0 m-0">
        <div className="flex items-center justify-end p-0 m-0 gap-9">
          <Button variant="outline" size="sm" onClick={() => router.push('/cargobay')}>
            Cargo Hold
          </Button>
          <Card className="flex flex-row h-8" >
            <CardTitle className="text-sm pl-3 font-light">Search Type</CardTitle>
            <CardContent className="px-4" >
              <div className="flex flex-row gap-3">
                <RadioGroup value={searchType} defaultValue={isOnlineDisabled ? "option-standard" : "option-online"} onValueChange={handleSearchTypeChange}>
                  <div className="flex flex-row gap-3">
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="option-standard" id="option-standard"/>
                      <Label htmlFor="option-standard">Standard</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="option-online" id="option-online" disabled={isOnlineDisabled}/>
                      <Label htmlFor="option-online" className={isOnlineDisabled ? "text-background": ""} >Online</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="option-illegal" id="option-illegal" disabled={true}/>
                      <Label htmlFor="option-illegal" className={true ? "text-background": ""} >Illegal</Label>
                    </div>
                  </div>
                </RadioGroup>
                <Button variant="outline" size="sm" className="mt-1 py-2 h-6" onClick={findOffer}>
                  Find Offer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center justify-end space-x-2 py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
        </div>
      </div>
    </div>
  )
}
