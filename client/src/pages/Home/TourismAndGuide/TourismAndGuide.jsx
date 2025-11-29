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
    <section className="py-32 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
              Explore
            </span>{' '}
            &{' '}
            <span className="bg-gradient-to-r from-[#4F46E5] to-[#9333EA] bg-clip-text text-transparent">
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
                    <div className="relative group overflow-hidden rounded-3xl bg-white shadow-xl">
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          src={pkg.images?.[0] || "https://via.placeholder.com/400x300"}
                          alt={pkg.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Price Tag */}
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                          <div className="flex items-center gap-1">
                            <FiDollarSign className="text-[#29AB87]" />
                            <span className="font-bold text-lg">{pkg.price}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-3">{pkg.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                          <FiMapPin className="text-[#29AB87]" />
                          <span className="text-sm">{pkg.type || "Adventure"}</span>
                        </div>

                        <Link to={`/package/${pkg._id}`}>
                          <motion.button
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-2 text-black font-bold group-hover:text-[#29AB87] transition-colors"
                          >
                            Explore Package
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                        </Link>
                      </div>

                      {/* Decorative gradient */}
                      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#29AB87] to-[#4F46E5] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    </div>
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
                    <div className="relative group overflow-hidden rounded-3xl bg-white shadow-xl">
                      <div className="relative h-64 overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          src={guide.photo || "https://via.placeholder.com/400x300"}
                          alt={guide.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>

                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-2">{guide.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">⭐ {guide.experience}</p>
                        <p className="text-sm text-gray-600 mb-1">
                          🌐 {Array.isArray(guide.languages) ? guide.languages.join(", ") : guide.languages}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">🎯 {guide.specialty}</p>

                        <Link to={`/guides/${guide._id}`}>
                          <motion.button
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-2 text-black font-bold group-hover:text-[#4F46E5] transition-colors"
                          >
                            View Profile
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                        </Link>
                      </div>

                      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#4F46E5] to-[#9333EA] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    </div>
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
