"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { BookingForm } from "@/components/BookingForm";
import { TripSummary } from "@/components/TripSummary";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface TripData {
  from: string;
  to: string;
  date: Date;
  time: string;
  passengers: number;
  fromCoordinates?: [number, number];
  toCoordinates?: [number, number];
}

export default function HomePage() {
  const { user } = useAuth();
  const [tripData, setTripData] = useState<TripData | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <div className="mb-8">
            <img 
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a8e49b16-461d-48ed-9669-762a778cfb74.png" 
              alt="Welcome to TravelBook journey planning platform"
              className="w-full h-64 object-cover rounded-xl mb-6"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Plan Your Perfect Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Book trips, select locations on interactive maps, and manage your travel plans all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Where would you like to go, {user.name}?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select your departure and destination, choose your travel date and time, and let us help you plan the perfect trip.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="space-y-6">
            <BookingForm onTripDataChange={setTripData} />
          </div>

          {/* Trip Summary */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            {tripData ? (
              <TripSummary tripData={tripData} />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="mb-6">
                  <img 
                    src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/98c2c5ac-c5ff-4e5f-8d41-c96d620026a8.png" 
                    alt="Interactive map and travel planning interface"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Plan Your Trip?
                </h3>
                <p className="text-gray-600">
                  Fill out the form to see your trip summary and proceed with booking.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}