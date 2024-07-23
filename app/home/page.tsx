import AboutNemoPage from "@/components/AboutNemoPage";
import AllTrips from "@/components/AllTrips";
import Footer from "@/components/Footer";
import TravelForm from "@/components/TravelForm";

const Home = () => {
  return (
    <div>
      <AllTrips />
      <AboutNemoPage />
      <TravelForm />
      <Footer />
    </div>
  );
};

export default Home;
