"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { useState } from "react";
import MapSearchBar from "@/components/pages/_course/tour-search-bar";

interface TourInfoDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPlace: (place: string) => void;
}

export default function TourInfoDrawer({
  open,
  onOpenChange,
  onSelectPlace,
}: TourInfoDrawerProps) {
  const [search, setSearch] = useState("");
  // 예시 데이터
  const places = ["추가 예정"];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[70vh]">
        <DrawerHeader>
          <DrawerTitle>관광지 검색</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <div className="mt-2">
            <MapSearchBar
              onSearch={(query) => setSearch(query)}
            />
          </div>
          <div className="mt-6">
            {places
              .filter(p => p.includes(search))
              .map(place => (
                <button
                  key={place}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                  onClick={() => {
                    onSelectPlace(place);
                    onOpenChange(false);
                  }}
                >
                  {place}
                </button>
              ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}