import { FacebookShareButton, FacebookIcon } from "react-share";
import { motion } from "framer-motion";
import { FiShare2, FiUser, FiCalendar } from "react-icons/fi";

const StoryCard = ({ story }) => {
  const shareUrl = `https://wanderbd.com/story/${story._id}`;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            src={story.image || story.images?.[0] || "https://source.unsplash.com/800x600/?travel,bangladesh"}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Share Button Overlay */}
          <FacebookShareButton
            url={shareUrl}
            quote={story.title}
            className="absolute top-4 right-4 z-10"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#29AB87] hover:text-white transition-colors group/share"
            >
              <FiShare2 className="w-5 h-5 text-gray-800 group-hover/share:text-white" />
            </motion.div>
          </FacebookShareButton>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-gray-800">
              Travel Story
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-[#29AB87] transition-colors">
            {story.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">
            {story.description || story.text}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#29AB87] to-[#4F46E5] flex items-center justify-center">
                {story.user?.image ? (
                  <img
                    src={story.user.image}
                    alt={story.user?.name || "Anonymous"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">
                  {story.user?.name || "Anonymous"}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <FiCalendar className="w-3 h-3" />
                  <span>Traveler</span>
                </div>
              </div>
            </div>

            {/* Read More Indicator */}
            <motion.div
              whileHover={{ x: 5 }}
              className="text-[#29AB87] font-bold text-sm cursor-pointer"
            >
              Read →
            </motion.div>
          </div>
        </div>

        {/* Decorative Gradient */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#29AB87] to-[#4F46E5] rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
};

export default StoryCard;
