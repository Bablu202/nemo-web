"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Carousel from "./funComponents/Carousel";

import {
  compareAsc,
  compareDesc,
  differenceInDays,
  format,
  parseISO,
} from "date-fns";
import { GiAirplaneDeparture, GiAirplaneArrival } from "react-icons/gi";
import { FaCalendarDays } from "react-icons/fa6";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { CiShare2 } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { LiaRupeeSignSolid } from "react-icons/lia";
import axios from "axios";
import { Trip } from "@/types/custom";
function PostCard(post: Trip) {
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
    <div
      className="flex-none w-full sm:w-1/2 lg:w-1/3 p-4 sm:p-2 
    bg-color-white dark:bg-color-gray text-custom-sec dark:text-white"
    >
      <div className="p-4 lg:p-5 bg-custom-pri/5 dark:bg-color-orange/[0.025] shadow-lg rounded-lg">
        <div
          className="relative border border-custom-pri border-opacity-30
         rounded-lg shadow-sm snap-always snap-center overflow-hidden"
        >
          <div className="w-full h-64 container relative">
            <Carousel>
              {post.image.map((url, index) => (
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
          <h3 className="font-light text-2xl  my-1 p-1 text-custom-pri dark:text-color-orange">
            {post.title}
          </h3>
          <p className="flex items-center mb-1 text-sm">
            <GiAirplaneDeparture />
            &nbsp;
            {format(new Date(post.start_date), "dd MMM yyyy")}&nbsp;
            <GiAirplaneArrival />
            &nbsp;
            {format(new Date(post.return_date), "dd MMM yyyy")}
          </p>
          <div className="flex justify-between">
            <p className="flex justify-between items-center text-sm">
              <FaCalendarDays />
              &nbsp;
              {differenceInDays(
                parseISO(post.return_date),
                parseISO(post.start_date)
              ) + 1}
              &nbsp; Days
            </p>
            <p className="flex items-center gap-4 text-sm">
              <LiaRupeeSignSolid />
              {new Intl.NumberFormat("en-IN", {
                maximumSignificantDigits: 3,
              }).format(post.price)}
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
            {/* <PiChatCircleThin className="hover:text-custom-pri dark:text-color-orange" /> */}
            <CiShare2
              onClick={handleShare}
              className="hover:text-custom-pri dark:text-color-orange cursor-pointer"
            />
          </div>
          <Link href={post.url} legacyBehavior>
            <div className="btn-dark-light px-2 py-1">trip details..</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function AllTrips() {
  const [posts, setPosts] = useState<Trip[]>([]);
  const [visiblePostsCount, setVisiblePostsCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get("/api/trips");
        const data = response.data;

        const tripsWithDuration = data.map((trip: Trip) => ({
          ...trip,
          url: `/trips/${trip.id}`, // Ensure URL is correctly set
          start_date: trip.start_date,
          return_date: trip.return_date,
        }));
        const sortedTrips = tripsWithDuration.sort((a: Trip, b: Trip) =>
          sortOrder === "asc"
            ? compareAsc(parseISO(a.start_date!), parseISO(b.start_date!))
            : compareDesc(parseISO(a.start_date!), parseISO(b.start_date!))
        );

        setPosts(sortedTrips);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
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
    <section className="max-w-6xl flex m-auto justify-between items-center mt-8 px-2">
      <div className="w-full pt-2">
        <h1
          className="h1 px-4
      bg-gradient-to-r from-color-purple via-color-yellow to-color-green text-transparent bg-clip-text"
        >
          Discover experiences, not just destinations.
        </h1>

        <div className="flex items-center justify-center p-2">
          <div className="ml-auto mr-2 flex items-center justify-center w-full max-w-xs relative text-custom-pri dark:text-color-orange">
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 " />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none
               dark:bg-color-gray dark:text-color-white focus:border-custom-pri dark:focus:border-color-orange"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="ml-auto border rounded-full font-semibold text-lg px-2 py-2
        bg-white dark:bg-color-gray 
         hover:border-custom-pri
         dark:border-color-orange
          dark:hover:text-color-orange dark:hover:border-color-white
         hover:text-custom-pri dark:text-color-white 

         hover:shadow-xl 
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
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : filteredPosts
                .slice(0, visiblePostsCount)
                .map((post, idx) => <PostCard key={idx} {...post} />)}
        </div>
        <div className="flex ml-4 mt-4 space-x-4">
          {visiblePostsCount < posts.length && (
            <button
              className="btn-dark-light  px-4 py-2 lg:px-6 lg:py-3"
              onClick={showMorePosts}
            >
              Show More
            </button>
          )}
          {visiblePostsCount > 6 && (
            <button
              className="btn-dark-light  px-4 py-2 lg:px-6 lg:py-3"
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

// components/SkeletonCard.tsx
const SkeletonCard = () => {
  return (
    <div className="flex-none w-full sm:w-1/2 lg:w-1/3 p-4 sm:p-2 ">
      <div className="p-4 lg:p-5 bg-white dark:bg-color-gray shadow-lg rounded-lg animate-pulse">
        <div className="w-full h-64 bg-gray-100/25 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-100/25 dark:bg-color-white/25 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-100/25 dark:bg-color-white/25 rounded w-1/2 mb-2"></div>
        <div className="h-6 bg-gray-100/25 dark:bg-color-white/25 rounded w-full mb-2"></div>
        <div className="h-6 bg-gray-100/25 dark:bg-color-white/25 rounded w-1/3 mb-2"></div>
      </div>
    </div>
  );
};
