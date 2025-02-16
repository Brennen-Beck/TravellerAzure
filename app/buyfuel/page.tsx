"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";



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



export default function BuyFuelPage() {
    const [ship, setShip] = useState<ShipData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fuelToBuy, setFuelToBuy] = useState<number>(0);
    const [fuelType, setFuelType] = useState<string>("option-unrefined");
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        async function fetchShipData() {
          try {
            const response = await fetch(`${API_URL}/ShipData/${GAME_ID}/${SHIP_ID}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            const jsonData = await response.json();
            const parsedData = ShipDataSchema.parse(jsonData.Data[0]);
    
            setShip(parsedData);
          } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
            console.error("Error fetching ship data while buying fuel:", err);
          }
        }

    fetchShipData();
    }, []);


    // Compute max fuel purchaseable
    const maxFuelPurchase = ship ? ship.FuelCapacity - ship.FuelOnboard : 0;

    // Determine if refined fuel is available
    const starportClass = ship?.SystemUWP?.[0] || "";
    const refinedAvailable = starportClass === "A" || starportClass === "B";
    const unrefinedAvailable = starportClass === "A" || starportClass === "B" || starportClass === "C" || starportClass === "D";

    useEffect(() => {
        if (ship) {
            // Set default fuel amount
            setFuelToBuy(maxFuelPurchase);
            // Set default fuel type
            setFuelType(refinedAvailable ? "option-refined" : "option-unrefined");
        }
    }, [ship]);

    
    const handleBuyFuel = async () => {
        if (fuelToBuy < 1) return; // Prevent API call with invalid amount
    
        setLoading(true); // Show loading state
    
        const payload = {
          GameID: GAME_ID,
          ShipID: SHIP_ID,
          dTonsOfFuel: fuelToBuy,
          BuyRefined: fuelType === "option-refined",
        };
    
        try {
          const response = await fetch(`${API_URL}/BuyFuel`, {
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
          alert(`Fuel purchase successful!\n`);
          router.push("/shipsstatus"); // Redirect after successful purchase
        } catch (error) {
          setError(error instanceof Error ? error.message : "An unknown error occurred");

          console.error("Fuel purchase failed:", error);
          alert(`Failed to purchase fuel: ${error}`);
        } finally {
          setLoading(false); // Remove loading state
        }
      };

    return (
      <section className="flex flex-col items-center min-h-screen py-14 w-full">

            <Card className="p-0 px-1 m-0 max-w-full md:min-w-[460px]">
                <CardHeader className="m-0 px-4 py-2">
                    <CardTitle className="text-xl font-[orbitron] font-bold">
                        Buy Fule
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row justify-center p-0 gap-2">
                    {/* Ship Fuel Details */}
                    <Card>
                        <CardHeader className="m-0 px-2 py-2">
                            Ship&apos;s Fuel
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 py-2 pl-5">
                            <Label>Fuel Capacity: {ship?.FuelCapacity}</Label>
                            <Label>Fuel Onboard: {ship?.FuelOnboard}</Label>
                            <Label>Fuel Type: {ship?.RefinedFuel === true ? "Refined" : "Unrefined"}</Label>
                        </CardContent>
                    </Card>
                    {/* Purchase Panel */}
                    <Card className="">
                        <CardHeader className="m-0 px-2 p-2">
                            Purchase
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row gap-0 m-0 p-1">
                            <Input
                                className="max-w-14 min-w-14 m-2"
                                type="number"
                                min={0}
                                max={maxFuelPurchase}
                                value={fuelToBuy}
                                onChange={(e) => {
                                const newValue = Math.max(0, Math.min(maxFuelPurchase, parseInt(e.target.value, 10) || 0));
                                setFuelToBuy(newValue);
                                }}
                            />
                            <div className="w-full flex flex-row justify-center">
                            <Card className="flex-grow min-w-10 md:min-w-40">
                                <CardHeader className="m-0 px-2 py-1">
                                    Fuel Type
                                </CardHeader>
                                <CardContent>
                                <RadioGroup value={fuelType} onValueChange={setFuelType}>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center space-x-1">
                                            <RadioGroupItem value="option-unrefined" id="option-unrefined" disabled={!unrefinedAvailable}/>
                                            <Label htmlFor="option-unrefined">Unrefined</Label>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <RadioGroupItem value="option-refined" id="option-refined" disabled={!refinedAvailable} />
                                            <Label htmlFor="option-refined" className={refinedAvailable ? "" : "text-muted-foreground"}>Refined</Label>
                                        </div>
                                    </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                            </div>
                        </CardContent>
                        <CardFooter className="p-3 pl-7">
                            <Label>Starport Class: {ship?.SystemUWP[0]}</Label>
                        </CardFooter>
                    </Card>
                </CardContent>
                {/* Action Buttons */}
                <div className="flex flex-row justify-end m-0 p-0">
                    <CardFooter className="gap-3 m-0 p-2">
                        <Button onClick={handleBuyFuel} disabled={fuelToBuy < 1 || loading || !unrefinedAvailable}>
                            {loading ? "Processing..." : "Buy Fuel"}
                        </Button>
                        <Button onClick={() => router.back()}>Cancel</Button>
                    </CardFooter>
                </div>
            </Card>
   
      </section>
    );
  }