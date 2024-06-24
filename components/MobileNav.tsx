/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { CiHome } from "react-icons/ci";
import { CiUser } from "react-icons/ci";

const MobileNav: React.FC = () => {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      // Scrolling down
      setShowNav(false);
    } else {
      // Scrolling up
      setShowNav(true);
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]); // Only add the event listener once, on mount

  return (
    <nav
      className={`lg:hidden fixed bottom-2 left-1/2 transform -translate-x-1/2 w-2/3 h-16 transition-transform duration-300 ${
        showNav ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div
        className="flex justify-around items-center w-full h-full  px-6 bg-white/95 
    backdrop-blur-lg shadow-lg rounded-full "
      >
        {navigationData.map((item: NavigationItem) => (
          <Link
            key={item.id}
            href={item.url}
            className="flex flex-col items-center justify-center space-y-1 group"
          >
            <item.icon className="text-2xl group-hover:text-custom-pri transition-colors duration-200" />
            <span className="text-sm group-hover:text-custom-pri transition-colors duration-200">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;

export interface NavigationItem {
  id: string;
  title: string;
  url: string;
  onlyMobile?: boolean;
  icon: any;
}

export const navigationData: NavigationItem[] = [
  {
    id: "0",
    title: "Home",
    url: "/home",
    icon: CiHome,
  },
  {
    id: "1",
    title: "Explore",
    url: "/trips",
    icon: CiSearch,
  },
  {
    id: "4",
    title: "User",
    url: "/user",
    icon: CiUser,
  },
  /*{
    id: "5",
    title: "New account",
    url: "/register",
    onlyMobile: false,
    },
    {
      id: "6",
      title: "Account",
      url: "/profile",
      onlyMobile: false,
      },*/
];
