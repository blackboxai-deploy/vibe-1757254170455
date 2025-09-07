"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";

interface Booking {
  id: string;
  userId: string;
  tripData: {
    from: string;
    to: string;
    date: string;
    time: string;
    passengers: number;
  };
  status: "confirmed" | "completed" | "cancelled";
  bookingDate: string;
  price: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Load user bookings
    const userBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
    const filteredBookings = userBookings.filter((booking: Booking) => booking.userId === user.id);
    setBookings(filteredBookings.sort((a: Booking, b: Booking) => 
      new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
    ));
  }, [user, router]);

  const handleCancelBooking = (bookingId: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: "cancelled" as const }
        : booking
    );
    
    setBookings(updatedBookings);
    
    // Update localStorage
    const allBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
    const updatedAllBookings = allBookings.map((booking: Booking) => 
      booking.id === bookingId 
        ? { ...booking, status: "cancelled" }
        : booking
    );
    localStorage.setItem("userBookings", JSON.stringify(updatedAllBookings));
    
    toast.success("Booking cancelled successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Manage your trips and view your booking history
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="font-semibold mb-2">Book New Trip</h3>
              <p className="text-sm text-gray-600 mb-4">Plan your next journey</p>
              <Button onClick={() => router.push("/")} className="w-full">
                Book Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold mb-2">Trip Statistics</h3>
              <p className="text-sm text-gray-600 mb-4">
                {bookings.length} total trip{bookings.length !== 1 ? 's' : ''}
              </p>
              <Button variant="outline" className="w-full">
                View Stats
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold mb-2">Favorites</h3>
              <p className="text-sm text-gray-600 mb-4">Manage saved locations</p>
              <Button variant="outline" className="w-full">
                View Favorites
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Booking History */}
        <Card>
          <CardHeader>
            <CardTitle>Your Trip History</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <img 
                    src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1589ffc5-fab6-4f49-965f-4421ae5e266a.png" 
                    alt="No trips yet start your journey today"
                    className="w-64 h-40 object-cover rounded-lg mx-auto mb-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No trips yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Your booking history will appear here once you make your first reservation.
                </p>
                <Button onClick={() => router.push("/")}>
                  Book Your First Trip
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Booked on {format(new Date(booking.bookingDate), "MMM d, yyyy")}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            <span className="font-medium">{booking.tripData.from}</span>
                          </div>
                          <div className="text-gray-400">→</div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                            <span className="font-medium">{booking.tripData.to}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span>📅 {format(new Date(booking.tripData.date), "MMM d, yyyy")}</span>
                          <span>🕘 {booking.tripData.time}</span>
                          <span>👥 {booking.tripData.passengers} passenger{booking.tripData.passengers > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      
                      <div className="text-right ml-6">
                        <p className="text-lg font-bold text-green-600 mb-2">
                          {booking.price}
                        </p>
                        {booking.status === "confirmed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}