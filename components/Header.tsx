/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { GiClownfish } from "react-icons/gi";

const Header: React.FC = () => {
  const [openNavigation, setOpenNavigation] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down and beyond a certain point (e.g., 100px)
      setShowHeader(false);
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up
      setShowHeader(true);
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <header
      className="mb-24"
      style={{
        transform: `translateY(${showHeader ? "0" : "-100%"})`,
        transition: "transform 0.3s ease-in-out",
        position: "fixed",
        width: "100%",
        top: "0",
        zIndex: "1000",
      }}
    >
      <div className="sticky top-0 z-10 shadow-xl mb-4   m-auto justify-between items-center">
        <div className="bg-white/95 backdrop-blur-sm  border-b border-b-custom-sec border-opacity-20">
          <div className="max-w-6xl py-1.5 m-auto flex items-center justify-between">
            <div className="px-5 py-1 lg:px-4 ">
              <a href="/home" className="text-xl font-normal xl:text-2xl">
                <p className="flex items-center gap-3">
                  <GiClownfish className="text-custom-sec" />
                  Travelling
                  <span className="text-custom-pri font-bold"> NEMO</span>
                </p>
              </a>
            </div>
            <nav
              className={`${
                openNavigation ? "flex w-full my-10" : "hidden"
              } fixed top-0 left-0 bottom-0 lg:ml-auto lg:static lg:flex`}
            >
              <div
                onClick={handleClick}
                className={`z-2 flex flex-col justify-center gap-5 m-auto lg:flex-row  ${
                  openNavigation
                    ? "w-screen h-screen shadow-lg backdrop-blur-lg "
                    : "w-max  "
                }`}
              >
                <div
                  className={` transition-transform duration-300 ease-in-out ${
                    openNavigation
                      ? "mt-8 w-1/2 flex flex-col backdrop-blur-3xl bg-white/90 mb-auto ml-auto shadow-xl "
                      : ""
                  } `}
                >
                  {navigationData.map((item: NavigationItem) => (
                    <Link
                      key={item.id}
                      className={`uppercase my-4 text-right mx-6 rounded-md font-bold  text-2xl leading-10 lg:text-base 
                      lg:font-semibold tracking-wide px-2 py-2 transition-colors
                       hover:text-white hover:bg-custom-pri hover:shadow-lg lg:pt-0 lg:mx-4 lg:p-1.5 
                       ${
                         false
                           ? "text-custom-pri underline underline-offset-4"
                           : ""
                       } ${item?.onlyMobile && "lg:hidden"}`}
                      href={item.url}
                    >
                      {item.title}
                    </Link>
                  ))}{" "}
                </div>
              </div>
            </nav>
            <SmallDevicesMenu
              onClick={toggleNavigation}
              openNavigation={openNavigation}
            />
            <div className="hidden z-20  cursor-pointer lg:block">
              {/* TODO:account info */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

interface SmallDevicesMenuProps {
  onClick: () => void;
  openNavigation: boolean;
}

const SmallDevicesMenu: React.FC<SmallDevicesMenuProps> = ({
  onClick,
  openNavigation,
}) => {
  return (
    <div
      onClick={onClick}
      className="z-10 fixed top-8 right-3 w-10 h-8 cursor-pointer "
    >
      <div
        className={`z-10 fixed top-2 right-2 w-10 h-2 lg:hidden ${
          openNavigation ? "-mt-6 " : ""
        }`}
      >
        <div
          className={`fixed border border-custom-pri w-8 transition-all mt-3 ${
            openNavigation ? "  rotate-45 mt-9 border-white" : ""
          }`}
        />

        <div
          className={`fixed border border-custom-pri w-8 mt-6 transition-all ${
            openNavigation ? " -rotate-45 mt-9 border-white" : ""
          }`}
        />
      </div>
    </div>
  );
};

export interface NavigationItem {
  id: string;
  title: string;
  url: string;
  onlyMobile?: boolean;
}

export const navigationData: NavigationItem[] = [
  {
    id: "0",
    title: "Home",
    url: "/home",
  },
  {
    id: "1",
    title: "Trips",
    url: "/trips",
  },
  {
    id: "3",
    title: "About",
    url: "/about",
  },
  {
    id: "4",
    title: "User",
    url: "/user",
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

export default Header;
