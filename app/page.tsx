import AboutNemoPage from "@/components/AboutNemoPage";
import AllTrips from "@/components/AllTrips";
import Footer from "@/components/Footer";
import RatingReview from "@/components/RateReview";
import TravelForm from "@/components/TravelForm";

function page() {
  return (
    <div>
      <AllTrips />
      <AboutNemoPage />
      <TravelForm />
      <RatingReview />
      <Footer />
    </div>
  );
}

export default page;
