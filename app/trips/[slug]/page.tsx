"use client";
import React, { useState, useEffect } from "react";
import { useUserSession } from "@/context/SessionContext";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { LiaStreetViewSolid, LiaRupeeSignSolid } from "react-icons/lia";
import { IoRestaurantOutline } from "react-icons/io5";
import toast from "react-hot-toast"; // Import react-hot-toast

// Define the Trip type based on your data structure
type Trip = {
  id: string;
  title: string;
  image: string[];
  start_date: string;
  return_date: string;
  price: number;
  seats: number;
  plan: string[];
};

const TripPage: React.FC = () => {
  const { slug } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, loading } = useUserSession();
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      const fetchTrip = async () => {
        try {
          const response = await axios.get(`/api/trips/${slug}`);
          setTrip(response.data);
        } catch (error: any) {
          console.error(error);
          setError(error.response?.data?.error || "An error occurred");
        }
      };

      fetchTrip();
    }
  }, [slug]);

  const handleRequestTrip = async () => {
    if (!user) {
      router.push("/user");
      return;
    }

    try {
      const response = await axios.post("/api/trips/manage/save-user-trip", {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        mobile_number: user.mobile_number ?? null,
        date_of_birth: user.date_of_birth ?? null,
        profession: user.profession ?? null,
        gender: user.gender ?? null,
        picture: user.picture ?? null,
        trip_name: trip?.title,
        trip_id: trip?.id,
        start_date: trip?.start_date ?? null,
        return_date: trip?.return_date ?? null,
      });

      if (response.data.message === "User already registered for this trip") {
        toast.error("You are already registered for this trip.");
      } else {
        toast.success("Request saved successfully!");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error("An error occurred while saving your request.");
    }
  };

  if (error) {
    return <div className="text-center text-red-500 mt-20">Error: {error}</div>;
  }

  if (!trip) {
    return <SkeletonTripPage />;
  }
  const getRandomImage = () => {
    return trip.image[Math.floor(Math.random() * trip.image.length)];
  };

  return (
    <div className="container mt-20 mx-auto max-w-6xl">
      <div className="flex flex-col-reverse lg:flex-row m-4 md:m-8 p-2 lg:p-8 bg-color-green/5 shadow-lg">
        {/* Image Section */}
        <div className="w-[80%] mx-auto lg:w-1/2 relative h-96 lg:h-auto p-4 rounded-lg shadow-lg">
          <Image
            src={getRandomImage()}
            alt="Trip Image"
            layout="fill"
            objectFit="cover"
            className="rounded-lg lg:rounded-r-lg"
          />
        </div>
        {/* Details Section */}
        <div className="w-full px-4 md:px-8 lg:w-1/2 p-2 lg:p-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-custom-pri mb-6 text-center uppercase">
              {trip.title}
            </h1>
            <p className="mb-4 text-lg font-normal">
              This is a fantastic trip that offers an incredible experience
              through various destinations. Join us for an unforgettable
              adventure filled with excitement, culture, and breathtaking views.
            </p>
            <div className="rounded-sm p-1 lg:p-2 w-[80%]">
              <span className="flex-none lg:flex flex-col lg:flex-row">
                <p>We start on</p>
                <p className="ml-auto font-semibold">{trip.start_date}</p>
              </span>
              <span className="flex-none lg:flex flex-col lg:flex-row">
                <p>Come back to Home on</p>
                <p className="ml-auto font-semibold">{trip.return_date}</p>
              </span>
            </div>
            <div className="flex w-full">
              <div className="flex flex-col items-center my-4 mx-auto lg:py-2 text-color-purple">
                <MdOutlineEmojiEvents className="mr-2 text-2xl" />
                <span className="text-xl md:text-2xl font-light md:font-light uppercase text-center">
                  Fun Events
                </span>
              </div>
              <div className="flex flex-col items-center my-4 mx-auto lg:py-2 text-color-yellow">
                <LiaStreetViewSolid className="mr-2 text-2xl" />
                <span className="text-xl md:text-2xl font-light md:font-light uppercase text-center">
                  More Memories
                </span>
              </div>
              <div className="flex flex-col items-center my-4 mx-auto lg:py-2 text-color-green">
                <IoRestaurantOutline className="mr-2 text-2xl" />
                <span className="text-xl md:text-2xl font-light md:font-light uppercase text-center">
                  Good Food
                </span>
              </div>
            </div>
            <div className="text-xl mb-4 flex items-center">
              Just for&nbsp;
              <LiaRupeeSignSolid />
              &nbsp;
              {new Intl.NumberFormat("en-IN", {
                maximumSignificantDigits: 3,
              }).format(trip.price)}
            </div>
            <div className="mb-2">
              <h4>In Total of&nbsp;{trip.seats}&nbsp;people</h4>
            </div>
          </div>
          <div className="flex mr-auto">
            <button
              onClick={handleRequestTrip}
              className="border mb-6 border-custom-pri bg-white text-custom-pri px-2 py-0.5 md:py-1 lg:px-3 lg:py-2 rounded-lg text-lg hover:bg-custom-pri hover:text-white hover:shadow-xl transition duration-300 shadow-md mt-8"
            >
              {user ? "Request This Trip" : "Login to Request Trip"}
            </button>
          </div>
        </div>
      </div>
      <div className="relative px-4 md:px-16 lg:px-28 mt-10">
        <h3 className="font-semibold text-lg mx-auto">
          Your&nbsp;{trip.plan.length}&nbsp;Days of plan.
        </h3>
        <div className="absolute w-[5px] ml-8 bg-gradient-to-b from-color-purple to-color-green via-color-yellow h-full left-0 lg:left-4 transform -translate-x-1/2"></div>
        <div className="pl-8 space-y-6">
          {trip.plan.map((planItem, index) => (
            <div key={index} className="relative">
              <div className="bg-custom-pri/5 p-2 rounded-lg shadow-sm">
                <p>
                  &nbsp; Day {index + 1}&nbsp;--&nbsp;{planItem}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-8">
        <a
          onClick={handleRequestTrip}
          className="inline-block border border-custom-pri bg-white text-custom-pri px-2 py-0.5 md:py-1 lg:px-3 lg:py-2 rounded-lg text-lg hover:bg-custom-pri hover:text-white hover:shadow-xl transition duration-300 shadow-md"
        >
          {user ? "Request This Trip" : "Login to Request Trip"}
        </a>
      </div>
      <div className="container px-4 my-12 flex flex-col mx-auto sm:flex-row items-center justify-between bg-color-red/5 p-6 rounded-lg shadow-lg">
        <div className="w-full sm:w-1/2 sm:pl-6 mt-4 sm:mt-0">
          <h2 className="text-2xl font-semibold mb-10">About This Trip</h2>
          <p>
            This is a fantastic trip that offers an incredible experience
            through various destinations. Join us for an unforgettable adventure
            filled with excitement, culture, and breathtaking views.
          </p>
        </div>
        <div className="w-full sm:w-1/2 items-center">
          <Image
            className="rounded-lg object-cover mx-auto"
            src={getRandomImage()}
            alt="Random Trip Image"
            width={500}
            height={300}
            objectFit="cover"
            objectPosition="center"
            priority
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default TripPage;

// components/SkeletonTripPage.tsx
const SkeletonTripPage = () => {
  return (
    <div className="container mt-20 mx-auto max-w-6xl">
      <div className="flex flex-col-reverse lg:flex-row m-4 md:m-8 p-2 lg:p-8  bg-white/5 shadow-lg animate-pulse">
        <div className="w-[80%] mx-auto lg:w-1/2 relative h-96 lg:h-auto p-4 rounded-lg shadow-lg bg-gray-100/20"></div>
        <div className="w-full px-4 md:px-8 lg:w-1/2 p-2 lg:p-8">
          <div>
            <div className="h-10 w-3/4 bg-gray-100/20 rounded mb-6"></div>
            <div className="h-6 bg-gray-100/20 rounded mb-4"></div>
            <div className="h-6 bg-gray-100/20 rounded mb-4"></div>
            <div className="h-6 bg-gray-100/20 rounded mb-4"></div>
            <div className="h-6 bg-gray-100/20 rounded mb-4"></div>
            <div className="flex w-full justify-around my-4">
              <div className="h-12 w-12 bg-gray-100/20 rounded-full"></div>
              <div className="h-12 w-12 bg-gray-100/20 rounded-full"></div>
              <div className="h-12 w-12 bg-gray-100/20 rounded-full"></div>
            </div>
            <div className="h-8 bg-gray-100/20 rounded mb-4 w-1/2 mx-auto"></div>
            <div className="h-6 bg-gray-100/20 rounded mb-2 w-1/3 mx-auto"></div>
            <div className="h-12 bg-gray-100/20 rounded mb-8 w-1/4 mx-auto"></div>
          </div>
        </div>
      </div>
      <div className="relative px-4 md:px-16 lg:px-28 mt-10">
        <div className="h-8 bg-gray-100/20 rounded w-1/2 mx-auto mb-4"></div>
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="relative">
              <div className="bg-gray-100/20 p-2 rounded-lg shadow-sm h-10"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-8">
        <div className="inline-block h-12 bg-gray-100/20 rounded-lg w-1/4"></div>
      </div>
      <div className="container px-4 my-12 flex flex-col mx-auto sm:flex-row items-center justify-between bg-color-red/5 p-6 rounded-lg shadow-lg animate-pulse">
        <div className="w-full sm:w-1/2 sm:pl-6 mt-4 sm:mt-0">
          <div className="h-8 bg-gray-100/20 rounded w-3/4 mb-10"></div>
          <div className="h-6 bg-gray-100/20 rounded mb-4"></div>
          <div className="h-6 bg-gray-100/20 rounded mb-4"></div>
          <div className="h-6 bg-gray-100/20 rounded mb-4"></div>
        </div>
        <div className="w-full sm:w-1/2 items-center">
          <div className="h-64 bg-gray-100/20 rounded-lg mx-auto"></div>
        </div>
      </div>
    </div>
  );
};
