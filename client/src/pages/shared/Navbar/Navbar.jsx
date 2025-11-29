import { NavLink } from "react-router-dom";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { FiCompass } from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import useUserRole from "../../../hooks/useUserRole";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const { role } = useUserRole();
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

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
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4">
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
              <>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-6 py-2 bg-black text-white rounded-full font-bold"
                  disabled={loading}
                >
                  {loading ? "..." : "Logout"}
                </motion.button>
              </>
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
