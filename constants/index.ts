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
    id: "2",
    title: "Gallery",
    url: "/gallery",
  },
  {
    id: "3",
    title: "About us",
    url: "/about",
  },
  {
    id: "4",
    title: "FAQs",
    url: "/faqs",
  },
  {
    id: "5",
    title: "New account",
    url: "#signup",
    onlyMobile: true,
  },
  {
    id: "6",
    title: "Sign in",
    url: "#login",
    onlyMobile: true,
  },
];
export interface FAQ {
  id: string;
  question: string;
  answer: string;
}
export const faqs: FAQ[] = [
  {
    id: "1",
    question: "What are the must-visit tourist attractions in India?",
    answer:
      "India is home to many iconic landmarks such as the Taj Mahal, Jaipur's Amber Fort, Kerala's backwaters, Goa's beaches, and the vibrant cities of Delhi, Mumbai, and Bangalore.",
  },
  {
    id: "2",
    question: "What is the best time to visit India?",
    answer:
      "The best time to visit India depends on the region you plan to visit. Generally, the winter months (October to March) are considered the best time for most parts of India, while the summer months (April to June) can be very hot.",
  },
  {
    id: "3",
    question: "What are the popular dishes to try in India?",
    answer:
      "India offers a diverse range of cuisine. Some popular dishes to try include biryani, butter chicken, dosa, paneer tikka, samosas, and various types of street food.",
  },
  {
    id: "4",
    question: "Do I need a visa to visit India?",
    answer:
      "Yes, most travelers to India require a visa. The type of visa you need depends on your nationality, the purpose of your visit, and the duration of your stay. It's recommended to check with the Indian embassy or consulate in your country for specific visa requirements.",
  },
  {
    id: "5",
    question: "Is it safe to travel to India?",
    answer:
      "India is generally a safe destination for travelers, but it's always important to take common safety precautions such as avoiding isolated areas at night, being cautious of pickpockets, and respecting local customs and traditions.",
  },
  {
    id: "6",
    question: "What are the transportation options in India?",
    answer:
      "India has a well-developed transportation network that includes trains, buses, taxis, auto-rickshaws, and domestic flights. The Indian Railways network is one of the largest in the world and is a popular way to travel between cities.",
  },
  {
    id: "7",
    question:
      "Are there any health precautions I should take before traveling to India?",
    answer:
      "Before traveling to India, it's recommended to consult with a healthcare professional regarding vaccinations, medications for common illnesses such as traveler's diarrhea, and any specific health concerns related to your destination.",
  },
  {
    id: "8",
    question:
      "What are some cultural etiquettes to keep in mind while visiting India?",
    answer:
      "While visiting India, it's important to respect local customs and traditions. This includes dressing modestly, removing shoes before entering temples or homes, greeting people with a 'namaste', and avoiding public displays of affection.",
  },
  {
    id: "9",
    question: "Can I use my mobile phone and access the internet in India?",
    answer:
      "Yes, mobile phone coverage is widely available in India, and you can easily get a local SIM card for voice and data services. Many hotels, restaurants, and cafes also offer free Wi-Fi access.",
  },
  {
    id: "10",
    question: "What should I pack for a trip to India?",
    answer:
      "When packing for a trip to India, it's important to consider the climate and activities you'll be doing. Essentials include lightweight clothing, comfortable shoes, sunscreen, insect repellent, a hat, sunglasses, and any necessary medications or toiletries.",
  },
];
import { GrUserExpert } from "react-icons/gr";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import { BsLuggageFill } from "react-icons/bs";
import { FaBed } from "react-icons/fa";
export interface TravelQuality {
  id: string;
  icon: string;
  title: string;
  text: string;
}
export const travelQuality: TravelQuality[] = [
  {
    id: "1",
    icon: "GrUserExpert",
    title: "Experts on Tour",
    text: "Discover the world with confidence alongside our team of seasoned tour experts. Guiding you through unforgettable experiences, our knowledgeable professionals ensure every moment is enriched with insight and expertise",
  },
  {
    id: "2",
    icon: "FaPersonWalkingLuggage",
    title: "Comfortable Transport",
    text: "Experience unparalleled comfort throughout your journey with our deluxe transportation services. From plush seating to attentive amenities, travel in style and relaxation.",
  },
  {
    id: "3",
    icon: "FaBed",
    title: "Qualitiy Accommodation",
    text: "Elevate your travel experience with our top-tier accommodations, meticulously curated to offer the utmost comfort and luxury. From boutique hotels to lavish resorts, indulge in unparalleled quality and relaxation during your stay.",
  },
  {
    id: "4",
    icon: "BsLuggageFill",
    title: "Find the right luggage",
    text: "Travel effortlessly with our selection of premium luggage solutions tailored to your journey. Discover the perfect blend of style and functionality to accompany you on every adventure.",
  },
];

export interface LandingPageTitle {
  id: string;
  title: string;
  text: string;
}
export const landingPageTitles: LandingPageTitle[] = [
  {
    id: "1",
    title: "Start Your Indian Odyssey Today",
    text: "Ready to embark on the adventure of a lifetime? Explore our handcrafted itineraries, discover hidden gems, and let us help you plan the perfect trip to India. Whether you're a history buff, nature lover, foodie, or spiritual seeker, there's something for everyone in this enchanting land. Your journey to Incredible India begins here!",
  },
  {
    id: "2",
    title: "Reconnect with Your Roots",
    text: "Explore the rich tapestry of India's cultural heritage right in your own backyard. From ancient monuments to traditional festivals, there's no shortage of opportunities to immerse yourself in the vibrant tapestry of Indian culture. Rediscover the hidden gems of your own state or venture beyond to uncover the unique traditions and customs of different regions.",
  },
  {
    id: "3",
    title: "Taste the Flavors of India",
    text: "Indulge your taste buds in the culinary delights of India's diverse cuisines. From street-side chaat to regional specialties, every corner of the country offers a gastronomic adventure waiting to be savored. Whether you're craving spicy street food or indulging in regional delicacies, let your palate guide you on a culinary journey across India.",
  },
  {
    id: "4",
    title: "Experience the Diversity of Nature",
    text: "From the snow-capped peaks of the Himalayas to the sun-kissed beaches of the Andaman Islands, India boasts an unparalleled diversity of natural landscapes. Embark on scenic road trips, trek through pristine forests, or simply unwind amidst the tranquil beauty of nature. There's something for every nature enthusiast right here in our own backyard.",
  },
  {
    id: "5",
    title: "Find Serenity in Sacred Spaces",
    text: "Seek solace and spiritual enlightenment in India's sacred destinations. Whether you're drawn to the peaceful serenity of ancient temples, the tranquil banks of holy rivers, or the serene surroundings of ashrams and meditation centers, India offers a multitude of opportunities for introspection and inner peace.",
  },
  {
    id: "6",
    title: "Travel Responsibly, Travel Sustainably",
    text: "As responsible travelers and proud citizens of India, let's commit to preserving the natural beauty and cultural heritage of our country. Travel sustainably, support local communities, and leave a positive impact wherever you go. Together, let's protect and cherish the treasures of our homeland for generations to come.",
  },
  {
    id: "7",
    title: "Start Your Journey Today",
    text: "Ready to embark on an adventure of a lifetime right here in India? Explore our curated itineraries, discover off-the-beaten-path destinations, and let us help you plan the perfect getaway. Whether you're seeking adventure, relaxation, or cultural immersion, your next great escape awaits in the heart of Incredible India.",
  },
];
import { PiInstagramLogo } from "react-icons/pi";
import { PiFacebookLogo } from "react-icons/pi";
import { PiTwitterLogoLight } from "react-icons/pi";
import { PiTwitchLogo } from "react-icons/pi";
import { PiDiscordLogoLight } from "react-icons/pi";
import { PiTelegramLogoLight } from "react-icons/pi";

export interface FooterContent {
  id: string;
  logo: string;
  title: string;
  url: string;
  isText: boolean;
}
export const footerContent: FooterContent[] = [
  { id: "1", logo: "PiInstagramLogo", title: "", url: "", isText: false },
  { id: "2", logo: "PiTelegramLogoLight", title: "", url: "", isText: false },
  { id: "3", logo: "PiFacebookLogo", title: "", url: "", isText: false },
  { id: "4", logo: "PiTwitterLogoLight", title: "", url: "", isText: false },
  { id: "5", logo: "PiTwitchLogo", title: "", url: "", isText: false },
  { id: "6", logo: "PiDiscordLogoLight", title: "", url: "", isText: false },
];

interface HighlightSlide {
  id: number;
  textLists: string[];
  video: string; // Assuming the video path is a string
  videoDuration: number;
}

const firstVideo = "/videos/first.mp4";
const secondVideo = "/videos/second.mp4";
const thirdVideo = "/videos/third.mp4";
const fourthVideo = "/videos/fourth.mp4";
export const hightlightsSlides: HighlightSlide[] = [
  {
    id: 1,
    textLists: ["Kerela"],
    video: firstVideo,
    videoDuration: 8,
  },
  {
    id: 2,
    textLists: ["North"],
    video: secondVideo,
    videoDuration: 8,
  },
  {
    id: 3,
    textLists: ["Nature"],
    video: thirdVideo,
    videoDuration: 6,
  },
  {
    id: 4,
    textLists: ["party"],
    video: fourthVideo,
    videoDuration: 10,
  },
];
