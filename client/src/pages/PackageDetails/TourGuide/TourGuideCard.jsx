import { Link } from "react-router-dom";

const TourGuideCard = ({ guide }) => {
  return (
    <Link
      to={`/guides/${guide._id}`}
      className="bg-[#29AB8760] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
    >
      <img
        src={guide.image}
        alt={guide.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{guide.name}</h3>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Experience:</span> {guide.experience}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Languages:</span> {Array.isArray(guide.languages) ? guide.languages.join(", ") : guide.languages}  
        </p>
      </div>
    </Link>
  );
};

export default TourGuideCard;
