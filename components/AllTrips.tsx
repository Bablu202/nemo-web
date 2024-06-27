"use client";
import { useEffect, useRef, useState } from "react";
import supabase from "@/lib/supabase/supabase";
import Image from "next/image";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";
import { compareDesc, format, parseISO } from "date-fns";
import { MdTravelExplore } from "react-icons/md";
import { GiAirplaneDeparture, GiAirplaneArrival } from "react-icons/gi";
import { HiCurrencyRupee } from "react-icons/hi";
import { FaCalendarDays } from "react-icons/fa6";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi2";
import { FcLikePlaceholder, FcLike, FcSms, FcShare } from "react-icons/fc";
import { CiShare2 } from "react-icons/ci";
import { PiChatCircleThin } from "react-icons/pi";

function PostCard(post: Post) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % post.imageURL.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? post.imageURL.length - 1 : prevIndex - 1
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    trackMouse: true,
  });

  return (
    <div className="flex-none w-full sm:w-1/2 lg:w-1/2 xl:w-1/2  p-2">
      <div className="cursor-pointer p-2 sm:p-1.5 md:p-2 bg-custom-pri/5 rounded-lg">
        <div
          className="relative border border-custom-pri border-opacity-30
         rounded-lg shadow-sm snap-always snap-center overflow-hidden"
        >
          <div className="w-full h-80 md:h-96 container relative" {...handlers}>
            <Image
              className="rounded-t-lg object-fill transition-transform duration-500 ease-in-out"
              src={post.imageURL[currentImageIndex]}
              alt="Trip Image"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              priority
              loading="eager"
            />

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {post.imageURL.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ease-in-out ${
                    index === currentImageIndex ? "bg-white" : "bg-gray-400"
                  }`}
                ></div>
              ))}
            </div>
            <div className="text-white absolute bg-black/1 w-full h-full">
              <div className="absolute bg-gradient-to-b from-black/70 to-transparent w-full h-16" />
              <div className="absolute bottom-0 bg-gradient-to-t from-black/90 to-transparent w-full h-16" />
              <div className="p-1 lg:p-2 absolute flex flex-col w-full h-full">
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold mb-2 px-4 flex items-center gap-4">
                    <MdTravelExplore />
                    {post.title}
                  </h3>
                  <div className="flex flex-col">
                    <time
                      dateTime={post.startDate}
                      className="mb-1 text-xs lg:text-sm flex items-center gap-2"
                    >
                      <GiAirplaneDeparture />
                      {format(parseISO(post.startDate), "LLLL d, yyyy")}
                    </time>
                    <time
                      dateTime={post.returnDate}
                      className="mb-1 text-xs lg:text-sm flex items-center gap-2"
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
        <div className="flex justify-between mt-2">
          <div className="flex text-2xl space-x-2 py-1">
            <FcLikePlaceholder />
            <PiChatCircleThin className="text-custom-pri" />
            <CiShare2 className="text-custom-pri" />
          </div>
          <Link href={post.url} legacyBehavior>
            <div
              className="border font-semibold text-lg px-4 py-1 bg-white text-custom-pri mr-4 rounded-lg
            hover:bg-custom-pri hover:text-white hover:shadow-xl transition duration-300"
            >
              More about Trip
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function AllTrips() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [visiblePostsCount, setVisiblePostsCount] = useState(6);

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
            url: `/trips/${trip.id}`,
            imageURL: trip.image, // Assuming this is an array of image URLs
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

  const showMorePosts = () => {
    setVisiblePostsCount((prevCount) => prevCount + 6);
  };

  return (
    <section className="max-w-6xl flex m-auto justify-between items-center mt-10">
      <div className="w-full pt-2">
        <h1
          className="h1 px-4
        bg-gradient-to-r from-zinc-600 via-zinc-500  to-zinc-700 text-transparent bg-clip-text"
        >
          Discover experiences, not just destinations. Book with us.
        </h1>
        <a href="#travel-form" className="p-6 hover:cursor-pointer underline">
          fill me, our people will contact you
        </a>
        <div className="flex flex-wrap justify-between items-center">
          {posts.slice(0, visiblePostsCount).map((post, idx) => (
            <PostCard key={idx} {...post} />
          ))}
        </div>
        {visiblePostsCount < posts.length && (
          <div className="flex justify-center mt-4">
            <button
              className="border font-semibold text-lg px-4 py-1 bg-white text-custom-pri rounded-lg
              hover:bg-custom-pri hover:text-white hover:shadow-xl transition duration-300"
              onClick={showMorePosts}
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default AllTrips;
