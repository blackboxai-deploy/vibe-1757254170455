"use client";

import { useState } from "react";
import { LocationSelector } from "./LocationSelector";
import { DateTimePicker } from "./DateTimePicker";
import { MapSelector } from "./MapSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { TripData } from "@/app/page";

interface BookingFormProps {
  onTripDataChange: (data: TripData) => void;
}

export function BookingForm({ onTripDataChange }: BookingFormProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("09:00");
  const [passengers, setPassengers] = useState(1);
  const [fromCoordinates, setFromCoordinates] = useState<[number, number] | undefined>();
  const [toCoordinates, setToCoordinates] = useState<[number, number] | undefined>();
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [mapMode, setMapMode] = useState<"from" | "to">("from");

  const handleMapLocationSelect = (address: string, coordinates: [number, number]) => {
    if (mapMode === "from") {
      setFrom(address);
      setFromCoordinates(coordinates);
    } else {
      setTo(address);
      setToCoordinates(coordinates);
    }
    setShowMapSelector(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!from || !to || !date) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (from === to) {
      toast.error("Departure and destination cannot be the same");
      return;
    }

    const tripData: TripData = {
      from,
      to,
      date,
      time,
      passengers,
      fromCoordinates,
      toCoordinates,
    };

    onTripDataChange(tripData);
    toast.success("Trip details updated!");
  };

  const openMapSelector = (mode: "from" | "to") => {
    setMapMode(mode);
    setShowMapSelector(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">1</span>
            </div>
            <span>Trip Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Selection */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <div className="flex gap-2">
                  <LocationSelector
                    id="from"
                    placeholder="Enter departure location"
                    value={from}
                    onChange={setFrom}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openMapSelector("from")}
                  >
                    📍 Map
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <div className="flex gap-2">
                  <LocationSelector
                    id="to"
                    placeholder="Enter destination"
                    value={to}
                    onChange={setTo}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openMapSelector("to")}
                  >
                    📍 Map
                  </Button>
                </div>
              </div>
            </div>

            {/* Date and Time Selection */}
            <DateTimePicker
              date={date}
              time={time}
              onDateChange={setDate}
              onTimeChange={setTime}
            />

            {/* Passengers */}
            <div className="space-y-2">
              <Label htmlFor="passengers">Number of Passengers</Label>
              <Input
                id="passengers"
                type="number"
                min="1"
                max="8"
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full">
              Update Trip Summary
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Map Selector Modal */}
      {showMapSelector && (
        <MapSelector
          isOpen={showMapSelector}
          onClose={() => setShowMapSelector(false)}
          onLocationSelect={handleMapLocationSelect}
          mode={mapMode}
        />
      )}
    </>
  );
}