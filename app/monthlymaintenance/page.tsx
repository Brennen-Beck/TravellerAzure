"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_URL, GAME_ID, SHIP_ID } from "@/app/traveller.config";



export default function MonthlyMaintenancePage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null); 
    const router = useRouter();


    const handleMonthlyMaintenance = async () => {
            setLoading(true);
    
            const payload = {
                GameID: GAME_ID,
                ShipID: SHIP_ID,
            };
    
            try {
                const response = await fetch(`${API_URL}/PerformMaintenance`, {
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
    
                alert("Monthly maintenance has been performed!");
                router.push("/shipsstatus"); 
            } catch (error) {
                console.error("Failed to perform monthly maintenance:", error);
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
                        Monthly Maintenance
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center px-10 py-4">
                    <div>
                        <p>Are you sure you want to pay for monthly maintenance on the ship now?</p>
                    </div>
                </CardContent>
                {/* Action Buttons */}
                <div className="flex flex-row justify-end m-0 p-0">
                    <CardFooter className="gap-4 m-0 p-2">
                        <Button onClick={handleMonthlyMaintenance}>Yes</Button>
                        <Button onClick={() => router.back()}>No</Button>
                    </CardFooter>
                </div>
            </Card>
      </section>
    );
  }