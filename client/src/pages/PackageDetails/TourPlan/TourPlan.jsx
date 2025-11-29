/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiCalendar } from "react-icons/fi";
import PropTypes from "prop-types";

const TourPlan = ({ plan }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (!plan || plan.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center shadow-lg"
        >
          <FiCalendar className="w-7 h-7 text-white" />
        </motion.div>
        <h2 className="text-4xl font-black">
          Tour{" "}
          <span className="bg-linear-to-r from-[#4F46E5] to-[#9333EA] bg-clip-text text-transparent">
            Itinerary
          </span>
        </h2>
      </div>

      {/* Accordion Items */}
      <div className="space-y-4">
        {plan.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Glassmorphism Card */}
            <div
              className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border transition-all duration-300 overflow-hidden ${
                openIndex === index
                  ? "border-[#4F46E5] shadow-2xl"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Header Button */}
              <motion.button
                onClick={() => toggle(index)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex justify-between items-center p-6 text-left group"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Day Number Badge */}
                  <motion.div
                    animate={{
                      scale: openIndex === index ? 1.1 : 1,
                    }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-all ${
                      openIndex === index
                        ? "bg-linear-to-br from-[#4F46E5] to-[#9333EA]"
                        : "bg-linear-to-br from-gray-400 to-gray-500 group-hover:from-[#4F46E5] group-hover:to-[#9333EA]"
                    }`}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Day Title */}
                  <span
                    className={`text-lg font-bold transition-colors ${
                      openIndex === index
                        ? "text-[#4F46E5]"
                        : "text-gray-800 group-hover:text-[#4F46E5]"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>

                {/* Chevron Icon */}
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    openIndex === index
                      ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                      : "bg-gray-100 text-gray-500 group-hover:bg-[#4F46E5]/10 group-hover:text-[#4F46E5]"
                  }`}
                >
                  <FiChevronDown className="w-5 h-5" />
                </motion.div>
              </motion.button>

              {/* Content */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2">
                      {/* Divider */}
                      <div className="h-px bg-linear-to-r from-[#4F46E5] via-[#9333EA] to-transparent mb-4" />

                      {/* Activities */}
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-700 leading-relaxed pl-2"
                      >
                        {item.activities}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Connecting Line (except for last item) */}
            {index < plan.length - 1 && (
              <div className="absolute left-[3.5rem] top-[5rem] w-0.5 h-8 bg-linear-to-b from-gray-300 to-transparent -z-10" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="bg-linear-to-br from-[#4F46E5]/10 to-[#9333EA]/10 backdrop-blur-sm rounded-2xl p-6 border border-[#4F46E5]/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center">
              <FiCalendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-700 font-semibold">Total Duration</span>
          </div>
          <span className="text-2xl font-black bg-linear-to-r from-[#4F46E5] to-[#9333EA] bg-clip-text text-transparent">
            {plan.length} {plan.length === 1 ? "Day" : "Days"}
          </span>
        </div>
      </motion.div>
    </motion.section>
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
