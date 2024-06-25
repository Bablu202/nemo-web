"use client";
import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MdTravelExplore } from "react-icons/md";
import { GiAirplaneDeparture, GiAirplaneArrival } from "react-icons/gi";
import { HiCurrencyRupee } from "react-icons/hi";
import { FaCalendarDays } from "react-icons/fa6";

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

function PostCard(post: Post) {
  return (
    <section className="py-4" id="trips">
      <Link href={post.url} legacyBehavior>
        <div className="cursor-pointer p-1 sm:p-1.5 md:p-2">
          <div className="z-[-1] relative border  border-custom-pri border-opacity-30 mr-4 rounded-lg shadow-sm snap-always snap-center overflow-hidden">
            <div className="w-72 sm:w-80 md:w-96 xl:w-[30rem] h-60 md:h-64 container">
              <Image
                className="rounded-t-lg object-fill"
                src={post.imageURL}
                alt="Trip Image"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                priority
                loading="eager"
              />
              <div className=" text-white absolute bg-black/1 w-full h-full">
                <div className="absolute bg-gradient-to-b from-black/70 to-transparent w-full h-16" />
                <div className="absolute bottom-0 bg-gradient-to-t from-black/90 to-transparent w-full h-16" />
                <div className="p-1 lg:p-2 absolute flex flex-col w-full h-full">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold mb-2 px-4  flex items-center gap-4">
                      <MdTravelExplore />
                      {post.title}
                    </h3>
                    <div className="flex flex-col ">
                      <time
                        dateTime={post.startDate}
                        className="mb-1 text-xs lg:text-sm flex items-center gap-2"
                      >
                        <GiAirplaneDeparture />
                        {format(parseISO(post.startDate), "LLLL d, yyyy")}
                      </time>
                      <time
                        dateTime={post.returnDate}
                        className=" mb-1 text-xs lg:text-sm flex items-center gap-2"
                      >
                        <GiAirplaneArrival />
                        {format(parseISO(post.returnDate), "LLLL d, yyyy")}
                      </time>
                    </div>
                  </div>
                  <div className="mt-auto text-base">
                    <p className="flex items-center gap-4">
                      <FaCalendarDays /> {post.duration} Days
                    </p>
                    <p className="flex items-center gap-4">
                      <HiCurrencyRupee />
                      {post.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

import { HiChevronRight, HiChevronLeft } from "react-icons/hi2";
import supabase from "@/lib/supabase/supabase";

export default function AllTrips() {
  const [posts, setPosts] = useState<Post[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      const { data, error } = await supabase
        .from("nemo_upcoming_trip_details")
        .select("*");
      if (error) {
        console.error(error);
      } else {
        setPosts(
          data.map((trip) => ({
            ...trip,
            url: `/trips/${trip.id}`, // Assuming you have dynamic routes set up for trips
            imageURL: trip.image, // Adjust if necessary based on your data structure
            startDate: trip.start_date,
            returnDate: trip.return_date,
            duration: trip.duration,
            status: trip.status,
            price: trip.price,
            seats: trip.seats,
          }))
        );
      }
    };

    fetchTrips();
  }, []);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -400, // Adjust as needed
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 400, // Adjust as needed
      });
    }
  };

  return (
    <section className="max-w-6xl flex m-auto mt-6">
      <div className="w-full pt-2">
        <h1
          className="h1 
        bg-gradient-to-r from-zinc-600 via-zinc-500  to-zinc-700 text-transparent bg-clip-text"
        >
          Discover experiences, not just destinations. Book with us.
        </h1>
        <a href="#travel-form" className="p-6 hover:cursor-pointer underline">
          fill me, our people will contact you
        </a>
        <div className="flex justify-between items-center relative">
          <div
            ref={containerRef}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
          >
            <div className="flex max-w-6xl">
              <div className="px-10" />
              {posts.map((post, idx) => (
                <PostCard key={idx} {...post} />
              ))}
              <div className="px-10" />
              <div className="hidden lg:flex">
                <button
                  className="absolute top-8 left-0 h-60 text-6xl text-custom-sec "
                  onClick={scrollLeft}
                >
                  <HiChevronLeft />
                </button>
                <button
                  className="absolute right-0 h-full text-6xl text-custom-sec"
                  onClick={scrollRight}
                >
                  <HiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
