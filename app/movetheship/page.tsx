"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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


export default function MoveTheShipPage() {
    const [ship, setShip] = useState<ShipData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null); 
    const router = useRouter();


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
    

    const handleMoveTheShip = async () => {
            setLoading(true);

            const payload = {
                GameID: GAME_ID,
                ShipID: SHIP_ID,
            };
    
            try {
                const response = await fetch(`${API_URL}/MoveTheShip`, {
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
    
                alert(`Welcome to ${ship?.DeclaredDestination}!`);
                router.push("/shipsstatus"); 
            } catch (error) {
                console.error("Failed to move the ship:", error);
                alert(`Error: ${error}`);
            } finally {
                setLoading(false);
            }
        };
    
    


    return (
        <section className="flex flex-col items-center min-h-screen py-14 w-full">
            <Card className="p-0 px-1 m-0 max-w-full md:max-w-md md:min-w-[460px]">
                <CardHeader className="m-0 px-4 py-2">
                    <CardTitle className="text-xl font-[orbitron] font-bold">
                        Move the Ship
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center px-10 py-4">
                    <div>
                        <p>Are you sure you are ready for the {ship?.ShipName} to make the jump to {ship?.DeclaredDestination}?</p>
                    </div>
                </CardContent>
                {/* Action Buttons */}
                <div className="flex flex-row justify-end m-0 p-0">
                    <CardFooter className="gap-4 m-0 p-2">
                        <Button onClick={handleMoveTheShip}>Yes</Button>
                        <Button onClick={() => router.back()}>No</Button>
                    </CardFooter>
                </div>
            </Card>
      </section>
    );
  }