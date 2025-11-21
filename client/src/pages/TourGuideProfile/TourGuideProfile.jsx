import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import StoryCard from "../Community/StoryCard";
import useAxiosSecure from "../../hooks/useAxiosSecure";


// Dummy stories
const dummyStories = [
  {
    id: "s1",
    title: "Sundarban Jungle Safari",
    image: "https://i.ibb.co/8BXg15Y/sundarban.jpg",
    summary: "Exploring the wild side of Bangladesh with tourists.",
    authorId: "g1",
  },
  {
    id: "s2",
    title: "Trekking in Bandarban",
    image: "https://i.ibb.co/3dZTZG7/bandarban.jpg",
    summary: "A thrilling trek to Nilgiri hills!",
    authorId: "g1",
  },
];

const TourGuideProfile = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  // Fetch the guide using TanStack Query
  const { data: guide, isLoading, isError } = useQuery({
    queryKey: ["tour-guide", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tour-guides/${id}`);
      return res.data;
    },
  });

  const guideStories = dummyStories.filter((story) => story.authorId === id);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError || !guide) return <div className="text-center text-red-500">Guide not found.</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Guide Info */}
      <div className="flex flex-col md:flex-row gap-6 items-center mb-10">
        <img
          src={guide.photoURL || "https://via.placeholder.com/150"}
          alt={guide.name}
          className="w-40 h-40 object-cover rounded-full shadow-md"
        />
        <div>
          <h2 className="text-3xl font-bold">{guide.name}</h2>
          <p className="text-gray-600 mt-2">{guide.bio || "No bio available."}</p>
          <p className="text-sm text-gray-500 mt-1">
            Experience: {guide.experience || "N/A"}
          </p>
          <p className="text-sm text-gray-500">
            Contact: {guide.email || "N/A"}
          </p>
        </div>
      </div>

      {/* Guide Stories */}
      <h3 className="text-2xl font-semibold mb-4">Stories by {guide.name}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {guideStories.length ? (
          guideStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))
        ) : (
          <p className="text-gray-500">No stories found.</p>
        )}
      </div>
    </div>
  );
};

export default TourGuideProfile;
