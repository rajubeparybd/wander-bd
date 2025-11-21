import { Link } from "react-router-dom";

const PackageCard = ({ pack }) => {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition p-4">
      <img
        src={pack.images[0]}
        alt={pack.name}
        className="w-full h-48 object-cover rounded-md"
      />
      <h2 className="text-xl font-semibold mt-4">{pack.name}</h2>
      <p className="text-gray-600">Location: {pack.location}</p>
      <p className="text-gray-700 font-medium">Price: ৳{pack.price}</p>
      <p className="text-sm text-gray-500">Duration: {pack.duration}</p>

      <Link to={`/package/${pack.id}`}>
        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          View Details
        </button>
      </Link>
    </div>
  );
};

export default PackageCard;
