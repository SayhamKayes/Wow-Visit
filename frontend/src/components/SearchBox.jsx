import { useState } from "react";
import SearchTabs from "./SearchTabs";
import FlightSearch from "./FlightSearch";
import HotelSearch from "./HotelSearch";
import TourSearch from "./TourSearch";
import VisaSearch from "./VisaSearch";
import "./SearchBox.css";

const sections = {
  Flight: FlightSearch,
  Hotel: HotelSearch,
  Tour: TourSearch,
  Visa: VisaSearch,
};

function SearchBox() {
  const [activeTab, setActiveTab] = useState("Flight");
  const ActiveSection = sections[activeTab];

  return (
    <section className="booking-widget" aria-label="Travel search">
      <SearchTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ActiveSection />
    </section>
  );
}

export default SearchBox;