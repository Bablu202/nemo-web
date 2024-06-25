// app/trips/[slug]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase/supabase";

interface Post {
  id: number;
  url: string;
  imageURL: string;
  title: string;
  startDate: string;
  returnDate: string;
  duration: string;
  status: string;
  price: number;
  seats: number;
}

const TripPage = () => {
  const { slug } = useParams(); // Get the slug from the route parameters
  const [trip, setTrip] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const fetchTrip = async () => {
        const { data, error } = await supabase
          .from("nemo_upcoming_trip_details")
          .select("*")
          .eq("id", slug as string) // Adjust column name if needed
          .single();

        if (error) {
          console.error(error);
          setError(error.message);
        } else {
          setTrip(data);
        }
      };

      fetchTrip();
    }
  }, [slug]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{trip.title}</h1>
      <p>
        <strong>Start Date:</strong> {trip.startDate}
      </p>
      <p>
        <strong>Return Date:</strong> {trip.returnDate}
      </p>
      <p>
        <strong>Duration:</strong> {trip.duration}
      </p>
      <p>
        <strong>Status:</strong> {trip.status}
      </p>
      <p>
        <strong>Price:</strong> ${trip.price}
      </p>
      <p>
        <strong>Seats Available:</strong> {trip.seats}
      </p>
    </div>
  );
};

export default TripPage;
