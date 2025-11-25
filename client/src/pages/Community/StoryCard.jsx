import { FacebookShareButton, FacebookIcon } from "react-share";

const StoryCard = ({ story }) => {
  const shareUrl = `https://your-site.com/story/${story._id}`;

  return (
    <div className="hover:bg-[#29AB87] bg-[#29AB8760] rounded-xl shadow-md overflow-hidden">
      <img
        src={story.image || story.images?.[0] || "/fallback.jpg"}
        alt={story.title}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
        <p className="text-gray-600 mb-4">{story.description || story.text}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={story.user?.image || "/default-avatar.png"}
              alt={story.user?.name || "Anonymous"}
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm font-medium">{story.user?.name || "Unknown"}</span>
          </div>
          <FacebookShareButton url={shareUrl} quote={story.title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
