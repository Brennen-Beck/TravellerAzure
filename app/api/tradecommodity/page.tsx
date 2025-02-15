"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";
import { z } from "zod";


const ShipDataSchema = z.object({
  ShipName: z.string(),
  PreparingForDeparture: z.boolean(),
  Day: z.number(),
  Year: z.number(),
  Time: z.string(),
  System: z.string(),
  SystemUWP: z.string(),
  DeclaredDestination: z.string().nullable(),
  FuelOnboard: z.number(),
  FuelCapacity: z.number(),
  RefinedFuel: z.boolean(),
  CargoSpaceFilled: z.number(),
  CargoSpace: z.number(),
  ShipsBank: z.number(),
  MaintenanceDay: z.number(),
  MaintenanceYear: z.number(),
  MaintenanceDue: z.number(),
  MortgageYear: z.number().nullable(),
  MortgageDay: z.number().nullable(),
  MortgageDue: z.number().nullable(),
  Payments: z.number(),
  Mortgage: z.number().nullable(),
  HullSize: z.number(),
  JDrive: z.number(),
  LowBerths: z.number(),
  LowPassengers: z.number(),
  Basic: z.number(),
  BasicPassengers: z.number(),
  Middle: z.number(),
  MiddlePassengers: z.number(),
  High: z.number(),
  HighPassengers: z.number(),
  Luxury: z.number(),
  LuxuryPassengers: z.number(),
});

type ShipData = z.infer<typeof ShipDataSchema>;

const CargoTypeEnum = z.enum([
  "Speculative Freight",
  "Standard Freight",
  "Mail",
  "Spare Parts",
  "Vehicle",
  "Passengers as Cargo",
  "Misc"
]);

const CargoHoldSchema = z.object({
  CargoID: z.number(),
  CargoType: CargoTypeEnum,
  Description: z.string(),
  dTons: z.number(),
  ValuePerTon: z.number().nullable(),
  StandardTradeLot: z.number().nullable(),
});

type CargobayItem = z.infer<typeof CargoHoldSchema>;


export default function TradeCommodityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tradeType = searchParams.get("Type") || "Unknown";
  const tradeGood = searchParams.get("Good") || "Unknown";
  const offerId = searchParams.get("OfferID") || "Unknown";
  const dTonsInOffer = Number(searchParams.get("OffersDTons") || 0);
  const Price = Number(searchParams.get("PriceOffered") || 0);
  const [ship, setShip] = useState<ShipData | null>(null);
  const [cargo, setCargo] = useState<CargobayItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [UnitsToTrade, setUnitsToTrade] = useState<number>(0);
  const [openCombo, setOpenCombo] = React.useState(false)
  const [valueCombo, setValueCombo] = React.useState("")
  const [loading, setLoading] = useState<boolean>(false);

  const getMaxAddable = () => {
    if (!ship || dTonsInOffer === null) return 0;
    return Math.max(0, Math.min(Number(dTonsInOffer), Number(ship.CargoSpace - ship.CargoSpaceFilled)));
  };

  useEffect(() => {
    async function fetchShipData() {
      try {
        const response = await fetch(`${API_URL}/ShipData/${GAME_ID}/${SHIP_ID}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const jsonData = await response.json();
        const parsedData = ShipDataSchema.parse(jsonData.Data[0]);

        setShip(parsedData);
        setUnitsToTrade(getMaxAddable());
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error fetching ship data:", err);
      }
    }

    async function fetchCargo() {
      try {
        const response = await fetch(`${API_URL}/Cargo/${GAME_ID}/${SHIP_ID}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const jsonData = await response.json();
        console.log("Raw API Response:", jsonData);

        if (!jsonData?.Data || !Array.isArray(jsonData.Data)) {
          console.error("Invalid API Response Structure:", jsonData);
          return;
        }

        const validatedCargo = jsonData.Data.map((entry: any) => CargoHoldSchema.parse(entry));
        setCargo(validatedCargo);
      } catch (error) {
        console.error("Error fetching cargobay data:", error);
      }
    }

    fetchShipData();
    fetchCargo();
  });


  useEffect(() => {
    if (tradeType === "Buy" && ship) {
      const maxBuy = Math.min(Number(dTonsInOffer), ship.CargoSpace - ship.CargoSpaceFilled);
      setUnitsToTrade(maxBuy);
    }
  }, [tradeType, ship, dTonsInOffer]);

  useEffect(() => {
    if (tradeType === "Sell") {
      const selectedCargo = cargo.find((c) => c.CargoID.toString() === valueCombo);
      setUnitsToTrade(selectedCargo ? selectedCargo.dTons : 0);
    }
  }, [tradeType, valueCombo, cargo]);

  const handleBuy = async () => {
    if (tradeType !== "Buy" || UnitsToTrade < 1) return; // Ensure valid buy conditions

    setLoading(true); // Show loading state

    const payload = {
      GameID: GAME_ID,
      ShipID: SHIP_ID,
      OfferID: Number(offerId),
      dTonsToPurchase: UnitsToTrade,
    };

    try {
      const response = await fetch(`${API_URL}/SpeculativePurchase`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const responseData = await response.json();
      alert(`Purchase successful!\n`);
      router.push("/cargobay"); // Redirect to CargoBay page
    } catch (error) {
      console.error("Purchase failed:", error);
      alert(`Failed to complete purchase: ${error.message}`);
    } finally {
      setLoading(false); // Remove loading state
    }
  };

  const handleSell = async () => {
    if (tradeType !== "Sell" || UnitsToTrade < 1 || UnitsToTrade > selectedCargo.dTons) return; // Ensure valid buy conditions

    setLoading(true); // Show loading state

    const payload = {
      GameID: GAME_ID,
      ShipID: SHIP_ID,
      CargoId: selectedCargo.CargoID,
      OfferID: Number(offerId),
      dTonsToSell: UnitsToTrade,
    };

    try {
      const response = await fetch(`${API_URL}/SpeculativeSale`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const responseData = await response.json();
      alert(`Sale successful!\n`);
      router.push("/speculativeoffers"); // Redirect to previous page
    } catch (error) {
      console.error("Sale failed:", error);
      alert(`Failed to complete sale: ${error.message}`);
    } finally {
      setLoading(false); // Remove loading state
    }
  };



  const ShipsBank = new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(ship?.ShipsBank);
  const FormattedPrice =new Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(Price);

  const selectedCargo = cargo.find((c) => c.CargoID.toString() === valueCombo);

  return (
    <div className="flex flex-col items-center p-6">
      <Card className="p-0 m-0 max-w-md">
        <CardHeader className="p-3">
          <CardTitle className="text-xl font-[orbitron] font-bold">
            {tradeType}ing {tradeGood}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col p-4 gap-4">
          <div className="flex flex-row gap-12 ">
            <Label>Ship&apos;s Bank: {ShipsBank}Cr</Label>
            <Label>Cargo Space Free: {(ship?.CargoSpace - ship?.CargoSpaceFilled) ?? "Loading..."}</Label>
          </div>
          <div className="flex flex-row gap-10">
          <Label>ID: {offerId}</Label>
          <Label>dTons: {dTonsInOffer === null ? dTonsInOffer : "Unlimited"}</Label>

          <Label>Price Offered: {FormattedPrice}Cr</Label>
          </div>
          <div className="flex flex-row gap-2">
          <Input
            className="max-w-16"
            type="number"
            min={0}
            max={tradeType === "Sell" ? (selectedCargo ? selectedCargo.dTons : 0) : (ship ? Math.min(Number(dTonsInOffer), ship.CargoSpace - ship.CargoSpaceFilled) : 0)}
            value={UnitsToTrade}
            onChange={(e) => {
              const newValue = e.target.value.trim();
              setUnitsToTrade(newValue === "" ? 0 : parseInt(newValue, 10) || 0);
            }}
          />

            <Popover open={openCombo} onOpenChange={setOpenCombo}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                  {tradeType === "Sell" ? cargo.find((c) => c.CargoID.toString() === valueCombo)?.Description || "Select Cargo..." : tradeGood}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Select Commodity..." />
                  <CommandList>
                    <CommandEmpty>No commodity found.</CommandEmpty>
                    <CommandGroup>
                      {tradeType === "Sell"
                      ? cargo.map((item) => (
                          <CommandItem
                            key={item.CargoID}
                            value={item.CargoID.toString()}
                            onSelect={() => {
                              setValueCombo(item.CargoID.toString());
                              setOpenCombo(false);
                            }}>
                            <Check className={cn("mr-2 h-4 w-4", valueCombo === item.CargoID.toString() ? "opacity-100" : "opacity-0")} />
                            {`${item.CargoID} - ${item.Description} (${item.dTons} dTons, ${item.ValuePerTon}Cr/dTon)`}
                          </CommandItem>
                        ))
                      : (
                        <CommandItem value="1" onSelect={() => setOpenCombo(false)}>
                          {tradeGood}
                        </CommandItem>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-row">
            {tradeType === "Buy" ? 
            (
              <div>
                <Label>{tradeType}ing {UnitsToTrade}dTons of &quot;{tradeGood}&quot; at {FormattedPrice}Cr each for a total of {Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(UnitsToTrade*Price)}Cr. </Label>
              </div>
            )
            : ""}
            {selectedCargo && (
              <div className="flex flex-col text-sm gap-5 mt-4">
                <div>
                  Sell {UnitsToTrade} of {selectedCargo.dTons} dTons of cargo in Lot {selectedCargo.CargoID} &quot;{selectedCargo.Description}&quot; for {Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(Price)}Cr (purchased at {Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(selectedCargo.ValuePerTon)}Cr) each for a total of {Intl.NumberFormat("en-US", {style: "decimal", maximumFractionDigits: 0,}).format(UnitsToTrade*Price)}Cr.
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-row gap-5 justify-end">
              {tradeType === "Buy"?
              ( 
                <Button onClick={handleBuy} disabled={UnitsToTrade <1}>Buy</Button>
              )
              :(
                <Button onClick={handleSell} disabled={UnitsToTrade <1}>Sell</Button>
              )
              }
              <Button onClick={() => router.push('/speculativeoffers')}>Cancel</Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

