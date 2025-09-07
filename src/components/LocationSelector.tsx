"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Common locations for suggestions
const commonLocations = [
  "New York, NY, USA",
  "Los Angeles, CA, USA",
  "Chicago, IL, USA",
  "Houston, TX, USA",
  "Phoenix, AZ, USA",
  "Philadelphia, PA, USA",
  "San Antonio, TX, USA",
  "San Diego, CA, USA",
  "Dallas, TX, USA",
  "San Jose, CA, USA",
  "Austin, TX, USA",
  "Jacksonville, FL, USA",
  "Fort Worth, TX, USA",
  "Columbus, OH, USA",
  "Charlotte, NC, USA",
  "San Francisco, CA, USA",
  "Indianapolis, IN, USA",
  "Seattle, WA, USA",
  "Denver, CO, USA",
  "Boston, MA, USA",
];

interface LocationSelectorProps {
  id?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function LocationSelector({ 
  id, 
  placeholder = "Enter location", 
  value, 
  onChange, 
  className 
}: LocationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);

  useEffect(() => {
    if (searchValue.length > 0) {
      const filtered = commonLocations.filter(location =>
        location.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(commonLocations.slice(0, 10)); // Show top 10 by default
    }
  }, [searchValue]);

  const handleSelect = (location: string) => {
    onChange(location);
    setOpen(false);
    setSearchValue("");
  };

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    setSearchValue(inputValue);
    if (inputValue.length > 0) {
      setOpen(true);
    }
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              id={id}
              placeholder={placeholder}
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setOpen(true)}
              className="w-full"
            />
          </div>
        </PopoverTrigger>
        
        {open && filteredLocations.length > 0 && (
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandList>
                {filteredLocations.length === 0 && (
                  <CommandEmpty>No locations found.</CommandEmpty>
                )}
                <CommandGroup>
                  {filteredLocations.map((location) => (
                    <CommandItem
                      key={location}
                      value={location}
                      onSelect={() => handleSelect(location)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">📍</span>
                        <span>{location}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}