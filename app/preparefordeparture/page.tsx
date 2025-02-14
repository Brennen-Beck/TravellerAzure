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
  
 

export default function PrepareForDeparturePage() {
    const [ship, setShip] = useState<ShipData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
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


    const handlePrepareForDeparture = async () => {
        if (!ship || ship.PreparingForDeparture) return; // Prevent request if already set

        setLoading(true);

        const payload = {
            GameID: GAME_ID,
            ShipID: SHIP_ID,
        };

        try {
            const response = await fetch(`${API_URL}/PrepareForDeparture`, {
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

            alert("Ship is now preparing for departure!");
            router.push("/shipsstatus"); // Change this to the correct page after departure
        } catch (error) {
            console.error("Failed to prepare for departure:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="flex flex-col items-center min-h-screen py-14 w-full">
            <Card className="p-0 px-1 m-0 max-w-full md:max-w-md md:min-w-[460px]">
                <CardHeader className="m-0 px-4 py-2">
                    <CardTitle className="text-xl font-[orbitron] font-bold">
                        Prepare for Departure
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center px-10 py-4">
                    {ship?.PreparingForDeparture ?
                    (
                        <div>
                            <p>The ship is preparing for departure. Be sure and finish any business before departure including buying speculative freight.</p>
                        </div>
                    )    
                    :(
                        <div>
                            <p>Are you sure you are done selling goods?</p>
                        </div>
                    )}
                </CardContent>
                {/* Action Buttons */}
                <div className="flex flex-row justify-end m-0 p-0">
                    <CardFooter className="gap-4 m-0 p-2">
                        <Button onClick={handlePrepareForDeparture} disabled={ship?.PreparingForDeparture}>Yes</Button>
                        <Button onClick={() => router.back()}>No</Button>
                    </CardFooter>
                </div>
            </Card>
        </section>
    );
  }