import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiUsers, FiHeart, FiShare2, FiTrendingUp } from "react-icons/fi";
import StoryCard from "./StoryCard";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Community = () => {
  const axios = useAxiosSecure();

  const { data: stories = [], isLoading, isError } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const res = await axios.get("/stories");
      return res.data;
    },
  });

  const stats = [
    { icon: FiUsers, label: "Active Travelers", value: "10k+", color: "from-[#29AB87] to-[#06B6D4]" },
    { icon: FiHeart, label: "Stories Shared", value: stories.length || "0", color: "from-[#4F46E5] to-[#9333EA]" },
    { icon: FiShare2, label: "Total Shares", value: "25k+", color: "from-[#06B6D4] to-[#4F46E5]" },
    { icon: FiTrendingUp, label: "Monthly Views", value: "100k+", color: "from-[#9333EA] to-[#29AB87]" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-x-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 right-0 w-72 h-72 bg-[#29AB87]/30 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-20 left-0 w-72 h-72 bg-[#4F46E5]/30 rounded-full filter blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-6 py-2 bg-[#29AB87]/10 text-[#29AB87] rounded-full text-sm font-bold mb-6"
            >
              Share Your Journey
            </motion.span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Community{' '}
              <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
                Stories
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover authentic travel experiences from fellow adventurers exploring the beauty of Bangladesh
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stories Section */}
      <section className="px-4 pb-32">
        <div className="max-w-7xl mx-auto">
          {isLoading && (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-[#29AB87] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {isError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <p className="text-xl text-red-600 font-semibold">Failed to load stories</p>
              <p className="text-gray-600 mt-2">Please try again later</p>
            </motion.div>
          )}

          {!isLoading && !isError && stories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-xl text-gray-600 font-semibold">No stories yet</p>
              <p className="text-gray-500 mt-2">Be the first to share your adventure!</p>
            </motion.div>
          )}

          {!isLoading && !isError && stories.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {stories.map((story, index) => (
                <motion.div
                  key={story._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <StoryCard story={story} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Community;
