/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import { FiUsers } from "react-icons/fi";
import TourGuideCard from "./TourGuideCard";

const TourGuideList = ({ guides }) => {
  const [showAll, setShowAll] = useState(false);

  // Show first 8 by default
  const visibleGuides = showAll ? guides : guides.slice(0, 8);

  if (!guides || guides.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#29AB87] to-[#06B6D4] flex items-center justify-center shadow-lg"
          >
            <FiUsers className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h2 className="text-4xl font-black">
              Meet Your{" "}
              <span className="bg-linear-to-r from-[#29AB87] to-[#06B6D4] bg-clip-text text-transparent">
                Tour Guides
              </span>
            </h2>
            <p className="text-gray-600 mt-1">Expert local guides ready to show you around</p>
          </div>
        </div>
        <span className="text-gray-500 font-semibold">{guides.length} Guides</span>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {visibleGuides.map((guide, index) => (
          <motion.div
            key={guide.id || guide._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <TourGuideCard guide={guide} />
          </motion.div>
        ))}
      </div>

      {/* Show More Button */}
      {!showAll && guides.length > 8 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(true)}
            className="px-8 py-4 bg-linear-to-r from-[#29AB87] to-[#06B6D4] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
          >
            View All {guides.length} Guides
          </motion.button>
        </motion.div>
      )}
    </motion.section>
  );
};

export default TourGuideList;
