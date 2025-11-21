import { useState } from "react";
import TourGuideCard from "./TourGuideCard";


const TourGuideList = ({ guides }) => {
  const [showAll, setShowAll] = useState(false);

  // Show first 10 by default
  const visibleGuides = showAll ? guides : guides.slice(0, 10);

  return (
    <div className="my-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Meet Our Tour Guides
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleGuides.map((guide) => (
          <TourGuideCard key={guide.id} guide={guide} />
        ))}
      </div>

      {!showAll && guides.length > 10 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default TourGuideList;
