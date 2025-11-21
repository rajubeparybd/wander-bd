import { useState } from "react";
import  useAuth  from "../../../../hooks/useAuth";
import EditProfileModal from "../../../../components/EditProfileModal";

const TourGuideDashboard = () => {
  const { user } = useAuth(); // assuming your AuthContext provides current user
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">
        Welcome, {user?.displayName || "Tour Guide"}!
      </h2>

      <div className="bg-[#29AB8760] shadow-md rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt="Tour Guide Avatar"
          className="w-32 h-32 rounded-full object-cover border-2 border-primary"
        />

        <div className="flex-1 space-y-3">
          <div>
            <strong>Name:</strong> {user?.displayName}
          </div>
          <div>
            <strong>Email:</strong> {user?.email}
          </div>
          <div>
            <strong>Role:</strong>{" "}
            <span className="capitalize">{user?.role || "tour guide"}</span>
          </div>

          <button
            className="btn btn-sm btn-primary mt-4"
            onClick={() => setIsModalOpen(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {isModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TourGuideDashboard;
