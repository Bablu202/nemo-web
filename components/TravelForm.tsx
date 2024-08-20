"use client";
import supabase from "@/lib/supabaseClient";
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? 0 : index);
  };

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
          <h2 className="text-2xl mx-auto w-full font-bold text-center mb-4 text-custom-pri dark:text-color-orange">
            Travel Form
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 ml-2 md:ml-6">
                Email Address:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="mobileNumber" className="block mb-2 ml-2 md:ml-6">
                Mobile Number:
              </label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                className="form-input w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 ml-2 md:ml-6">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dob" className="block mb-2 ml-2 md:ml-6">
                Date of Birth:
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="form-input w-full"
              />
            </div>
            <button type="submit" className="btn-dark-light px-2 py-1 ">
              Submit
            </button>
          </form>
        </div>
        {/* faqs */}
        <div className="flex flex-col w-full mx-auto" id="faqs">
          <h3 className="text-xl mx-auto font-semibold mb-4 text-custom-pri dark:text-color-orange">
            Frequently Asked Questions
          </h3>
          <div
            className=" lg:mx-auto py-2 overflow-y-auto scrollbar-hide "
            style={{ maxHeight: "65vh" }}
          >
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className={` lg:mx-auto border rounded-lg shadow-lg p-6 mb-4 transition-all duration-300 
                  ease-in-out cursor-pointer ${
                    openIndex === index
                      ? "bg-custom-pri/20 dark:bg-custom-sec/20 border-custom-pri dark:border-color-orange"
                      : "bg-custom-pri/10 dark:bg-custom-sec/10 border-custom-pri dark:border-color-orange"
                  }`}
                onClick={() => handleClick(index)}
              >
                <h3
                  className={`text-lg font-semibold mb-2  ${
                    openIndex === index
                      ? "text-custom-pri dark:text-color-orange"
                      : "text-gray-800 dark:text-color-white"
                  }`}
                >
                  {faq.question}
                </h3>
                {openIndex === index && (
                  <p
                    className="text-custom-sec dark:text-color-white transition-opacity 
                  duration-300 ease-in-out"
                  >
                    {faq.answer}
                  </p>
                )}
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
    question: "How do I book a trip through this website?",
    answer:
      "To book a trip, select your desired trip package from our list, fill in the required details, and submit your request. Our admin will contact you via email or phone to finalize the booking and provide further instructions.",
  },
  {
    id: "2",
    question: "What happens after I submit a trip request?",
    answer:
      "Once you submit a trip request, our admin team will review it and reach out to you via email or phone call to confirm the details. They will assist you with additional information and guide you through the next steps to finalize your booking.",
  },
  {
    id: "3",
    question: "Will I have a travel guide during the trip?",
    answer:
      "Yes, each trip includes a friendly and knowledgeable travel guide with their own vehicle. They will accompany you and take you to nearby attractions, ensuring you have a smooth and enjoyable experience throughout your trip.",
  },
  {
    id: "4",
    question: "How will I receive updates and details about my trip?",
    answer:
      "During your trip, you will receive live updates through our app, including real-time information and notifications. You will also have access to digital trip details, including itineraries and important information, to keep you organized throughout your journey.",
  },
  {
    id: "5",
    question: "Can I view a detailed itinerary of my trip?",
    answer:
      "Yes, you will receive a detailed itinerary outlining each day's activities and plans once your booking is confirmed. This itinerary will be available through our app and in your digital trip details, so you know what to expect each day.",
  },
  {
    id: "6",
    question: "Are there any specific requirements for the trips?",
    answer:
      "Each trip may have specific requirements or recommendations based on the destination and activities involved. Our admin will provide detailed information about any necessary preparations, packing lists, or special considerations once your booking is confirmed.",
  },
  {
    id: "7",
    question: "Can I customize my trip itinerary?",
    answer:
      "Yes, we offer options to customize your trip itinerary based on your preferences and interests. During the booking process, you can discuss your customization requests with our admin, and we will do our best to tailor the trip to meet your needs.",
  },
  {
    id: "8",
    question: "What should I do if I have special requests or requirements?",
    answer:
      "If you have any special requests or requirements, please mention them when you submit your trip request or communicate them directly to our admin team. We will work to accommodate your needs and ensure a comfortable and enjoyable experience.",
  },
  {
    id: "9",
    question:
      "How do I contact customer support if I have questions or issues?",
    answer:
      "You can contact our customer support team using the contact information provided on our website. For immediate assistance, reach out via email or phone. Our team is here to help with any questions or issues you may have before, during, or after your trip.",
  },
  {
    id: "10",
    question: "What if I need to make changes to my booking?",
    answer:
      "If you need to make changes to your booking, contact our admin team as soon as possible. We will assist you with modifications to your itinerary, dates, or other details, subject to availability and any applicable terms and conditions.",
  },
  {
    id: "11",
    question: "What if I have dietary restrictions or preferences?",
    answer:
      "Please inform us of any dietary restrictions or preferences when booking your trip. We will do our best to accommodate your needs with suitable food options throughout your journey.",
  },
  {
    id: "12",
    question: "Are there any activities or excursions included in the trip?",
    answer:
      "Yes, most of our trips include a range of activities and excursions based on the destination. Your detailed itinerary will outline all included activities and provide information on additional optional excursions that you can choose to participate in.",
  },
  {
    id: "13",
    question: "What should I pack for my trip?",
    answer:
      "Packing recommendations will vary based on the destination and activities. Generally, we suggest packing lightweight clothing, comfortable shoes, sunscreen, insect repellent, a hat, sunglasses, and any necessary medications or toiletries. Specific packing lists will be provided in your trip details.",
  },
  {
    id: "14",
    question: "Is travel insurance included with the trip?",
    answer:
      "Travel insurance is not typically included with the trip package. We recommend purchasing travel insurance separately to cover unexpected events or emergencies during your journey. Check with your insurance provider for appropriate coverage.",
  },
  {
    id: "15",
    question: "Can I get a refund if I need to cancel my trip?",
    answer:
      "Our cancellation policy varies depending on the trip package and timing of the cancellation. Please review our terms and conditions for detailed information on refunds and cancellation policies. Contact our admin team for assistance with cancellations and refunds.",
  },
  {
    id: "16",
    question: "How can I provide feedback about my trip?",
    answer:
      "We value your feedback and encourage you to share your experience with us. After your trip, you will receive a feedback form where you can provide comments and suggestions. Your feedback helps us improve our services and ensures a better experience for future travelers.",
  },
];
