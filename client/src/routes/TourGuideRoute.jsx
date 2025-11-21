import { Navigate, useLocation } from "react-router-dom";
import  useAuth  from "../hooks/useAuth";
import Loading from "../components/Loading";


const TourGuideRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "tourGuide") {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold text-red-600">Access Denied</h2>
        <p>Only approved Tour Guides can access this section.</p>
      </div>
    );
  }

  return children;
};

export default TourGuideRoute;
