import { FacebookShareButton } from "react-share";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { motion } from "framer-motion";
import { FiShare2, FiUser, FiMapPin } from "react-icons/fi";

const TouristStories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axios = useAxios();

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const res = await axios.get("/stories");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-32 flex justify-center bg-white">
        <div className="w-16 h-16 border-4 border-[#29AB87] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const randomStories = stories.sort(() => 0.5 - Math.random()).slice(0, 6);

  return (
    <section className="py-32 px-4 md:px-8 lg:px-16 bg-white">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-6">
            Traveler{' '}
            <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real adventures, real people, real Bangladesh
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {randomStories.map((story, index) => (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden h-full">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={story.images?.[0] || "https://source.unsplash.com/800x600/?travel,bangladesh"}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                  {/* Share Button Overlay */}
                  {user && (
                    <FacebookShareButton
                      url={`https://wanderbd.com/story/${story._id}`}
                      className="absolute top-4 right-4"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                      >
                        <FiShare2 className="text-black w-5 h-5" />
                      </motion.div>
                    </FacebookShareButton>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{story.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{story.text}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiUser className="w-4 h-4" />
                      <span>{story.userName || "Anonymous"}</span>
                    </div>
                    {!user && (
                      <button
                        onClick={() => navigate("/login")}
                        className="text-[#29AB87] text-sm font-semibold hover:underline"
                      >
                        Login to Share
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/community")}
            className="px-10 py-4 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            View All Stories →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TouristStories;
