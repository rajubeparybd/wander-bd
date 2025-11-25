import { NavLink } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useUserRole from "../../../hooks/useUserRole";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const { role } = useUserRole(); // admin / tourGuide / tourist

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition-all duration-300 font-medium ${isActive
      ? "bg-[#29AB87] text-white"
      : "text-gray-700 hover:bg-primary/10 hover:text-success"
    }`;

  const navItems = (
    <>
      <li>
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/community" className={navLinkClass}>
          Community
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className={navLinkClass}>
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink to="/trips" className={navLinkClass}>
          Trips
        </NavLink>
      </li>

      {user && (
        <li>
          <NavLink
            to={role === "admin" ? "/dashboard/profile" : role === "tourGuide" ? "/dashboard/profile" : "/dashboard/profile"}
            className={navLinkClass}
          >
            Dashboard
          </NavLink>
        </li>
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
    <div className="bg-[#29AB8760] shadow-md ">
      <div className="navbar w-11/12 mx-auto">
        {/* Start: Logo & Mobile Menu */}
        <div className="navbar-start">
          <div className="dropdown">
            <button tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-1"
            >
              {navItems}
            </ul>
          </div>

          <NavLink
            to="/"
            className="btn btn-ghost text-xl font-bold flex items-center hover:bg-[#29AB8760]"
          >
            <img src="/logo.png" alt="Wander BD" className="w-8 h-8 mr-2" />
            Wander BD
          </NavLink>
        </div>

        {/* Center: Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-3">{navItems}</ul>
        </div>

        {/* End: Profile or Login */}
        <div className="navbar-end flex items-center gap-3">
          {user ? (
            <>
              {/* Profile Avatar with Tooltip */}
              <div
                className="tooltip tooltip-bottom"
                data-tip={user.displayName || "User"}
              >
                <div className="avatar">
                  <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:ring-2 hover:ring-secondary transition-all duration-300">
                    <img
                      src={user.photoURL || "/default-avatar.png"}
                      alt={user.displayName || "Profile"}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm md:btn-md bg-error transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <NavLink to="/login">
              <button className="btn btn-primary bg-[#29AB87] border-none shadow-none btn-sm md:btn-md hover:bg-[#29AB87]/90 text-white transition-all duration-300">
                Login
              </button>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
