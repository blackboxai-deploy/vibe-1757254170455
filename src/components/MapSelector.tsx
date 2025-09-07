"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MapSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (address: string, coordinates: [number, number]) => void;
  mode: "from" | "to";
}

export function MapSelector({ isOpen, onClose, onLocationSelect, mode }: MapSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: [number, number];
  } | null>(null);

  // Simulate map locations - in a real app, this would be integrated with a mapping service
  const mockLocations = [
    { address: "Times Square, New York, NY", coordinates: [40.7589, -73.9851] as [number, number] },
    { address: "Central Park, New York, NY", coordinates: [40.7829, -73.9654] as [number, number] },
    { address: "Brooklyn Bridge, New York, NY", coordinates: [40.7061, -73.9969] as [number, number] },
    { address: "Empire State Building, New York, NY", coordinates: [40.7484, -73.9857] as [number, number] },
    { address: "Statue of Liberty, New York, NY", coordinates: [40.6892, -74.0445] as [number, number] },
    { address: "One World Trade Center, New York, NY", coordinates: [40.7127, -74.0134] as [number, number] },
    { address: "High Line, New York, NY", coordinates: [40.7480, -74.0048] as [number, number] },
    { address: "9/11 Memorial, New York, NY", coordinates: [40.7115, -74.0134] as [number, number] },
  ];

  const filteredLocations = mockLocations.filter(location =>
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationClick = useCallback((location: { address: string; coordinates: [number, number] }) => {
    setSelectedLocation(location);
  }, []);

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation.address, selectedLocation.coordinates);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Select {mode === "from" ? "Departure" : "Destination"} Location
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[60vh]">
          {/* Search and Location List */}
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Search for a location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[45vh]">
              {filteredLocations.map((location, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedLocation?.address === location.address ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => handleLocationClick(location)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-600 mt-0.5">📍</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{location.address}</p>
                        <p className="text-xs text-gray-500">
                          {location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredLocations.length === 0 && searchTerm && (
                <div className="text-center py-8 text-gray-500">
                  <p>No locations found for "{searchTerm}"</p>
                  <p className="text-sm mt-2">Try a different search term</p>
                </div>
              )}
            </div>
          </div>

          {/* Map Preview Area */}
          <div className="bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-4">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2d90c3f1-b0a4-48e2-b986-5fee18cbd6a4.png" 
                alt="Interactive Map with location markers and navigation"
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="p-4">
                <p className="text-gray-600 mb-2">🗺️ Interactive Map</p>
                <p className="text-sm text-gray-500">
                  {selectedLocation 
                    ? `Selected: ${selectedLocation.address}` 
                    : "Select a location from the list to see it on the map"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedLocation}>
            Confirm Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}