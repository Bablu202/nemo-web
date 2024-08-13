// pages/analytics.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { TripUser } from "@/types/custom";
import ChartsComponent from "./Charts/ChartsComponent";

const AnalyticsPage: React.FC = () => {
  const [trips, setTrips] = useState<
    { trip_name: string; users: TripUser[] }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get<{
          trips: { trip_name: string; users: TripUser[] }[];
        }>("/api/user/manage/get-trips");
        setTrips(response.data.trips);
      } catch (err) {
        setError("Failed to fetch trips data");
      }
    };

    fetchTrips();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mt-12 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      {trips.length > 0 ? (
        <ChartsComponent trips={trips} />
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default AnalyticsPage;
