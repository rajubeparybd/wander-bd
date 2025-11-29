/* eslint-disable no-unused-vars */
import { NavLink, Outlet } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FiHome,
  FiUser,
  FiBriefcase,
  FiUserPlus,
  FiPlus,
  FiUsers,
  FiEdit,
  FiClipboard,
  FiPackage,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const { user, loading, logOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
console.log(user);
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-gray-50 via-white to-gray-50">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  const navLinks = [
    { to: "/", icon: FiHome, label: "Home", roles: ["admin", "tourGuide", 'user'] },
    { to: "/dashboard/profile", icon: FiUser, label: "Profile", roles: ["admin", "tourGuide", 'user'] },
    { to: "/dashboard/add-story", icon: FiPlus, label: "Add Story", roles: ["admin", "tourGuide", 'user'] },
    { to: "/dashboard/manage-stories", icon: FiEdit, label: "Manage Stories", roles: ["admin", "tourGuide", 'user'] },
    { to: "/dashboard/my-bookings", icon: FiBriefcase, label: "My Bookings", roles: ['user'] },
    { to: "/dashboard/join-as-tour-guide", icon: FiUserPlus, label: "Join as Guide", roles: ['user'] },
    { to: "/dashboard/my-assigned-tours", icon: FiClipboard, label: "Assigned Tours", roles: ["tourGuide"] },
    { to: "/dashboard/add-package", icon: FiPackage, label: "Add Package", roles: ["admin"] },
    { to: "/dashboard/manage-users", icon: FiUsers, label: "Manage Users", roles: ["admin"] },
    { to: "/dashboard/manage-candidates", icon: FiUserPlus, label: "Manage Candidates", roles: ["admin"] },
  ];

  const filteredLinks = navLinks.filter(link => link.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#29AB87]/30 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#4F46E5]/30 rounded-full filter blur-[120px]" />
      </div>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-80 min-h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl p-6 fixed lg:sticky top-0 z-50"
            >
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-black bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent"
                  >
                    Dashboard
                  </motion.h2>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* User Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-linear-to-br from-[#29AB87] to-[#4F46E5] rounded-2xl p-4 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={user?.photoURL || "/default-avatar.png"}
                        alt="User"
                        className="w-14 h-14 rounded-xl object-cover border-2 border-white/50"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm truncate">
                        {user?.displayName}
                      </h3>
                      <p className="text-white/80 text-xs capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {filteredLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group ${
                          isActive
                            ? "bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white shadow-lg"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <link.icon
                            className={`w-5 h-5 ${
                              isActive ? "text-white" : "text-gray-500 group-hover:text-[#29AB87]"
                            } transition-colors`}
                          />
                          <span>{link.label}</span>
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              {/* Logout Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={logOut}
                className="w-full mt-8 flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-all"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>

          {/* Content Area */}
          <main className="p-4 md:p-8 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
