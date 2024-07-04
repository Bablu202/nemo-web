"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { LiaRupeeSignSolid, LiaStreetViewSolid } from "react-icons/lia";
import { IoRestaurantOutline } from "react-icons/io5";

const TripPage = () => {
  const { slug } = useParams(); // Get the slug from the route parameters
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (error) {
    return <div className="text-center text-red-500 mt-20">Error: {error}</div>;
  }

  if (!trip) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  const getRandomImage = () => {
    return trip.image[Math.floor(Math.random() * trip.image.length)];
  };

  return (
    <div className="container mt-20 mx-auto max-w-6xl">
      <div className="flex flex-col-reverse lg:flex-row m-4 md:m-8 p-2 lg:p-8  bg-color-green/5 shadow-lg">
        {/* Image Section */}
        <div className="w-[80%] mx-auto lg:w-1/2 relative h-96 lg:h-auto p-4 bg-custom-pri/5 rounded-lg shadow-lg">
          <Image
            src={getRandomImage()}
            alt="Trip Image"
            layout="fill"
            objectFit="cover"
            className="rounded-lg lg:rounded-r-lg"
          />
        </div>
        {/* Details Section */}
        <div className="w-full px-4 md:px-8 lg:w-1/2 p-2 lg:p-8 ">
          <div className="">
            <h1 className="text-5xl font-light  text-custom-pri mb-6 text-center uppercase ">
              {trip.title}
            </h1>
            <p className="mb-4 text-lg font-normal">
              This is a fantastic trip that offers an incredible experience
              through various destinations. Join us for an unforgettable
              adventure filled with excitement, culture, and breathtaking views.
            </p>
            <div className="rounded-sm p-1 lg:p-2 w-[80%]">
              <span className="flex-none lg:flex flex-col  lg:flex-row">
                <p>we start on</p>
                <p className="ml-auto font-semibold">{trip.start_date}</p>
              </span>

              <span className="flex-none lg:flex flex-col lg:flex-row">
                <p>come back to Home on</p>
                <p className="ml-auto font-semibold">{trip.return_date}</p>
              </span>
            </div>
            <div className="flex w-full">
              <div className="flex flex-col items-center my-4 mx-auto lg:py-2  text-color-purple">
                <MdOutlineEmojiEvents className=" mr-2 text-2xl" />
                <span className="">Fun Events</span>
              </div>
              <div className="flex flex-col items-center my-4 mx-auto lg:py-2  text-color-yellow">
                <LiaStreetViewSolid className=" mr-2 text-2xl" />
                <span className="">More Memories</span>
              </div>
              <div className="flex flex-col items-center my-4 mx-auto lg:py-2  text-color-green">
                <IoRestaurantOutline className=" mr-2 text-2xl" />
                <span className="">Good Food</span>
              </div>
            </div>
            <div className="text-xl mb-4 flex items-center">
              For just&nbsp;
              <LiaRupeeSignSolid />
              &nbsp;
              {new Intl.NumberFormat("en-IN", {
                maximumSignificantDigits: 3,
              }).format(trip.price)}
            </div>
            <div className="mb-2 ">
              <h4>in Total of&nbsp;{trip.seats}&nbsp;people</h4>
            </div>
          </div>
          <div className="flex mr-auto">
            <button
              className="border border-custom-pri bg-white text-custom-pri px-3 py-2 rounded-lg text-lg 
            hover:bg-custom-pri hover:text-white hover:shadow-xl transition duration-300 shadow-md mt-8"
            >
              Discover more..
            </button>
          </div>
        </div>
      </div>
      <div className="relative px-4 md:px-16 lg:px-28 mt-10">
        <h3 className="font-semibold text-lg mx-auto">
          Your&nbsp;{trip.plan.length}&nbsp; Days of plan.
        </h3>
        <div className="absolute w-[5px] ml-8 bg-gradient-to-b from-color-purple  to-color-green via-color-yellow h-full left-0 lg:left-4 transform -translate-x-1/2"></div>
        <div className="pl-8 space-y-6">
          {trip.plan.map((planItem, index) => (
            <div key={index} className="relative">
              <div className="bg-custom-pri/5 p-2 rounded-lg shadow-sm">
                <p className="">
                  &nbsp; Day {index + 1}&nbsp;--&nbsp;{planItem}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-8">
        <a
          className="inline-block border border-custom-pri bg-white text-custom-pri px-3 py-2 rounded-lg text-lg 
         hover:bg-custom-pri hover:text-white hover:shadow-xl transition duration-300 shadow-md"
        >
          Book This Trip
        </a>
      </div>
      <div className="container  px-4 my-12 flex flex-col mx-auto sm:flex-row items-center justify-between bg-gray-50 p-6 rounded-lg shadow-lg">
        <div className="w-full sm:w-1/2 sm:pl-6 mt-4 sm:mt-0 ">
          <h2 className="text-2xl font-semibold mb-10">About This Trip</h2>
          <p>
            This is a fantastic trip that offers an incredible experience
            through various destinations. Join us for an unforgettable adventure
            filled with excitement, culture, and breathtaking views.
          </p>
        </div>
        <div className="w-full  sm:w-1/2 items-center">
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
/*
<div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Plan:</h2>
          <div className="relative">
            <div className="absolute w-1 bg-gradient-to-b from-blue-400 to-green-400 h-full left-4 transform -translate-x-1/2"></div>
            <div className="pl-8 space-y-6">
              {trip.plan.map((planItem, index) => (
                <div key={index} className="relative">
                  <div className="bg-custom-pri/5 p-4 rounded-lg shadow-md">
                    <p className=" text-lg font-medium">
                      &nbsp; Day {index + 1}
                    </p>
                    <p>{planItem}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300">
            Book This Trip
          </a>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center bg-gray-100 p-6 rounded-lg shadow-lg">
          <div className="w-full sm:w-1/2">
            <Image
              className="rounded-lg object-cover"
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
          <div className="w-full sm:w-1/2 sm:pl-6 mt-4 sm:mt-0">
            <h2 className="text-2xl font-semibold mb-2">About This Trip</h2>
            <p>
              This is a fantastic trip that offers an incredible experience
              through various destinations. Join us for an unforgettable
              adventure filled with excitement, culture, and breathtaking views.
            </p>
          </div>
        </div>
      </div>
    </div>
*/
