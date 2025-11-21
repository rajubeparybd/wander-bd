import { useState } from "react";

import EditProfileModal from "../../../../components/EditProfileModal";
import useAuth from "../../../../hooks/useAuth";

const AdminDashboard = () => {
  const { user } = useAuth(); // Assuming user context includes role/info
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy stats — replace with data from API later
  const stats = {
    totalPayment: 457800,
    totalTourGuides: 24,
    totalPackages: 18,
    totalClients: 85,
    totalStories: 52,
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome */}
      <h2 className="text-2xl font-bold text-primary">
        Welcome back, {user?.displayName || "Admin"}!
      </h2>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold">Total Payment</h4>
          <p className="text-2xl font-bold">৳ {stats.totalPayment.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold">Tour Guides</h4>
          <p className="text-2xl font-bold">{stats.totalTourGuides}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold">Packages</h4>
          <p className="text-2xl font-bold">{stats.totalPackages}</p>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold">Clients</h4>
          <p className="text-2xl font-bold">{stats.totalClients}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold">Stories</h4>
          <p className="text-2xl font-bold">{stats.totalStories}</p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-[#29AB8760] shadow-md rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt="Admin Avatar"
          className="w-32 h-32 rounded-full object-cover border-2 border-primary"
        />
        <div className="flex-1 space-y-2">
          <div>
            <strong>Name:</strong> {user?.displayName}
          </div>
          <div>
            <strong>Email:</strong> {user?.email}
          </div>
          <div>
            <strong>Role:</strong>{" "}
            <span className="capitalize">{user?.role || "admin"}</span>
          </div>
          <button
            className="btn btn-primary btn-sm mt-4"
            onClick={() => setIsModalOpen(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {isModalOpen && (
        <EditProfileModal user={user} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;
