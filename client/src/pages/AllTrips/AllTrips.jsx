import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AllTrips = () => {
  const axiosSecure = useAxiosSecure();

  const { data: packages = [], isLoading, error } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const res = await axiosSecure.get('/packages');
      return res.data;
    }
  });

  if (isLoading) return <p>Loading trips...</p>;
  if (error) return <p>Error loading trips: {error.message}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <div key={pkg._id} className="card hover:bg-[#29AB87] bg-[#29AB8760] shadow-md rounded-lg p-4 flex flex-col">
          <img
            src={pkg.images?.[0] || 'https://via.placeholder.com/400x250?text=No+Image'}
            alt={pkg.title}
            className="rounded-md object-cover h-48 w-full mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
          <p className="flex-grow text-gray-700 mb-4">Location: {pkg.location}</p>
          <p className="flex-grow text-gray-700 mb-4">Duration: {pkg.duration} Days</p>
          <p className="flex-grow text-gray-700 mb-4">Type: {pkg.category}</p>
          <p className="font-bold mb-4">Price: {pkg.price} Taka</p>
          <Link
            to={`/package/${pkg._id}`}
            className="btn btn-error mt-auto text-center "
          >
            Package Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AllTrips;
