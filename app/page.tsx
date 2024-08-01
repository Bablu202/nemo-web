import AboutNemoPage from "@/components/AboutNemoPage";
import AllTrips from "@/components/AllTrips";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import TravelForm from "@/components/TravelForm";

function page() {
  return (
    <div>
      <AllTrips />
      <AboutNemoPage />
      <TravelForm />
      <MobileNav />
      <Footer />
    </div>
  );
}

export default page;
