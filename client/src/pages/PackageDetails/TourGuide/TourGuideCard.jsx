/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiGlobe, FiAward } from "react-icons/fi";

const TourGuideCard = ({ guide }) => {
  return (
    <Link to={`/guides/${guide._id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-[#29AB87] transition-all duration-300 group h-full"
      >
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={guide.image}
            alt={guide.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="absolute top-3 right-3 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-semibold"
          >
            Verified
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Name */}
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#29AB87] transition-colors">
            {guide.name}
          </h3>

          {/* Experience */}
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#29AB87]/20 to-[#4F46E5]/20 flex items-center justify-center">
              <FiAward className="w-4 h-4 text-[#29AB87]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Experience</p>
              <p className="text-sm font-semibold">{guide.experience}</p>
            </div>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#4F46E5]/20 to-[#9333EA]/20 flex items-center justify-center">
              <FiGlobe className="w-4 h-4 text-[#4F46E5]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Languages</p>
              <p className="text-sm font-semibold line-clamp-1">
                {Array.isArray(guide.languages) ? guide.languages.join(", ") : guide.languages}
              </p>
            </div>
          </div>

          {/* View Profile Link */}
          <div className="pt-2 flex items-center gap-2 text-[#29AB87] font-semibold text-sm group-hover:gap-3 transition-all">
            <span>View Profile</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default TourGuideCard;
