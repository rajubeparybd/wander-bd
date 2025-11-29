/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiUsers, FiAward, FiCompass } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <section className="relative min-h-screen bg-linear-to-br from-[#29AB87]/5 via-[#4F46E5]/5 to-[#06B6D4]/5 pt-28 pb-20 overflow-hidden">
      {/* Background Gradient Overlay - Full Width */}
      <div className="absolute inset-0 bg-linear-to-br from-[#29AB87]/10 via-transparent to-[#4F46E5]/10" />
      
      {/* Background Decoration - Full Width */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#29AB87]/30 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#4F46E5]/30 rounded-full filter blur-[120px]" />
      </div>

      <div className="w-full px-4 md:px-8 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-[1600px] mx-auto">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-4 py-2 bg-[#29AB87]/10 text-[#29AB87] rounded-full text-sm font-semibold mb-6">
                #1 Travel Platform in Bangladesh
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight"
            >
              Discover{' '}
              <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
                Bangladesh
              </span>
              <br />
              Like Never Before
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              Connect with expert local guides, explore hidden gems, and create unforgettable memories in the heart of South Asia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-black text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <Link to="/trips">
                  Start Exploring
                </Link>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white border-2 border-gray-200 text-black font-bold rounded-full text-lg hover:border-black transition-colors"
              >
                Watch Video
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8 pt-8"
            >
              <div>
                <div className="text-3xl font-black text-black">50+</div>
                <div className="text-sm text-gray-600">Destinations</div>
              </div>
              <div>
                <div className="text-3xl font-black text-black">200+</div>
                <div className="text-sm text-gray-600">Expert Guides</div>
              </div>
              <div>
                <div className="text-3xl font-black text-black">10k+</div>
                <div className="text-sm text-gray-600">Happy Travelers</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image with Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative min-h-[600px]"
          >
            {/* Floating Card Above Image - Top Left (Outside) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 left-0 bg-white rounded-2xl shadow-2xl p-4 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-[#29AB87] to-[#06B6D4] rounded-xl flex items-center justify-center shrink-0">
                  <FiCompass className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800">Trusted Platform</div>
                  <div className="text-xs text-gray-600">Verified Tours</div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card Above Image - Top Right (Outside) */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-8 -right-8 bg-white rounded-2xl shadow-2xl p-4 z-20"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-linear-to-br from-[#4F46E5] to-[#9333EA] rounded-xl flex items-center justify-center">
                  <FiStar className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-xs text-gray-600">10k+ Reviews</div>
                </div>
              </div>
            </motion.div>

            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=1000&fit=crop"
                alt="Bangladesh Travel"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>

            {/* Floating Testimonial Card 1 - Left Side (Overlapping) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute top-24 -left-12 bg-white rounded-2xl shadow-2xl p-4 max-w-[200px] z-20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-linear-to-br from-[#29AB87] to-[#06B6D4] rounded-full flex items-center justify-center shrink-0">
                  <FiUsers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm">Sarah Johnson</div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600">"Amazing experience! The guide was fantastic."</p>
            </motion.div>

            {/* Floating Rating Card 2 - Right Side (Overlapping) */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              className="absolute top-1/3 -right-12 bg-white rounded-2xl shadow-2xl p-4 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-[#29AB87] to-[#4F46E5] rounded-xl flex items-center justify-center">
                  <FiAward className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black">4.9</div>
                  <div className="text-xs text-gray-600">Average Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Floating Location Card 3 - Bottom Left (Overlapping) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-2xl p-4 max-w-[180px] z-20"
            >
              <div className="flex items-center gap-2 mb-2">
                <FiMapPin className="w-5 h-5 text-[#29AB87]" />
                <div className="font-bold text-sm">Cox's Bazar</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FiUsers className="w-4 h-4" />
                <span>2.3k+ travelers</span>
              </div>
            </motion.div>

            {/* Floating Testimonial Card 4 - Bottom Right (Outside) */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute -bottom-12 right-0 bg-white rounded-2xl shadow-2xl p-4 max-w-[200px] z-20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-linear-to-br from-[#4F46E5] to-[#9333EA] rounded-full flex items-center justify-center shrink-0">
                  <FiUsers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm">Michael Chen</div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600">"Best trip of my life! Highly recommended."</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
