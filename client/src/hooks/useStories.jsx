import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useStories = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: stories = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    enabled: !!user?.email, // Wait until user is loaded
    queryKey: ["stories", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/stories?email=${user.email}`);
      return res.data;
    },
  });

  return { stories, isLoading, isError, refetch };
};

export default useStories;
