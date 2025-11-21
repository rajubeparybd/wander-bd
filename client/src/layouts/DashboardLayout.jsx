import { NavLink, Outlet } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";
import {
  FaHome,
  FaUser,
  FaSuitcase,
  FaUserTie,
  FaPlus,
  FaUsers,
  FaEdit,
  FaClipboardList,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-12">
      {/* Sidebar */}
      <aside className="col-span-3 bg-[#29AB8760] p-4 border-r border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `btn justify-start ${
                isActive
                  ? "bg-error text-white"
                  : "btn-ghost hover:bg-error-100 hover:text-error"
              }`
            }
          >
            <FaHome className="mr-2" /> Home
          </NavLink>

          {/* All Users */}
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `btn justify-start ${
                isActive
                  ? "bg-error text-white"
                  : "btn-ghost hover:bg-error-100 hover:text-error"
              }`
            }
          >
            <FaUser className="mr-2" /> Profile
          </NavLink>

          <NavLink
            to="/dashboard/add-story"
            className={({ isActive }) =>
              `btn justify-start ${
                isActive
                   ? "bg-error text-white"
                  : "btn-ghost hover:bg-error-100 hover:text-error"
              }`
            }
          >
            <FaPlus className="mr-2" /> Add Story
          </NavLink>

          <NavLink
            to="/dashboard/manage-stories"
            className={({ isActive }) =>
              `btn justify-start ${
                isActive
                   ? "bg-error text-white"
                  : "btn-ghost hover:bg-error-100 hover:text-error"
              }`
            }
          >
            <FaEdit className="mr-2" /> Manage Stories
          </NavLink>

          {/* Tourist */}
          {user.role === "tourist" && (
            <>
              <NavLink
                to="/dashboard/my-bookings"
                className={({ isActive }) =>
                  `btn justify-start ${
                    isActive
                       ? "bg-error text-white"
                  : "btn-ghost hover:bg-error-100 hover:text-error"
                  }`
                }
              >
                <FaSuitcase className="mr-2" /> My Bookings
              </NavLink>

              <NavLink
                to="/dashboard/join-as-tour-guide"
                className={({ isActive }) =>
                  `btn justify-start ${
                    isActive
                       ? "bg-error text-white"
                  : "btn-ghost hover:bg-error-100 hover:text-error"
                  }`
                }
              >
                <FaUserTie className="mr-2" /> Join as Guide
              </NavLink>
            </>
          )}

          {/* Tour Guide */}
          {user.role === "tourGuide" && (
            <NavLink
              to="/dashboard/my-assigned-tours"
              className={({ isActive }) =>
                `btn justify-start ${
                  isActive
                     ? "bg-error text-white"
                  : "btn-ghost hover:bg-error-100 hover:text-error"
                }`
              }
            >
              <FaClipboardList className="mr-2" /> Assigned Tours
            </NavLink>
          )}

          {/* Admin */}
          {user.role === "admin" && (
            <>
              <NavLink
                to="/dashboard/add-package"
                className={({ isActive }) =>
                  `btn justify-start ${
                    isActive
                       ? "bg-error text-white"
                  : "btn-ghost hover:bg-error-100 hover:text-error"
                  }`
                }
              >
                <FaPlus className="mr-2" /> Add Package
              </NavLink>

              <NavLink
                to="/dashboard/manage-users"
                className={({ isActive }) =>
                  `btn justify-start ${
                    isActive
                       ? "bg-error text-white"
                  : "btn-ghost hover:bg-error-100 hover:text-error"
                  }`
                }
              >
                <FaUsers className="mr-2" /> Manage Users
              </NavLink>

              <NavLink
                to="/dashboard/manage-candidates"
                className={({ isActive }) =>
                  `btn justify-start ${
                    isActive
                       ? "bg-error text-white"
                  : "btn-ghost hover:bg-error-100 hover:text-error"
                  }`
                }
              >
                <FaUserTie className="mr-2" /> Manage Candidates
              </NavLink>
            </>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className="col-span-9 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
