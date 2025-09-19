// app/page.tsx
"use client"; // This page needs to be a client component to use useSearchParams
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// Make sure these paths are correct based on your project structure
import MapWrapper from "@/components/MapWrapper";
import LeftPanel from "@/components/LeftPanel";
import { CoordinatesProvider } from "@/context/CoordinatesContext";

export default function Home() {
  const searchParams = useSearchParams();
  // Removed initialLocation logic

  return (
    <CoordinatesProvider>
      <main className="flex h-screen">
        <div className="h-full w-[20%] overflow-y-auto border-r bg-white">
          <LeftPanel />
        </div>
        <div className="h-full w-[80%]">
          <MapWrapper />
        </div>
      </main>
    </CoordinatesProvider>
  );
}
