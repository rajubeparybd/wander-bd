import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiArrowLeft, FiUser, FiCalendar, FiMapPin, FiShare2, FiHeart } from "react-icons/fi";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const StoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axios = useAxiosSecure();

  const { data: story, isLoading, isError } = useQuery({
    queryKey: ["story", id],
    queryFn: async () => {
      const res = await axios.get(`/stories/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 border-4 border-[#29AB87] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading story...</p>
        </motion.div>
      </div>
    );
  }

  if (isError || !story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-3xl shadow-2xl border border-gray-100"
        >
          <div className="text-6xl mb-4">😞</div>
          <p className="text-xl text-red-500 font-semibold mb-4">Story not found</p>
          <button
            onClick={() => navigate("/community")}
            className="px-6 py-3 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white rounded-full font-bold hover:shadow-xl transition-all"
          >
            Back to Community
          </button>
        </motion.div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/story/${story._id}`;
  const mainImage = story.image || story.images?.[0] || "https://source.unsplash.com/1200x800/?travel,bangladesh";

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[70vh] overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={mainImage}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/50 to-black/80" />
        </div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate("/community")}
          className="absolute top-24 left-4 md:left-8 z-10 flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-semibold hover:bg-white/30 transition-all"
        >
          <FiArrowLeft className="text-xl" />
          <span>Back</span>
        </motion.button>

        {/* Content */}
        <div className="relative h-full max-w-5xl mx-auto px-4 md:px-8 flex flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 bg-linear-to-r from-[#29AB87] to-[#4F46E5] rounded-full text-white text-sm font-bold tracking-wide shadow-lg">
                TRAVEL STORY
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
            >
              {story.title}
            </motion.h1>

            {/* Author Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-3 px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-linear-to-br from-[#29AB87] to-[#4F46E5] flex items-center justify-center">
                  {story.user?.image || story.authorPhoto ? (
                    <img
                      src={story.user?.image || story.authorPhoto}
                      alt={story.user?.name || story.authorName || "Author"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <div className="text-white font-bold">
                    {story.user?.name || story.authorName || "Anonymous"}
                  </div>
                  <div className="text-white/80 text-sm">Traveler</div>
                </div>
              </div>

              {story.location && (
                <div className="flex items-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl">
                  <FiMapPin className="text-[#29AB87] text-xl" />
                  <span className="text-white font-semibold">{story.location}</span>
                </div>
              )}

              {story.createdAt && (
                <div className="flex items-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl">
                  <FiCalendar className="text-[#4F46E5] text-xl" />
                  <span className="text-white font-semibold">
                    {new Date(story.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Story Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {/* Story Text */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {story.description || story.text}
                </p>
              </div>
            </div>

            {/* Image Gallery */}
            {story.images && story.images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
              >
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-linear-to-b from-[#29AB87] to-[#4F46E5] rounded-full" />
                  Photo Gallery
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {story.images.slice(1).map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                    >
                      <img
                        src={image}
                        alt={`${story.title} - ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-6">
              {/* Share Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                  <FiShare2 className="text-[#29AB87]" />
                  Share Story
                </h3>
                <div className="flex gap-3">
                  <FacebookShareButton url={shareUrl} quote={story.title}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg hover:shadow-xl transition-all"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </motion.div>
                  </FacebookShareButton>

                  <TwitterShareButton url={shareUrl} title={story.title}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 bg-[#1DA1F2] rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg hover:shadow-xl transition-all"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </motion.div>
                  </TwitterShareButton>

                  <WhatsappShareButton url={shareUrl} title={story.title}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg hover:shadow-xl transition-all"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </motion.div>
                  </WhatsappShareButton>
                </div>
              </div>

              {/* Author Card */}
              <div className="bg-linear-to-br from-[#29AB87]/10 to-[#4F46E5]/10 rounded-3xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-black mb-4">About the Author</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-[#29AB87] to-[#4F46E5] flex items-center justify-center ring-4 ring-white shadow-lg">
                    {story.user?.image || story.authorPhoto ? (
                      <img
                        src={story.user?.image || story.authorPhoto}
                        alt={story.user?.name || story.authorName || "Author"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">
                      {story.user?.name || story.authorName || "Anonymous"}
                    </div>
                    <div className="text-sm text-gray-600">Travel Enthusiast</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Passionate traveler sharing authentic experiences from beautiful Bangladesh.
                </p>
              </div>

              {/* CTA Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-linear-to-br from-[#29AB87] to-[#4F46E5] rounded-3xl shadow-xl p-6 text-white cursor-pointer"
                onClick={() => navigate("/community")}
              >
                <FiHeart className="text-3xl mb-3" />
                <h3 className="text-xl font-black mb-2">Love this story?</h3>
                <p className="text-white/90 text-sm mb-4">
                  Discover more amazing travel experiences from our community
                </p>
                <div className="flex items-center gap-2 font-bold">
                  <span>Explore More Stories</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetails;