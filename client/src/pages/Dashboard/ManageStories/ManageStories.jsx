import { Link } from "react-router-dom";
import useStories from "../../../hooks/useStories";

const ManageStories = () => {
  const { stories, isLoading, refetch } = useStories();

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this story?");
    if (!confirmDelete) return;

    try {
      const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${serverUrl}/stories/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (result.deletedCount > 0) {
        refetch();
        alert("Story deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-5">Manage Your Stories</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {stories.map((story) => (
          <div key={story._id} className="border rounded-lg shadow p-4 bg-[#29AB8760]">
            <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {story.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="story"
                  className="rounded-lg h-32 object-cover"
                />
              ))}
            </div>
            <p className="text-gray-700 mb-3">{story.text}</p>
            <div className="flex justify-between">
              <Link
                to={`/dashboard/edit-story/${story._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(story._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageStories;
