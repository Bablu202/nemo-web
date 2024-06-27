"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import supabase from "@/lib/supabase/supabase";
import Image from "next/image";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";
import {
  compareAsc,
  compareDesc,
  differenceInDays,
  format,
  parseISO,
} from "date-fns";
import { MdTravelExplore } from "react-icons/md";
import { GiAirplaneDeparture, GiAirplaneArrival } from "react-icons/gi";
import { HiCurrencyRupee } from "react-icons/hi";
import { FaCalendarDays } from "react-icons/fa6";
import { FcLikePlaceholder, FcLike, FcSms, FcShare } from "react-icons/fc";
import { CiShare2 } from "react-icons/ci";
import { PiChatCircleThin } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

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
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          url: post.url,
        })
        .then(() => {
          console.log("Thanks for sharing!");
        })
        .catch(console.error);
    } else {
      // Fallback for browsers that do not support the Web Share API
      const textarea = document.createElement("textarea");
      textarea.value = post.url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("Link copied to clipboard");
    }
  }, [post]);
  return (
    <div className="flex-none w-full sm:w-1/2 lg:w-1/2 p-2">
      <div className="cursor-pointer p-3 sm:p-4 md:p-6 bg-custom-pri/5 rounded-lg">
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
                <div className="flex justify-between ml-auto">
                  <div className="flex flex-col">
                    <time
                      dateTime={post.startDate}
                      className="mb-1 text-base lg:text-lg flex items-center gap-2"
                    >
                      <GiAirplaneDeparture />
                      {format(parseISO(post.startDate), "LLLL d, yyyy")}
                    </time>
                    <time
                      dateTime={post.returnDate}
                      className="mb-1 text-base lg:text-lg flex items-center gap-2"
                    >
                      <GiAirplaneArrival />
                      {format(parseISO(post.returnDate), "LLLL d, yyyy")}
                    </time>
                  </div>
                </div>
                <div
                  className="bg-custom-pri/45  backdrop-blur-lg drop-shadow-lg rounded-lg 
                flex items-center mr-auto px-4 py-2"
                >
                  <div
                    className="text-xl lg:text-2xl font-semibold px-4 
                  flex items-center gap-4"
                  >
                    <MdTravelExplore />
                    {post.title}
                  </div>
                </div>
                <div className="mt-auto text-base lg:text-lg">
                  <p className="flex items-center gap-4">
                    <FaCalendarDays />
                    {differenceInDays(
                      parseISO(post.returnDate),
                      parseISO(post.startDate)
                    ) + 1}
                    &nbsp; Days
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
        <div className="flex justify-between mt-4 lg:mt-6">
          <div className="flex text-2xl space-x-2 py-1">
            <FcLikePlaceholder />
            <PiChatCircleThin className="text-custom-pri" />
            <CiShare2 onClick={handleShare} className="text-custom-pri" />
          </div>
          <Link href={post.url} legacyBehavior>
            <div
              className="border font-normal text-lg px-1 py-0.5 lg:px-4 lg:py-1 bg-white text-custom-pri mr-4 rounded-lg
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
  const [searchQuery, setSearchQuery] = useState("");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchTrips = async () => {
      const { data, error } = await supabase
        .from("nemo_upcoming_trip_details")
        .select("*");
      if (error) {
        console.error(error);
      } else {
        const tripsWithDuration = data.map((trip) => ({
          ...trip,
          url: `/trips/${trip.id}`,
          imageURL: trip.image, // Assuming this is an array of image URLs
          startDate: trip.start_date,
          returnDate: trip.return_date,
          duration:
            differenceInDays(
              parseISO(trip.return_date),
              parseISO(trip.start_date)
            ) + 1,
          status: trip.status,
          price: trip.price,
          seats: trip.seats,
        }));

        const sortedTrips = tripsWithDuration.sort((a, b) =>
          sortOrder === "asc"
            ? compareAsc(parseISO(a.startDate), parseISO(b.startDate))
            : compareDesc(parseISO(a.startDate), parseISO(b.startDate))
        );

        setPosts(sortedTrips);
      }
    };

    fetchTrips();
  }, [sortOrder]);
  const filteredPosts = posts.filter((post) =>
    Object.values(post).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const showMorePosts = () => {
    setVisiblePostsCount((prevCount) => prevCount + 3);
  };

  const showLessPosts = () => {
    setVisiblePostsCount((prevCount) => Math.max(prevCount - 3, 3));
  };
  return (
    <section className="max-w-6xl flex m-auto justify-between items-center mt-10 px-2">
      <div className="w-full pt-2">
        <h1
          className="h1 px-4
        bg-gradient-to-r from-zinc-600 via-zinc-500  to-zinc-700 text-transparent bg-clip-text"
        >
          Discover experiences, not just destinations.
        </h1>

        <div className="flex items-center justify-center p-2">
          <div className="ml-auto mr-2 flex items-center justify-center w-full max-w-xs relative text-custom-pri">
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 " />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:border-custom-pri"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="ml-auto border rounded-full font-semibold text-lg px-2 py-2
          bg-white hover:border-custom-pri hover:text-custom-pri hover:shadow-xl 
          transition duration-300"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <HiOutlineAdjustmentsHorizontal className="text-xl" />
          </button>
        </div>
        <a href="#travel-form" className="p-6 hover:cursor-pointer underline">
          Book with us -
        </a>
        <div className="flex flex-wrap justify-between items-center">
          {filteredPosts.slice(0, visiblePostsCount).map((post, idx) => (
            <PostCard key={idx} {...post} />
          ))}
        </div>
        <div className="flex ml-4 mt-4 space-x-4">
          {visiblePostsCount < posts.length && (
            <button
              className="border font-semibold text-lg px-4 py-1 text-white bg-custom-pri rounded-lg
              hover:text-custom-pri hover:bg-white hover:shadow-xl transition duration-300"
              onClick={showMorePosts}
            >
              Show More
            </button>
          )}
          {visiblePostsCount > 6 && (
            <button
              className="border font-semibold text-lg px-4 py-1 text-white bg-custom-pri rounded-lg
              hover:text-custom-pri hover:bg-white hover:shadow-xl transition duration-300"
              onClick={showLessPosts}
            >
              Show Less
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default AllTrips;
