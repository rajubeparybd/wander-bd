/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiMapPin, FiClock, FiDollarSign, FiCalendar, FiUsers, FiStar } from "react-icons/fi";

import Gallery from "../Gallery/Gallery";
import AboutTour from "../AboutTour/AboutTour";
import TourPlan from "../TourPlan/TourPlan";
import TourGuideList from "../TourGuide/TourGuideList";
import BookingForm from "../BookingForm/BookingForm";

import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const PackageDetailsPage = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); 

  // Fetch tour package by ID
  const {
    data: tourPackage,
    isLoading: packageLoading,
    isError: packageError,
    error: packageFetchError,
  } = useQuery({
    queryKey: ["package", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/packages/${id}`);
      return res.data;
    },
  });

  // Fetch user by email
  const {
    data: currentUser,
    isLoading: userLoading,
    isError: userError,
    error: userFetchError,
  } = useQuery({
    queryKey: ["user", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // ✅ Fetch the assigned tour guide if tourGuideId exists
  const {
    data: assignedGuide,
    isLoading: guideLoading,
    isError: guideError,
    error: guideFetchError,
  } = useQuery({
    queryKey: ["tourGuide", tourPackage?.tourGuideId],
    enabled: !!tourPackage?.tourGuideId,
    queryFn: async () => {
      console.log("Fetching tour guide with ID:", tourPackage.tourGuideId);
      const res = await axiosSecure.get(`/tour-guides/${tourPackage.tourGuideId}`);
      console.log("Tour guide data:", res.data);
      return res.data;
    },
  });

  // Debug logging
  console.log("Package data:", tourPackage);
  console.log("Tour Guide ID:", tourPackage?.tourGuideId);
  console.log("Assigned Guide:", assignedGuide);
  console.log("Guide Loading:", guideLoading);
  console.log("Guide Error:", guideError);

  // Fetch all tour guides for booking form (fallback)
  const {
    data: allTourGuides = [],
    isLoading: allGuidesLoading,
  } = useQuery({
    queryKey: ["tourGuides"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tour-guides");
      return res.data;
    },
  });

  if (packageLoading || userLoading || allGuidesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 border-4 border-[#29AB87] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading your adventure...</p>
        </motion.div>
      </div>
    );
  }

  if (packageError || userError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-3xl shadow-2xl border border-gray-100"
        >
          <div className="text-6xl mb-4">😞</div>
          <p className="text-xl text-red-500 font-semibold">
            {packageFetchError?.message || userFetchError?.message}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section with Package Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[60vh]"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={tourPackage.images?.[0] || "/placeholder.jpg"}
            alt={tourPackage.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/50 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 lg:px-16 flex flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Tour Type Badge */}
            {tourPackage.tourType && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-block mb-4"
              >
                <span className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-sm font-semibold">
                  {tourPackage.tourType}
                </span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-black text-white mb-6"
            >
              {tourPackage.title}
            </motion.h1>

            {/* Quick Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl">
                <FiMapPin className="text-[#29AB87] text-xl" />
                <span className="text-white font-semibold">{tourPackage.location}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl">
                <FiClock className="text-[#4F46E5] text-xl" />
                <span className="text-white font-semibold">{tourPackage.duration}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl">
                <FiDollarSign className="text-[#29AB87] text-xl" />
                <span className="text-white font-bold text-xl">${tourPackage.price}</span>
                <span className="text-white/80 text-sm">per person</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <Gallery images={tourPackage.images || []} />
            <AboutTour
              title={tourPackage.title}
              description={tourPackage.description}
            />
            <TourPlan plan={parseItinerary(tourPackage.itinerary)} />
            
            {/* Tour Guide Section - Always show if tourGuideId exists */}
            {tourPackage.tourGuideId && (
              <>
                {guideLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center py-12"
                  >
                    <div className="w-12 h-12 border-4 border-[#29AB87] border-t-transparent rounded-full animate-spin" />
                  </motion.div>
                ) : assignedGuide ? (
                  <TourGuideList guides={[assignedGuide]} />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center"
                  >
                    <p className="text-yellow-800 font-semibold">
                      Tour guide information is currently unavailable
                    </p>
                    <p className="text-yellow-600 text-sm mt-2">
                      Please contact support if this issue persists
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="sticky top-24"
            >
              <BookingForm
                price={tourPackage.price}
                packageName={tourPackage.title}
                user={currentUser}
                guides={assignedGuide ? [assignedGuide] : allTourGuides}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to parse itinerary string into array
function parseItinerary(itineraryStr = "") {
  const lines = itineraryStr.split(",").filter(Boolean);
  return lines.map((line) => {
    const [day, ...rest] = line.split(":");
    return {
      day: day.trim(),
      activities: rest.join(":").trim(),
    };
  });
}

export default PackageDetailsPage;
