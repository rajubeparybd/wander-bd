/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import EditProfileModal from "../../../../components/EditProfileModal";
import useAuth from "../../../../hooks/useAuth";
import {
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiUserCheck,
  FiBookOpen,
  FiEdit,
  FiTrendingUp,
  FiActivity,
  FiShield,
  FiSettings,
  FiPieChart,
} from "react-icons/fi";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: users = [] } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const { data: packages = [] } = useQuery({
    queryKey: ["allPackages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages");
      return res.data;
    },
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["allBookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings");
      return res.data;
    },
  });

  const { data: stories = [] } = useQuery({
    queryKey: ["allStories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stories");
      return res.data;
    },
  });

  const totalPayment = bookings
    .filter(b => b.status === "Accepted")
    .reduce((sum, b) => sum + (b.price || 0), 0);

  const tourGuides = users.filter(u => u.role === "tourGuide").length;
  const clients = users.filter(u => u.role === "tourist").length;

  const stats = [
    {
      icon: FiDollarSign,
      label: "Total Revenue",
      value: `৳${totalPayment.toLocaleString()}`,
      color: "from-[#29AB87] to-[#06B6D4]",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      icon: FiUsers,
      label: "Tour Guides",
      value: tourGuides,
      color: "from-[#4F46E5] to-[#9333EA]",
      trend: "+3",
      trendUp: true,
    },
    {
      icon: FiPackage,
      label: "Packages",
      value: packages.length,
      color: "from-[#06B6D4] to-[#4F46E5]",
      trend: "+5",
      trendUp: true,
    },
    {
      icon: FiUserCheck,
      label: "Clients",
      value: clients,
      color: "from-[#9333EA] to-[#29AB87]",
      trend: "+18",
      trendUp: true,
    },
    {
      icon: FiBookOpen,
      label: "Stories",
      value: stories.length,
      color: "from-[#29AB87] to-[#4F46E5]",
      trend: "+7",
      trendUp: true,
    },
    {
      icon: FiActivity,
      label: "Active Bookings",
      value: bookings.filter(b => b.status === "Accepted").length,
      color: "from-[#4F46E5] to-[#06B6D4]",
      trend: "+4",
      trendUp: true,
    },
  ];

  const quickActions = [
    {
      icon: FiPackage,
      label: "Add Package",
      description: "Create new tour package",
      onClick: () => navigate("/dashboard/add-package"),
      color: "from-[#29AB87] to-[#06B6D4]",
    },
    {
      icon: FiUsers,
      label: "Manage Users",
      description: "View and manage users",
      onClick: () => navigate("/dashboard/manage-users"),
      color: "from-[#4F46E5] to-[#9333EA]",
    },
    {
      icon: FiUserCheck,
      label: "Candidates",
      description: "Review guide applications",
      onClick: () => navigate("/dashboard/manage-candidates"),
      color: "from-[#06B6D4] to-[#4F46E5]",
    },
    {
      icon: FiBookOpen,
      label: "Stories",
      description: "Manage community stories",
      onClick: () => navigate("/dashboard/manage-stories"),
      color: "from-[#9333EA] to-[#29AB87]",
    },
  ];

  const recentActivity = [
    {
      icon: FiUserCheck,
      title: "New user registered",
      time: "5 minutes ago",
      color: "from-[#29AB87] to-[#06B6D4]",
    },
    {
      icon: FiPackage,
      title: "Package booking confirmed",
      time: "12 minutes ago",
      color: "from-[#4F46E5] to-[#9333EA]",
    },
    {
      icon: FiBookOpen,
      title: "New story published",
      time: "1 hour ago",
      color: "from-[#06B6D4] to-[#4F46E5]",
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
          Admin{" "}
          <span className="bg-gradient-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome back, {user?.displayName}! Here's your platform overview.
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden"
      >
        <div className="relative h-32 bg-gradient-to-r from-[#29AB87] to-[#4F46E5]">
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
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#29AB87] to-[#4F46E5] rounded-xl border-4 border-white flex items-center justify-center">
                <FiShield className="text-white text-lg" />
              </div>
            </motion.div>
            <div className="flex-1">
              <h2 className="text-3xl font-black mb-1">{user?.displayName}</h2>
              <p className="text-gray-600 mb-1">{user?.email}</p>
              <div className="inline-block px-4 py-1 bg-gradient-to-r from-[#29AB87] to-[#06B6D4] text-white rounded-full text-sm font-semibold">
                Platform Administrator
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#29AB87] to-[#4F46E5] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <FiEdit className="w-5 h-5" />
                Edit Profile
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-2xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              {stat.trend && (
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  stat.trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  <FiTrendingUp className={`w-3 h-3 ${!stat.trendUp && "rotate-180"}`} />
                  {stat.trend}
                </div>
              )}
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
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-black mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.onClick}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6 text-left hover:shadow-2xl transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-1">{action.label}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8"
        >
          <h2 className="text-2xl font-black mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center`}>
                  <activity.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{activity.title}</h3>
                  <p className="text-xs text-gray-600">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="bg-gradient-to-br from-[#29AB87] to-[#4F46E5] rounded-3xl shadow-xl p-8 text-white"
        >
          <h2 className="text-2xl font-black mb-6">System Overview</h2>
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Platform Health</span>
                <span className="text-sm">98%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: "98%" }} />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">User Satisfaction</span>
                <span className="text-sm">4.9/5.0</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: "98%" }} />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Booking Rate</span>
                <span className="text-sm">85%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: "85%" }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <EditProfileModal user={user} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;
