"use client";
import supabase from "@/lib/supabase/supabase";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  email: string;
  mobileNumber: string;
  name: string;
  dob: string;
}

const TravelForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    mobileNumber: "",
    name: "",
    dob: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // You can handle form submission here, e.g., send data to backend
    console.log(formData);
    try {
      const { data, error } = await supabase
        .from("nemo_registerForm")
        .insert([formData]);
      if (error) {
        throw error;
      }
      console.log("Form submitted successfully:", data);
      // Reset form after submission
      setFormData({
        email: "",
        mobileNumber: "",
        name: "",
        dob: "",
      });
    } catch (error: any) {
      console.error("Error submitting form:", error.message);
    }
    // Reset form after submission
    setFormData({
      email: "",
      mobileNumber: "",
      name: "",
      dob: "",
    });
  };

  return (
    <section className="max-w-6xl flex m-auto " id="travel-form">
      <div className="px-2 py-3 flex flex-col lg:flex-row" id="contact">
        <div className="container p-4 sm:p-2 m-atuo  lg:mr-auto mb-8">
          <h2 className="text-2xl font-bold text-center mb-4">Travel Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">
                Email Address:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="mobileNumber" className="block mb-2">
                Mobile Number:
              </label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dob" className="block mb-2">
                Date of Birth:
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="form-btn ">
              Submit
            </button>
          </form>
        </div>
        {/* faqs */}
        <div className="flex flex-col w-full" id="faqs">
          <h3 className="text-xl font-semibold mb-4">
            Frequently asked questions..
          </h3>
          <div
            className="lg:mx-auto  py-2 overflow-y-auto scrollbar-hide"
            style={{ maxHeight: "65vh" }}
          >
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-custom-pri rounded-lg shadow-lg p-6 mb-4 bg-custom-pri/5"
              >
                <h3 className="text-lg font-semibold mb-2 ">{faq.question}</h3>
                <p className="">{faq.answer}</p>
              </div>
            ))}
          </div>
          <a
            className="bg-custom-pri w-1 lg:hidden rounded-3xl"
            href="#review"
          />
        </div>
      </div>
    </section>
  );
};

export default TravelForm;

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
