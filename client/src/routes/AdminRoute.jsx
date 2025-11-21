import { Navigate, useLocation } from "react-router-dom";
import  useAuth  from "../hooks/useAuth";
import Loading from "../components/Loading";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin") {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold text-red-600">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
