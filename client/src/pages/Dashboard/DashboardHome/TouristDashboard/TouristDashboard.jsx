import { useState } from "react";
import  useAuth  from "../../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../../../../components/EditProfileModal";

const TouristDashboard = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleJoinAsGuide = () => {
    navigate("/dashboard/join-as-tour-guide");
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Welcome, {user?.displayName} 👋</h2>

      <div className="bg-[#29AB8760] rounded-xl shadow-md p-6 max-w-xl space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.photoURL || "/default-avatar.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold">{user?.displayName}</h3>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm font-medium text-green-600 capitalize">Role: Tourist</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Edit Profile
          </button>

          <button
            onClick={handleJoinAsGuide}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Apply for Tour Guide
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showModal && (
        <EditProfileModal user={user} onClose={handleClose} />
      )}
    </div>
  );
};

export default TouristDashboard;
