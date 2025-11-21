import useAuth from "../../../../hooks/useAuth";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import TourGuideDashboard from "../TourGuideDashboard/TourGuideDashboard";
import TouristDashboard from "../TouristDashboard/TouristDashboard";


const DashboardProfile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-red-600">
        Error: User not found. Please log in again.
      </div>
    );
  }

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "tourGuide":
      return <TourGuideDashboard />;
    case "tourist":
    default:
      return <TouristDashboard />;
  }
};

export default DashboardProfile;
