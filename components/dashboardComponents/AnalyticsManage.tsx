// pages/AnalyticsPage.tsx
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { TripUser } from "@/types/custom";
import axios from "axios";

// Dynamically import ChartsComponent without server-side rendering
const ChartsComponent = dynamic(() => import("./Charts/ChartsComponent"), {
  ssr: false,
});

const AnalyticsPage: React.FC = () => {
  const [trips, setTrips] = useState<
    { trip_name: string; users: TripUser[] }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get("/api/user/manage/get-trips");
        setTrips(response.data.trips);
      } catch (err) {
        setError("Failed to fetch trips data");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) return <AnalyticsSkeletonLoader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div
      className="container mt-12 mx-auto p-4
     bg-color-white text-custom-sec dark:bg-color-gray dark:text-color-white"
    >
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      <ChartsComponent trips={trips} />
    </div>
  );
};

export default AnalyticsPage;

// components/AnalyticsSkeletonLoader.tsx

const AnalyticsSkeletonLoader: React.FC = () => {
  return (
    <div className="container mt-12 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 bg-gray-200 h-8 w-1/3 rounded animate-pulse"></h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 w-full p-1 lg:p-4 rounded-lg bg-gray-200 h-80 animate-pulse"></div>
        <div className="lg:w-1/2 w-full p-1 lg:p-4 rounded-lg bg-gray-200 h-80 animate-pulse"></div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 mt-2">
        <div className="lg:w-1/2 w-full p-1 lg:p-4 rounded-lg bg-gray-200 h-80 animate-pulse"></div>
        <div className="lg:w-1/2 w-full p-1 lg:p-4 rounded-lg bg-gray-200 h-80 animate-pulse"></div>
      </div>
    </div>
  );
};
