"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipData, PassengerClass } from "../passengersavailable/page";
import { useRouter } from "next/navigation"; 
import { API_URL, GAME_ID, SHIP_ID } from "../traveller.config";


interface SellTicketsDialogProps {
  open: boolean;
  onClose: () => void;
  ShipLevelData: ShipData | null;  // Accept ShipStatus as a prop
  PassengerClassData: PassengerClass;
}


export default function SellTicketsDialog({ open, onClose, ShipLevelData, PassengerClassData }: SellTicketsDialogProps) {
  // State for ticket counts
  const [ticketCounts, setTicketCounts] = useState({
    Low: 0,
    Basic: 0,
    Middle: 0,
    High: 0,
    Luxury: 0,
  });
  const router = useRouter();
  // State for tracking API request status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      GameID: GAME_ID,
      ShipID: SHIP_ID,
      LowBerthTickets: ticketCounts.Low,
      BasicTickets: ticketCounts.Basic,
      MiddleTickets: ticketCounts.Middle,
      HighTickets: ticketCounts.High,
      LuxuryTickets: ticketCounts.Luxury,
    };
    //console.log("Sending API Request with Payload:", payload); // Debugging

    try {
      const response = await fetch(`${API_URL}/SellTickets`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
        body: JSON.stringify(payload),
      });

      //console.log("API Response Status:", response.status);
      const responseData = await response.json();
      console.log("API Response Body:", responseData);

      if (!response.ok || !responseData.Data.startsWith("This API")) {
        throw new Error(responseData.Data || `API Error: ${response.statusText}`);
      }

      //console.log("Sell Tickets API call successful");
      router.push("/shipsstatus");
      onClose(); // Close dialog after success
    } catch (err) {
      console.error("Error selling tickets:", err);
      setError("Failed to sell tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const berthPropertyMap: Record<string, keyof ShipData> = {
    Low: "LowBerths",
    Basic: "Basic",
    Middle: "Middle",
    High: "High",
    Luxury: "Luxury",
  };
  
  const getBerths = (classType: keyof typeof ticketCounts) => {
    if (!ShipLevelData) return 0;
    return ShipLevelData[berthPropertyMap[classType]] ?? 0;
  };


  // Helper function to handle numeric input changes
  const handleTicketChange = (classType: keyof typeof ticketCounts, value: number) => {

    setTicketCounts((prev) => ({
      ...prev,
      [classType]: Math.max(0, Math.min(value, getMaxAddable(classType))), // Prevents negative numbers & overfilling
    }));
  };

  // Function to get the number of available passengers from PassengerClassData
  const getAvailablePassengers = (classType: string) => {
    const className = `${classType} Passage`; // Convert to match "Low Passage", "Basic Passage", etc.
    const matchedRow = PassengerClassData.find((p) => p.PassageName === className);
    return matchedRow ? matchedRow.PassengersAvailable : 0; // Default to 0 if no match
  };


  // Function to calculate max tickets that can be added (based on berths & available passengers)
  const getMaxAddable = (classType: keyof typeof ticketCounts) => {
    if (!ShipLevelData) return 0;
    const onboard = ShipLevelData[`${classType}Passengers` as keyof ShipData] ?? 0 as number;
    const berths = getBerths(classType) ?? 0 as number;
    const available = getAvailablePassengers(classType); 
    
    return Math.max(0, Math.min(Number(berths) - Number(onboard), Number(available))); // Ensures it doesn't exceed capacity
  };

  // Check if the ticket counts have changed from the initial values
  /*
  const isConfirmDisabled = Object.keys(ticketCounts).every(
    (key) => ticketCounts[key as keyof typeof ticketCounts] === 0
  );
  */
  // Check if all onboard passengers have reached their limit
  const isConfirmDisabled = ["Low", "Basic", "Middle", "High", "Luxury"].every((classType) => {
    const onboard = Number(ShipLevelData?.[`${classType}Passengers` as keyof ShipData] ?? 0);
    const berths = Number(getBerths(classType as keyof typeof ticketCounts));
    const available = Number(getAvailablePassengers(classType));
    const maxSellable = Math.min(berths, available); // Tickets can only be sold if both conditions are met
  
    return onboard >= maxSellable; // Disable if no more tickets can be sold for this class
  });
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-4 max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Sell Tickets to {ShipLevelData?.DeclaredDestination}
          </DialogTitle>
          <Card className="w-full p-0 m-0">
            <CardHeader className="p-2">
              <CardTitle className="text-m font-normal">
                Passage Class
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {/* Table Header */}
              <div className="grid grid-cols-5 text-sm font-bold pb-2 flex items-end">
                <Label className="text-right pr-3">Class</Label>
                <Label className="text-center">Onboard</Label>
                <Label className="text-center">Berths</Label>
                <Label className="text-center">Passengers Available</Label>
                <Label className="text-center pr-2">Add</Label>
              </div>

              {/* Rows for each passenger class */}
              {["Low", "Basic", "Middle", "High", "Luxury"].map((classType) => (
                <div key={classType} className="grid grid-cols-5 gap-4 items-center border-t py-1">
                  <Label className="text-right pr-1">{classType}</Label>
                  <span className="text-center">{ShipLevelData?.[`${classType}Passengers` as keyof ShipData] ?? 0}</span>
                  <span className="text-center">{getBerths(classType)}</span>
                  <span className="text-center">{getAvailablePassengers(classType)}</span> 
                  <Input
                    className="w-14"
                    type="number"
                    min={0}
                    max={String(getMaxAddable(classType as keyof typeof ticketCounts))} // Ensures max is always a string
                    value={ticketCounts[classType as keyof typeof ticketCounts]}
                    onChange={(e) => handleTicketChange(classType as keyof typeof ticketCounts, parseInt(e.target.value) || 0)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
          <DialogFooter className="pt-2">
            <Button onClick={handleConfirm} disabled={isConfirmDisabled || loading}>
              {loading ? "Processing..." : "Confirm"}  
            </Button>  
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogHeader>
          {error && (
            <p className="text-red-600 text-sm text-center mt-2">
              {error}
            </p>
          )}
      </DialogContent>
    </Dialog>

  );
}
