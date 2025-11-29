/* eslint-disable no-unused-vars */
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { 
  FiCompass, 
  FiUser, 
  FiSettings, 
  FiLogOut, 
  FiGrid, 
  FiHeart,
  FiBookOpen,
  FiChevronDown 
} from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import useUserRole from "../../../hooks/useUserRole";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const { role } = useUserRole();
  const [hidden, setHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 font-medium transition-colors ${
      isActive ? "text-black font-bold" : "text-gray-600 hover:text-black"
    }`;

  const navItems = (
    <>
      <li><NavLink to="/" className={navLinkClass}>Home</NavLink></li>
      <li><NavLink to="/community" className={navLinkClass}>Community</NavLink></li>
      <li><NavLink to="/about" className={navLinkClass}>About</NavLink></li>
      <li><NavLink to="/trips" className={navLinkClass}>Trips</NavLink></li>
      {user && (
        <li><NavLink to="/dashboard/profile" className={navLinkClass}>Dashboard</NavLink></li>
      )}
    </>
  );

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const userMenuItems = [
    { icon: FiUser, label: "Profile", path: "/dashboard/profile" },
    { icon: FiGrid, label: "Dashboard", path: "/dashboard/profile" },
    { icon: FiHeart, label: "My Bookings", path: "/dashboard/my-bookings", roles: ["tourist"] },
    { icon: FiBookOpen, label: "My Stories", path: "/dashboard/manage-stories" },
  ];

  return (
    <motion.div
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
    >
      <div className="w-11/12 mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-[#29AB87] to-[#4F46E5] rounded-xl flex items-center justify-center">
              <FiCompass className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black">
              WANDER<span className="text-[#29AB87]">BD</span>
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex">
            <ul className="flex items-center gap-2">{navItems}</ul>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={menuRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#29AB87]">
                    <img
                      src={user.photoURL || "/default-avatar.png"}
                      alt={user.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-sm hidden md:block">
                    {user.displayName?.split(" ")[0]}
                  </span>
                  <FiChevronDown 
                    className={`w-4 h-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} 
                  />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                      {/* User Info */}
                      <div className="p-4 bg-linear-to-br from-[#29AB87] to-[#4F46E5] text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                            <img
                              src={user.photoURL || "/default-avatar.png"}
                              alt={user.displayName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm truncate">
                              {user.displayName}
                            </h3>
                            <p className="text-xs text-white/80 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {userMenuItems
                          .filter(item => !item.roles || item.roles.includes(role))
                          .map((item, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ backgroundColor: "#f3f4f6" }}
                              onClick={() => {
                                navigate(item.path);
                                setIsMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:text-[#29AB87] transition-colors"
                            >
                              <item.icon className="w-5 h-5" />
                              <span className="font-medium">{item.label}</span>
                            </motion.button>
                          ))}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-200 p-2">
                        <motion.button
                          whileHover={{ backgroundColor: "#fef2f2" }}
                          onClick={handleLogout}
                          disabled={loading}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:text-red-700 transition-colors rounded-xl"
                        >
                          <FiLogOut className="w-5 h-5" />
                          <span className="font-medium">
                            {loading ? "Logging out..." : "Logout"}
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-black text-white rounded-full font-bold"
                >
                  Login
                </motion.button>
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
