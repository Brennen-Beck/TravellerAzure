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


interface TradeCommodityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tradeType: string;
  tradeGood: string;
}

export default function TradeCommodityDialog({ isOpen, onClose, tradeType, tradeGood  }: TradeCommodityDialogProps) {
  const router = useRouter();
  // State for tracking API request status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isConfirmDisabled = false;
  
  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

  
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-4 max-w-lg">
        <DialogHeader>
          <DialogTitle>
          {tradeType} {tradeGood}
          </DialogTitle>
          
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
}