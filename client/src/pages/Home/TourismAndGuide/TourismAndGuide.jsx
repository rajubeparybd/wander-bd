/* eslint-disable no-unused-vars */
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { FiArrowRight, FiMapPin, FiDollarSign } from "react-icons/fi";

const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 3D Tilt Card Component
const TiltCard = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative"
    >
      {children}
    </motion.div>
  );
};

const TourismAndGuide = () => {
  const axiosSecure = useAxiosSecure();
  const [activeTab, setActiveTab] = useState(0);

  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages");
      return res.data;
    }
  });

  const { data: guides = [], isLoading: guidesLoading } = useQuery({
    queryKey: ["tourGuides"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tour-guides");
      return res.data;
    }
  });

  if (packagesLoading || guidesLoading) {
    return (
      <div className="py-32 flex justify-center">
        <div className="w-16 h-16 border-4 border-[#29AB87] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const randomPackages = getRandomItems(packages, 3);
  const randomGuides = getRandomItems(guides, 6);

  return (
    <section className="py-32 px-4 md:px-8 lg:px-16 bg-linear-to-b from-white to-gray-50">
      <div className="w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-6">
            <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
              Explore
            </span>{' '}
            &{' '}
            <span className="bg-linear-to-r from-[#4F46E5] to-[#9333EA] bg-clip-text text-transparent">
              Discover
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked packages and expert guides waiting for your next adventure
          </p>
        </motion.div>

        {/* Modern Tabs */}
        <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
          <TabList className="flex justify-center gap-4 mb-16 border-none">
            {["Premium Packages", "Expert Guides"].map((label, idx) => (
              <Tab
                key={idx}
                className="px-8 py-4 text-lg font-bold rounded-full cursor-pointer outline-none transition-all"
                selectedClassName="bg-black text-white shadow-2xl"
                style={{
                  background: activeTab !== idx ? '#f3f4f6' : undefined,
                  color: activeTab !== idx ? '#6b7280' : undefined
                }}
              >
                {label}
              </Tab>
            ))}
          </TabList>

          {/* Packages Panel */}
          <TabPanel>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {randomPackages.map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{ perspective: 1000 }}
                >
                  <TiltCard>
                    <Link to={`/package/${pkg._id}`} className="block">
                      <div className="relative group overflow-hidden rounded-3xl bg-linear-to-br from-white to-gray-50 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
                        {/* Image with overlay */}
                        <div className="relative h-72 overflow-hidden">
                          <motion.img
                            whileHover={{ scale: 1.15 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            src={pkg.images?.[0] || "https://via.placeholder.com/400x300"}
                            alt={pkg.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500" />
                          
                          {/* Premium Badge */}
                          <div className="absolute top-4 left-4">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="px-4 py-2 bg-linear-to-r from-[#29AB87] to-[#4F46E5] rounded-full shadow-lg"
                            >
                              <span className="text-white text-xs font-bold tracking-wide">PREMIUM</span>
                            </motion.div>
                          </div>

                          {/* Price Tag */}
                          <div className="absolute top-4 right-4">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-white/20"
                            >
                              <div className="flex items-center gap-1">
                                <FiDollarSign className="text-[#29AB87] text-lg font-bold" />
                                <span className="font-black text-xl text-gray-800">{pkg.price}</span>
                              </div>
                              <div className="text-xs text-gray-500 text-center mt-0.5">per person</div>
                            </motion.div>
                          </div>

                          {/* Title overlay on image */}
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-2xl md:text-3xl font-black text-white mb-2 line-clamp-2 group-hover:text-[#29AB87] transition-colors duration-300">
                              {pkg.name}
                            </h3>
                            <div className="flex items-center gap-2 text-white/90">
                              <FiMapPin className="text-[#29AB87] text-lg" />
                              <span className="text-sm font-semibold">{pkg.type || "Adventure"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 bg-white">
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                            {pkg.description || "Discover amazing experiences and create unforgettable memories on this incredible journey."}
                          </p>

                          {/* Action Button */}
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-2 text-black font-bold group-hover:text-[#29AB87] transition-colors"
                          >
                            <span>Explore Package</span>
                            <FiArrowRight className="text-xl group-hover:translate-x-2 transition-transform duration-300" />
                          </motion.div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-linear-to-br from-[#29AB87] to-[#4F46E5] rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-700" />
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-linear-to-br from-[#4F46E5] to-[#9333EA] rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700" />
                      </div>
                    </Link>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </TabPanel>

          {/* Guides Panel */}
          <TabPanel>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {randomGuides.map((guide, index) => (
                <motion.div
                  key={guide._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{ perspective: 1000 }}
                >
                  <TiltCard>
                    <Link to={`/guides/${guide._id}`} className="block">
                      <div className="relative group overflow-hidden rounded-3xl bg-linear-to-br from-white via-gray-50 to-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
                        {/* Profile Image */}
                        <div className="relative h-80 overflow-hidden">
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            src={guide.photo || "https://via.placeholder.com/400x300"}
                            alt={guide.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-500" />
                          
                          {/* Expert Badge */}
                          <div className="absolute top-4 left-4">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: -5 }}
                              className="px-4 py-2 bg-linear-to-r from-[#4F46E5] to-[#9333EA] rounded-full shadow-lg"
                            >
                              <span className="text-white text-xs font-bold tracking-wide">EXPERT</span>
                            </motion.div>
                          </div>

                          {/* Verified Badge */}
                          <div className="absolute top-4 right-4">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-white/20 flex items-center justify-center"
                            >
                              <svg className="w-6 h-6 text-[#4F46E5]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          </div>

                          {/* Guide Name Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-2xl md:text-3xl font-black text-white mb-1 group-hover:text-[#4F46E5] transition-colors duration-300">
                              {guide.name}
                            </h3>
                            <div className="flex items-center gap-2 text-white/90">
                              <span className="text-sm font-semibold">{guide.specialty || "Tour Guide"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Info Section */}
                        <div className="p-6 bg-white space-y-3">
                          {/* Experience */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#29AB87] to-[#4F46E5] flex items-center justify-center shrink-0">
                              <span className="text-white text-lg">⭐</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 font-medium">Experience</p>
                              <p className="text-sm font-bold text-gray-800">{guide.experience}</p>
                            </div>
                          </div>

                          {/* Languages */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center shrink-0">
                              <span className="text-white text-lg">🌐</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 font-medium">Languages</p>
                              <p className="text-sm font-bold text-gray-800 line-clamp-1">
                                {Array.isArray(guide.languages) ? guide.languages.join(", ") : guide.languages}
                              </p>
                            </div>
                          </div>

                          {/* Action Button */}
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-2 text-black font-bold group-hover:text-[#4F46E5] transition-colors pt-2"
                          >
                            <span>View Profile</span>
                            <FiArrowRight className="text-xl group-hover:translate-x-2 transition-transform duration-300" />
                          </motion.div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-linear-to-br from-[#4F46E5] to-[#9333EA] rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-700" />
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-linear-to-br from-[#29AB87] to-[#4F46E5] rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700" />
                      </div>
                    </Link>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </TabPanel>
        </Tabs>
      </div>
    </section>
  );
};

export default TourismAndGuide;
