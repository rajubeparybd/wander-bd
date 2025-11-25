import { useQuery } from "@tanstack/react-query";
import StoryCard from "./StoryCard";
import useAxiosSecure from "../../hooks/useAxiosSecure";


const Community = () => {
  const axios = useAxiosSecure();

  // Fetch all stories
  const { data: stories = [], isLoading, isError } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const res = await axios.get("/stories");
      return res.data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Community Stories</h2>

      {isLoading && <p className="text-center">Loading stories...</p>}
      {isError && <p className="text-center text-red-500">Failed to load stories.</p>}

      {!isLoading && !isError && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;
