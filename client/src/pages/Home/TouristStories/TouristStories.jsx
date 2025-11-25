import { FacebookShareButton, FacebookIcon } from "react-share";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios"; // Axios instance with baseURL

const TouristStories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axios = useAxios();

  // Fetch stories using TanStack Query
  const { data: stories = [], isLoading, isError } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const res = await axios.get("/stories");
      return res.data;
    },
  });

  const handleShareClick = (url) => {
    if (!user) {
      navigate("/login", { state: { from: `/stories/share/${url.split("/").pop()}` } });
    }
  };

  // Show loading state
  if (isLoading) return <p className="text-center my-10">Loading stories...</p>;
  if (isError) return <p className="text-center my-10 text-red-500">Failed to load stories.</p>;

  // Pick 4 random stories
  const randomStories = stories
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <section className="my-12 w-11/12 mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Tourist Stories</h2>
        <p className="text-gray-600 mt-2">Real experiences shared by real travelers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {randomStories.map((story) => (
          <div key={story._id} className="hover:bg-[#29AB87] bg-[#29AB8760] shadow-md rounded-lg overflow-hidden">
            <img
              src={story.images?.[0] || "https://source.unsplash.com/400x250/?travel"}
              alt={story.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-semibold">{story.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{story.text}</p>
              <div className="flex justify-between items-center pt-2">
                {user ? (
                  <FacebookShareButton url={`https://wanderbd.com/story/${story._id}`}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                ) : (
                  <button
                    onClick={() => handleShareClick(`https://wanderbd.com/story/${story._id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Login to Share
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button onClick={() => navigate("/community")} className="btn btn-primary bg-[#29AB87] border-none">
          All Stories
        </button>
      </div>
    </section>
  );
};

export default TouristStories;
