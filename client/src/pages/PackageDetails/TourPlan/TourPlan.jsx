// src/pages/PackageDetails/TourPlan.jsx

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import PropTypes from "prop-types";

const TourPlan = ({ plan }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="my-10 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 border-b-2 pb-2 border-primary">Tour Plan</h2>
      <div className="space-y-4">
        {plan.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-md shadow-sm">
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 font-medium text-left"
            >
              <span>{item.day}</span>
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openIndex === index && (
              <div className="p-4 bg-white text-gray-700">
                {item.activities}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

TourPlan.propTypes = {
  plan: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      activities: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TourPlan;
