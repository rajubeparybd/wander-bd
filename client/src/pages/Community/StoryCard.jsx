/* eslint-disable no-unused-vars */
import { FacebookShareButton, FacebookIcon } from "react-share";
import { motion } from "framer-motion";
import { FiShare2, FiUser, FiCalendar, FiHeart, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const StoryCard = ({ story }) => {
  const navigate = useNavigate();
  const shareUrl = `https://wanderbd.com/story/${story._id}`;

  const handleReadMore = () => {
    navigate(`/story/${story._id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group h-full cursor-pointer"
      onClick={handleReadMore}
    >
      <div className="relative bg-linear-to-br from-white via-gray-50 to-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-72 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={story.image || story.images?.[0] || "https://source.unsplash.com/800x600/?travel,bangladesh"}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500" />
          
          {/* Share Button Overlay */}
          <FacebookShareButton
            url={shareUrl}
            quote={story.title}
            className="absolute top-4 right-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              whileHover={{ scale: 1.15, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-linear-to-br hover:from-[#29AB87] hover:to-[#4F46E5] transition-all duration-300 group/share border border-white/20"
            >
              <FiShare2 className="w-5 h-5 text-gray-800 group-hover/share:text-white transition-colors" />
            </motion.div>
          </FacebookShareButton>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-linear-to-r from-[#29AB87] to-[#4F46E5] rounded-full shadow-lg"
            >
              <span className="text-white text-xs font-bold tracking-wide">TRAVEL STORY</span>
            </motion.div>
          </div>

          {/* Title Overlay on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2 line-clamp-2 group-hover:text-[#29AB87] transition-colors duration-300 drop-shadow-lg">
              {story.title}
            </h3>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 grow flex flex-col bg-white">
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 grow leading-relaxed">
            {story.description || story.text}
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-4" />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-linear-to-br from-[#29AB87] to-[#4F46E5] flex items-center justify-center ring-2 ring-white shadow-lg">
                  {story.user?.image ? (
                    <img
                      src={story.user.image}
                      alt={story.user?.name || "Anonymous"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-6 h-6 text-white" />
                  )}
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
              </div>

              {/* User Info */}
              <div>
                <div className="text-sm font-bold text-gray-800">
                  {story.user?.name || "Anonymous"}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <FiMapPin className="w-3 h-3" />
                  <span>Traveler</span>
                </div>
              </div>
            </div>

            {/* Read More Button */}
            <motion.div
              whileHover={{ x: 5, scale: 1.05 }}
              onClick={(e) => {
                e.stopPropagation();
                handleReadMore();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white rounded-full font-bold text-sm cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              <span>Read</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Decorative Gradients */}
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-linear-to-br from-[#29AB87] to-[#4F46E5] rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700" />
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-linear-to-br from-[#4F46E5] to-[#9333EA] rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-all duration-700" />
      </div>
    </motion.div>
  );
};

export default StoryCard;
