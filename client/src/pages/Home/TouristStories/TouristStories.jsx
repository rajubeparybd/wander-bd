/* eslint-disable no-unused-vars */
import { FacebookShareButton } from "react-share";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { motion } from "framer-motion";
import { FiShare2, FiUser, FiMapPin } from "react-icons/fi";

const TouristStories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axios = useAxios();
  const baseUrl = import.meta.env.VITE_BASE_URL;
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
              whileHover={{ y: -10, scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => user && navigate(`/story/${story._id}`)}
            >
              <div className="relative bg-linear-to-br from-white via-gray-50 to-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden h-full flex flex-col">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src={story.images?.[0] || "https://source.unsplash.com/800x600/?travel,bangladesh"}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Share Button Overlay */}
                  {user && (
                    <FacebookShareButton
                      url={`${baseUrl}/story/${story._id}`}
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
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-linear-to-r from-[#29AB87] to-[#4F46E5] rounded-full shadow-lg"
                    >
                      <span className="text-white text-xs font-bold tracking-wide">TRAVEL STORY</span>
                    </motion.div>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2 line-clamp-2 group-hover:text-[#29AB87] transition-colors duration-300 drop-shadow-lg">
                      {story.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 grow flex flex-col bg-white">
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 grow leading-relaxed">
                    {story.text}
                  </p>

                  <div className="w-full h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-linear-to-br from-[#29AB87] to-[#4F46E5] flex items-center justify-center ring-2 ring-white shadow-lg">
                          <FiUser className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">
                          {story.userName || "Anonymous"}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <FiMapPin className="w-3 h-3" />
                          <span>Traveler</span>
                        </div>
                      </div>
                    </div>

                    {!user ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/login");
                        }}
                        className="px-4 py-2 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white rounded-full font-bold text-xs shadow-lg hover:shadow-xl transition-all"
                      >
                        Login
                      </motion.button>
                    ) : (
                      <motion.div
                        whileHover={{ x: 5, scale: 1.05 }}
                        onClick={() => navigate(`/story/${story._id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                      >
                        <span>Read</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Decorative Gradients */}
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-linear-to-br from-[#29AB87] to-[#4F46E5] rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700" />
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-linear-to-br from-[#4F46E5] to-[#9333EA] rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-all duration-700" />
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
            <Link to="/community">
              View All Stories →
            </Link>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TouristStories;
