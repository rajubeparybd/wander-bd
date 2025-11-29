/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FiInfo } from "react-icons/fi";

const AboutTour = ({ title, description }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Glassmorphism Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100">
        {/* Header with Icon */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#29AB87] to-[#4F46E5] flex items-center justify-center shadow-lg"
          >
            <FiInfo className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h2 className="text-4xl font-black">
              About This{" "}
              <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
                Tour
              </span>
            </h2>
          </div>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <p className="text-gray-700 text-lg leading-relaxed">
            {description}
          </p>

          {/* Decorative Gradient Line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-1 bg-linear-to-r from-[#29AB87] via-[#4F46E5] to-transparent rounded-full mt-6"
          />
        </motion.div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-4 -right-4 w-24 h-24 bg-linear-to-br from-[#29AB87]/20 to-[#4F46E5]/20 rounded-full blur-2xl -z-10"
      />
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-4 -left-4 w-32 h-32 bg-linear-to-br from-[#4F46E5]/20 to-[#29AB87]/20 rounded-full blur-2xl -z-10"
      />
    </motion.section>
  );
};

AboutTour.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default AboutTour;
