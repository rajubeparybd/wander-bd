import { useQuery } from "@tanstack/react-query";

import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: roleData,
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    enabled: !!user?.email && !authLoading, // Wait until auth is ready
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data?.role || "tourist"; // fallback role
    },
  });

  return { role: roleData, roleLoading, refetch };
};

export default useUserRole;
