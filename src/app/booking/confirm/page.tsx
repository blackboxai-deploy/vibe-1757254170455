"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { TripData } from "@/app/page";

export default function BookingConfirmPage() {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Load pending booking data
    const pendingBooking = localStorage.getItem("pendingBooking");
    if (pendingBooking) {
      setTripData(JSON.parse(pendingBooking));
    } else {
      // Redirect to home if no booking data
      router.push("/");
    }
  }, [router]);

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    
    try {
      // Simulate booking confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save booking to localStorage (in a real app, this would be sent to backend)
      const booking = {
        id: Date.now().toString(),
        userId: user?.id,
        tripData,
        status: "confirmed",
        bookingDate: new Date().toISOString(),
        price: "$55.00", // This would be calculated
      };
      
      const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
      existingBookings.push(booking);
      localStorage.setItem("userBookings", JSON.stringify(existingBookings));
      
      // Clear pending booking
      localStorage.removeItem("pendingBooking");
      
      toast.success("Booking confirmed successfully!");
      router.push("/dashboard");
      
    } catch (error) {
      toast.error("Failed to confirm booking. Please try again.");
    }
    
    setIsLoading(false);
  };

  const handleBack = () => {
    router.push("/");
  };

  if (!tripData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Your Booking</h1>
          <p className="text-gray-600">Review your trip details before confirming</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Route Overview */}
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">From</p>
                  <p className="font-semibold text-lg">{tripData.from}</p>
                  {tripData.fromCoordinates && (
                    <p className="text-sm text-gray-400">
                      📍 {tripData.fromCoordinates[0].toFixed(4)}, {tripData.fromCoordinates[1].toFixed(4)}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">To</p>
                  <p className="font-semibold text-lg">{tripData.to}</p>
                  {tripData.toCoordinates && (
                    <p className="text-sm text-gray-400">
                      📍 {tripData.toCoordinates[0].toFixed(4)}, {tripData.toCoordinates[1].toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Trip Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Date</p>
                <p className="font-medium">{format(tripData.date, "EEEE, MMMM d, yyyy")}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Time</p>
                <p className="font-medium">{tripData.time}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Passengers</p>
                <Badge variant="secondary" className="text-sm">{tripData.passengers} passenger{tripData.passengers > 1 ? 's' : ''}</Badge>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Duration</p>
                <p className="font-medium">~2-3 hours</p>
              </div>
            </div>

            <Separator />

            {/* Passenger Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Passenger Information</h4>
              <div className="space-y-2">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </div>

            <Separator />

            {/* Pricing Breakdown */}
            <div className="space-y-3">
              <h4 className="font-semibold">Pricing Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base fare</span>
                  <span>$45.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>$5.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">$55.00</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                By confirming this booking, you agree to our terms of service and cancellation policy. 
                You can cancel up to 2 hours before your scheduled departure time for a full refund.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" onClick={handleBack} className="flex-1">
            Back to Edit
          </Button>
          <Button 
            onClick={handleConfirmBooking} 
            disabled={isLoading}
            className="flex-1"
            size="lg"
          >
            {isLoading ? "Confirming..." : "Confirm Booking"}
          </Button>
        </div>
      </div>
    </div>
  );
}