/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CiSearch, CiHome, CiUser } from "react-icons/ci";
import { usePathname } from "next/navigation"; // Import usePathname from next/navigation

const MobileNav: React.FC = () => {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname(); // Get the current pathname

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
  }, [lastScrollY]);

  // Hide the nav if the pathname is /dashboard
  useEffect(() => {
    if (pathname.startsWith("/dashboard")) {
      setShowNav(false);
    }
  }, [pathname]);

  if (pathname.startsWith("/dashboard")) {
    return null; // Don't render the component if on /dashboard page
  }

  return (
    <nav
      className={`lg:hidden fixed bottom-2 left-1/2 transform -translate-x-1/2 w-2/3 h-12 md:h-16 transition-transform duration-300 ${
        showNav ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex justify-around items-center w-full h-full px-5 md:px-6 bg-white/95 backdrop-blur-lg shadow-2xl rounded-full">
        {navigationData.map((item: NavigationItem) => (
          <Link
            key={item.id}
            href={item.url}
            className="flex flex-col items-center justify-center group"
          >
            <item.icon className="text-xl sm:text-2xl md:text-3xl group-hover:text-custom-pri transition-colors duration-200" />
            <span className="font-semibold text-xs md:text-sm group-hover:text-custom-pri transition-colors duration-200">
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
];
