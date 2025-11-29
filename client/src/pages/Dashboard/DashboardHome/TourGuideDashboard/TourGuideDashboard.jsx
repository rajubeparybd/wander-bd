/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import EditProfileModal from "../../../../components/EditProfileModal";
import {
  FiEdit,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiStar,
  FiAward,
  FiTrendingUp,
  FiBookOpen,
  FiCheckCircle,
} from "react-icons/fi";

const TourGuideDashboard = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: assignedTours = [] } = useQuery({
    queryKey: ["assignedTours", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?guideEmail=${user.email}`);
      return res.data;
    },
  });

  const { data: stories = [] } = useQuery({
    queryKey: ["guideStories", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/stories?email=${user.email}`);
      return res.data;
    },
  });

  const stats = [
    {
      icon: FiUsers,
      label: "Total Tours",
      value: assignedTours.length,
      color: "from-[#29AB87] to-[#06B6D4]",
      bgColor: "bg-[#29AB87]/10",
    },
    {
      icon: FiCheckCircle,
      label: "Completed",
      value: assignedTours.filter(t => t.status === "Completed").length,
      color: "from-[#4F46E5] to-[#9333EA]",
      bgColor: "bg-[#4F46E5]/10",
    },
    {
      icon: FiCalendar,
      label: "Upcoming",
      value: assignedTours.filter(t => t.status === "Accepted").length,
      color: "from-[#06B6D4] to-[#4F46E5]",
      bgColor: "bg-[#06B6D4]/10",
    },
    {
      icon: FiStar,
      label: "Rating",
      value: "4.9",
      color: "from-[#9333EA] to-[#29AB87]",
      bgColor: "bg-[#9333EA]/10",
    },
  ];

  const quickActions = [
    {
      icon: FiCalendar,
      label: "Assigned Tours",
      description: "View your tour schedule",
      onClick: () => navigate("/dashboard/my-assigned-tours"),
      color: "from-[#29AB87] to-[#06B6D4]",
    },
    {
      icon: FiBookOpen,
      label: "Share Story",
      description: "Share your experience",
      onClick: () => navigate("/dashboard/add-story"),
      color: "from-[#4F46E5] to-[#9333EA]",
    },
    {
      icon: FiMapPin,
      label: "Browse Packages",
      description: "Explore destinations",
      onClick: () => navigate("/trips"),
      color: "from-[#06B6D4] to-[#4F46E5]",
    },
    {
      icon: FiUsers,
      label: "Community",
      description: "Connect with travelers",
      onClick: () => navigate("/community"),
      color: "from-[#9333EA] to-[#29AB87]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-black mb-2">
          Welcome back,{" "}
          <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
            {user?.displayName}
          </span>
        </h1>
        <p className="text-gray-600 text-lg">
          Ready to guide your next adventure?
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden"
      >
        <div className="relative h-32 bg-linear-to-r from-[#29AB87] to-[#4F46E5]">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full filter blur-3xl" />
          </div>
        </div>
        <div className="relative px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <img
                src={user?.photoURL || "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-linear-to-br from-[#29AB87] to-[#4F46E5] rounded-xl border-4 border-white flex items-center justify-center">
                <FiAward className="text-white text-lg" />
              </div>
            </motion.div>
            <div className="flex-1">
              <h2 className="text-3xl font-black mb-1">{user?.displayName}</h2>
              <p className="text-gray-600 mb-1">{user?.email}</p>
              <div className="flex items-center gap-2">
                <div className="inline-block px-4 py-1 bg-linear-to-r from-[#29AB87] to-[#06B6D4] text-white rounded-full text-sm font-semibold">
                  Certified Tour Guide
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                  <FiStar className="w-4 h-4 fill-yellow-400" />
                  4.9
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <FiEdit className="w-5 h-5" />
                Edit Profile
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-2xl transition-all"
          >
            <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
              <stat.icon className="w-7 h-7 text-white" />
            </div>
            <div className="text-3xl font-black mb-1">{stat.value}</div>
            <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-black mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.onClick}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6 text-left hover:shadow-2xl transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-1">{action.label}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Tours */}
      {assignedTours.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8"
        >
          <h2 className="text-2xl font-black mb-6">Upcoming Tours</h2>
          <div className="space-y-4">
            {assignedTours.filter(t => t.status === "Accepted").slice(0, 3).map((tour, index) => (
              <motion.div
                key={tour._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#29AB87] to-[#4F46E5] flex items-center justify-center">
                  <FiMapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{tour.packageName}</h3>
                  <p className="text-sm text-gray-600">
                    {tour.tourDate} • {tour.touristName}
                  </p>
                </div>
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-semibold">
                  Confirmed
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="bg-linear-to-br from-[#29AB87] to-[#4F46E5] rounded-3xl shadow-xl p-8 text-white"
      >
        <h2 className="text-2xl font-black mb-6">Performance Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
            <FiTrendingUp className="w-8 h-8 mb-3" />
            <div className="text-3xl font-black mb-1">+23%</div>
            <div className="text-white/80 text-sm">Bookings this month</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
            <FiUsers className="w-8 h-8 mb-3" />
            <div className="text-3xl font-black mb-1">156</div>
            <div className="text-white/80 text-sm">Happy travelers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
            <FiAward className="w-8 h-8 mb-3" />
            <div className="text-3xl font-black mb-1">Top 10</div>
            <div className="text-white/80 text-sm">Guide ranking</div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <EditProfileModal user={user} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default TourGuideDashboard;
