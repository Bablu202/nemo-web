"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import supabase from "@/lib/supabase/supabase";
import Image from "next/image";
import Link from "next/link";
import {
  compareAsc,
  compareDesc,
  differenceInDays,
  format,
  parseISO,
} from "date-fns";
import { GiAirplaneDeparture, GiAirplaneArrival } from "react-icons/gi";
import { HiCurrencyRupee } from "react-icons/hi";
import { FaCalendarDays } from "react-icons/fa6";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { CiShare2 } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import Carousel from "./funComponents/Carousel";

function PostCard(post: Post) {
  const [liked, setLiked] = useState(false);

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
    <div className="flex-none w-full sm:w-1/2 lg:w-1/3 p-4 sm:p-2 ">
      <div className="cursor-pointer p-4 lg:p-5 bg-custom-pri/5 shadow-lg rounded-lg">
        <div
          className="relative border border-custom-pri border-opacity-30
         rounded-lg shadow-sm snap-always snap-center overflow-hidden"
        >
          <div className="w-full h-64 container relative">
            <Carousel>
              {post.imageURL.map((url, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 h-full relative"
                >
                  <Image
                    className="rounded-t-lg object-fill"
                    src={url}
                    alt={`Trip Image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    priority
                    loading="eager"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg p-1 text-custom-pri">
            {post.title}
          </h3>
          <p className="flex items-center mb-1 text-sm">
            <GiAirplaneDeparture />
            &nbsp;
            {format(new Date(post.startDate), "dd MMM yyyy")}&nbsp;
            <GiAirplaneArrival />
            &nbsp;
            {format(new Date(post.returnDate), "dd MMM yyyy")}
          </p>
          <div className="flex justify-between">
            <p className="flex justify-between items-center text-sm">
              <FaCalendarDays />
              &nbsp;
              {differenceInDays(
                parseISO(post.returnDate),
                parseISO(post.startDate)
              ) + 1}
              &nbsp; Days
            </p>
            <p className="flex items-center gap-4 text-sm">
              <HiCurrencyRupee />
              {post.price}
            </p>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex text-2xl space-x-6 py-1">
            <div
              onClick={() => setLiked((prev) => !prev)}
              className="cursor-pointer"
            >
              {liked ? <FcLike /> : <FcLikePlaceholder />}
            </div>
            {/* <PiChatCircleThin className="hover:text-custom-pri" /> */}
            <CiShare2
              onClick={handleShare}
              className="hover:text-custom-pri cursor-pointer"
            />
          </div>
          <Link href={post.url} legacyBehavior>
            <div
              className="border font-semibold px-2 py-1 shadow-sm
               bg-white text-custom-pri  rounded-lg
            hover:bg-custom-pri hover:text-white hover:shadow-2xl transition duration-300"
            >
              trip details..
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
        bg-gradient-to-r from-[#24386E]/80 via-[#24386E]/65  to-[#24386E]/95 text-transparent bg-clip-text"
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
        <div className="flex flex-wrap justify-between items-center ">
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
