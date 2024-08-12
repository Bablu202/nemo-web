// components/Dashboard.tsx
"use client";
import AnalyticsManage from "@/components/dashboardComponents/AnalyticsManage";
import TripManage from "@/components/dashboardComponents/TripManage";
import UserManage from "@/components/dashboardComponents/UserManage";
import React, { useState, useEffect } from "react";
import { FaMapMarkedAlt, FaUserFriends, FaChartBar } from "react-icons/fa";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("AnalyticsManage");
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const renderTabContent = () => {
    switch (activeTab) {
      case "TripManage":
        return <TripManage />;
      case "UserManage":
        return <UserManage />;
      case "AnalyticsManage":
        return <AnalyticsManage />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        // Scrolling down
        setIsTabBarVisible(false);
      } else {
        // Scrolling up
        setIsTabBarVisible(true);
      }

      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop); // For mobile or negative scrolling
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <div className="max-w-6xl flex flex-col mx-auto">
      {/* Tab Bar */}
      <div
        className={`fixed top-14 left-0 right-0 z-50 transition-transform duration-300  ${
          isTabBarVisible ? "translate-y-0" : "-translate-y-28"
        }`}
      >
        <div className="flex max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto justify-around bg-white/95 px-4 py-2 shadow-xl rounded-b-lg">
          <button
            onClick={() => setActiveTab("TripManage")}
            className={`flex flex-col items-center px-4 py-2 rounded lg:text-lg transition-all duration-300 ${
              activeTab === "TripManage"
                ? "bg-custom-pri text-white shadow-md"
                : ""
            }`}
          >
            <FaMapMarkedAlt className="block lg:hidden text-xl" />
            <span className="hidden lg:block">Trip Manage</span>
          </button>
          <button
            onClick={() => setActiveTab("UserManage")}
            className={`flex flex-col items-center px-4 py-2 rounded lg:text-lg transition-all duration-300 ${
              activeTab === "UserManage"
                ? "bg-custom-pri text-white shadow-md"
                : ""
            }`}
          >
            <FaUserFriends className="block lg:hidden text-xl" />
            <span className="hidden lg:block">User Manage</span>
          </button>
          <button
            onClick={() => setActiveTab("AnalyticsManage")}
            className={`flex flex-col items-center px-4 py-2 rounded lg:text-lg transition-all duration-300 ${
              activeTab === "AnalyticsManage"
                ? "bg-custom-pri text-white shadow-md"
                : ""
            }`}
          >
            <FaChartBar className="block lg:hidden text-xl" />
            <span className="hidden lg:block">Analytics Manage</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-20">{renderTabContent()}</div>
    </div>
  );
};

export default Dashboard;
