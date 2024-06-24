import Image from "next/image";
import React from "react";

const LandingPage = () => {
  return (
    <div className="bg-gray-900">
      <div className="relative w-full">
        <Image
          src="https://unsplash.com/photos/b6rs6V_9lH4/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8aGltYWxheWF8ZW58MHx8fHwxNzEzMzMzMDA4fDA&force=true" // Replace with your image URL
          alt="Landing Page Image"
          width={1920}
          height={1080}
          layout="responsive"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-yellow-400 opacity-30">
          <h2 className="head">{landingPageTitle.title}</h2>
          <p>{landingPageTitle.text}</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

const landingPageTitle = {
  id: "7",
  title: "Start Your Journey Today",
  text: "Ready to embark on an adventure of a lifetime right here in India? Explore our curated itineraries, discover off-the-beaten-path destinations, and let us help you plan the perfect getaway. Whether you're seeking adventure, relaxation, or cultural immersion, your next great escape awaits in the heart of Incredible India.",
};
