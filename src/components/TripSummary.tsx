"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { TripData } from "@/app/page";
import { useRouter } from "next/navigation";

interface TripSummaryProps {
  tripData: TripData;
}

export function TripSummary({ tripData }: TripSummaryProps) {
  const router = useRouter();

  const handleBookTrip = () => {
    // Store trip data for booking confirmation
    localStorage.setItem("pendingBooking", JSON.stringify(tripData));
    toast.success("Proceeding to booking confirmation...");
    router.push("/booking/confirm");
  };

  const estimatedDuration = "2-3 hours"; // This would be calculated based on distance
  const estimatedPrice = "$45-65"; // This would be calculated based on distance and other factors

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">2</span>
          </div>
          <span>Trip Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Route Overview */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{tripData.from}</p>
                {tripData.fromCoordinates && (
                  <p className="text-xs text-gray-400">
                    📍 {tripData.fromCoordinates[0].toFixed(4)}, {tripData.fromCoordinates[1].toFixed(4)}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">{tripData.to}</p>
                {tripData.toCoordinates && (
                  <p className="text-xs text-gray-400">
                    📍 {tripData.toCoordinates[0].toFixed(4)}, {tripData.toCoordinates[1].toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Trip Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Date</span>
            <span className="font-medium">{format(tripData.date, "PPP")}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Time</span>
            <span className="font-medium">{tripData.time}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Passengers</span>
            <Badge variant="secondary">{tripData.passengers}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Duration</span>
            <span className="text-sm text-gray-600">{estimatedDuration}</span>
          </div>
        </div>

        <Separator />

        {/* Pricing */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Estimated Price</span>
            <span className="text-lg font-bold text-green-600">{estimatedPrice}</span>
          </div>
          <p className="text-xs text-gray-500">
            Final price may vary based on traffic, route optimization, and demand.
          </p>
        </div>

        {/* Action Button */}
        <Button onClick={handleBookTrip} className="w-full" size="lg">
          Book This Trip
        </Button>

        {/* Additional Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">What's Included:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Professional driver</li>
            <li>✓ GPS tracking</li>
            <li>✓ 24/7 customer support</li>
            <li>✓ Flexible cancellation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}