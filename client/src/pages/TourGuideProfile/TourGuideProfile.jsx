/* eslint-disable no-unused-vars */
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiMail,
  FiAward,
  FiGlobe,
  FiMapPin,
  FiCalendar,
  FiStar,
  FiClock,
  FiDollarSign,
  FiPackage,
  FiUser,
  FiBookOpen,
} from "react-icons/fi";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const TourGuideProfile = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  // Fetch the tour guide
  const {
    data: guide,
    isLoading: guideLoading,
    isError: guideError,
  } = useQuery({
    queryKey: ["tour-guide", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tour-guides/${id}`);
      return res.data;
    },
  });

  // Fetch all packages
  const {
    data: allPackages = [],
    isLoading: packagesLoading,
  } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages");
      return res.data;
    },
  });

  // Filter packages assigned to this guide
  const guidePackages = allPackages.filter(
    (pkg) => pkg.tourGuideId === id
  );

  if (guideLoading || packagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 border-4 border-[#29AB87] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading guide profile...</p>
        </motion.div>
      </div>
    );
  }

  if (guideError || !guide) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-3xl shadow-2xl border border-gray-100"
        >
          <div className="text-6xl mb-4">😞</div>
          <p className="text-xl text-red-500 font-semibold">
            Tour guide not found
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section with Guide Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-linear-to-br from-[#29AB87] to-[#4F46E5] text-white py-20 rounded-2xl"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <img
                  src={guide.photoURL || guide.image || "/default-avatar.png"}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-2 -right-2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl"
              >
                <FiAward className="w-8 h-8 text-[#29AB87]" />
              </motion.div>
            </motion.div>

            {/* Guide Info */}
            <div className="flex-1 text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-6xl font-black mb-3"
              >
                {guide.name}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-white/90 mb-4"
              >
                {guide.title || "Professional Tour Guide"}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-center md:justify-start"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full">
                  <FiAward className="w-5 h-5" />
                  <span className="font-semibold">{guide.experience || "Experienced"}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full">
                  <FiPackage className="w-5 h-5" />
                  <span className="font-semibold">{guidePackages.length} Active Tours</span>
                </div>
                {guide.specialty && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full">
                    <FiStar className="w-5 h-5" />
                    <span className="font-semibold">{guide.specialty}</span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Guide Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#29AB87] to-[#06B6D4] flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-black">About</h2>
              </div>
              
              <div className="space-y-4">
                {guide.reason && (
                  <div>
                    <p className="text-gray-700 leading-relaxed">{guide.reason}</p>
                  </div>
                )}
                
                <div className="flex items-start gap-3 text-gray-600">
                  <FiMail className="w-5 h-5 mt-1 text-[#29AB87]" />
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">Email</p>
                    <p className="text-gray-800">{guide.email}</p>
                  </div>
                </div>

                {guide.joinedAt && (
                  <div className="flex items-start gap-3 text-gray-600">
                    <FiCalendar className="w-5 h-5 mt-1 text-[#29AB87]" />
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Joined</p>
                      <p className="text-gray-800">
                        {new Date(guide.joinedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Languages Section */}
            {guide.languages && guide.languages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center">
                    <FiGlobe className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black">Languages</h2>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {guide.languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-linear-to-r from-[#4F46E5]/10 to-[#9333EA]/10 border border-[#4F46E5]/20 rounded-full text-[#4F46E5] font-semibold"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CV Link */}
            {guide.cvLink && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <a
                  href={guide.cvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-4 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white rounded-2xl font-bold text-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiBookOpen className="w-5 h-5" />
                    View CV / Resume
                  </div>
                </a>
              </motion.div>
            )}
          </div>

          {/* Right Column - Active Packages */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#29AB87] to-[#06B6D4] flex items-center justify-center shadow-lg">
                  <FiPackage className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-black">
                    Active{" "}
                    <span className="bg-linear-to-r from-[#29AB87] to-[#06B6D4] bg-clip-text text-transparent">
                      Tour Packages
                    </span>
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {guidePackages.length} {guidePackages.length === 1 ? "tour" : "tours"} available
                  </p>
                </div>
              </div>

              {guidePackages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center"
                >
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-xl text-gray-600 font-semibold">
                    No active packages yet
                  </p>
                  <p className="text-gray-500 mt-2">
                    This guide will be leading tours soon!
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {guidePackages.map((pkg, index) => (
                    <motion.div
                      key={pkg._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link to={`/package/${pkg._id}`}>
                        <motion.div
                          whileHover={{ y: -8, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden group h-full"
                        >
                          {/* Package Image */}
                          <div className="relative h-56 overflow-hidden">
                            <motion.img
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                              src={pkg.images?.[0] || "/placeholder.jpg"}
                              alt={pkg.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                            
                            {/* Category Badge */}
                            {pkg.category && (
                              <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-gray-800">
                                  {pkg.category}
                                </span>
                              </div>
                            )}

                            {/* Price Tag */}
                            <div className="absolute top-4 right-4">
                              <div className="px-4 py-2 bg-[#29AB87] rounded-full text-white font-bold shadow-lg">
                                ${pkg.price}
                              </div>
                            </div>
                          </div>

                          {/* Package Info */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#29AB87] transition-colors">
                              {pkg.title}
                            </h3>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {pkg.description}
                            </p>

                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <FiMapPin className="w-4 h-4 text-[#29AB87]" />
                                <span className="font-semibold">{pkg.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <FiClock className="w-4 h-4 text-[#4F46E5]" />
                                <span className="font-semibold">
                                  {typeof pkg.duration === 'number' 
                                    ? `${pkg.duration} days` 
                                    : pkg.duration}
                                </span>
                              </div>
                            </div>

                            {/* View Details Link */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-2 text-[#29AB87] font-semibold text-sm group-hover:gap-3 transition-all">
                                <span>View Package Details</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuideProfile;
