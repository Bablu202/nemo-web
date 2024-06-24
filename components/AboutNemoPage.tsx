import { IconType } from "react-icons/lib";

const AboutNemoPage = () => {
  return (
    <section className="max-w-6xl flex m-auto">
      <div className="py-8 " id="magazine">
        <div className="mx-auto px-4 ">
          <h2 className="text-3xl font-bold text-left mb-8 flex items-center">
            Travel Quality
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {travelQuality.map((item: TravelQuality) => (
              <div key={item.id} className="flex flex-col items-center">
                <item.icon className="w-16 h-16 text-custom-pri mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-left">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutNemoPage;

import { BsFillPersonCheckFill } from "react-icons/bs";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import { BsLuggageFill } from "react-icons/bs";
import { IoBedSharp } from "react-icons/io5";
export interface TravelQuality {
  id: string;
  icon: IconType; // Adjust the prop type as needed
  title: string;
  text: string;
}

const travelQuality: TravelQuality[] = [
  {
    id: "1",
    icon: BsFillPersonCheckFill,
    title: "Experts on Tour",
    text: "Discover the world confidently with our seasoned tour experts. Guiding you through unforgettable experiences, our professionals enrich every moment with insight.",
  },
  {
    id: "2",
    icon: FaPersonWalkingLuggage,
    title: "Comfortable Transport",
    text: "Experience unparalleled comfort with our deluxe transportation services. From plush seating to attentive amenities, travel in style and relaxation.",
  },
  {
    id: "3",
    icon: IoBedSharp,
    title: "Quality Accommodation",
    text: "Elevate your experience with our top-tier accommodations, curated for utmost comfort and luxury. Indulge in unparalleled quality during your stay.",
  },
  {
    id: "4",
    icon: BsLuggageFill,
    title: "Find the right luggage",
    text: "Travel effortlessly with our selection of premium luggage tailored to your journey. Discover the perfect blend of style and functionality for every adventure.",
  },
];
