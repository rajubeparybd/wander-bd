/* eslint-disable no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiMapPin, FiClock, FiDollarSign, FiArrowRight, FiTag, FiFilter, FiSearch } from 'react-icons/fi';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AllTrips = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: packages = [], isLoading, error } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const res = await axiosSecure.get('/packages');
      return res.data;
    }
  });

  const categories = ['all', ...new Set(packages.map(pkg => pkg.tourType).filter(Boolean))];

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pkg.tourType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate average duration from packages
  const calculateAvgDuration = () => {
    if (packages.length === 0) return "0";
    const totalDays = packages.reduce((sum, pkg) => {
      if (!pkg.duration) return sum;
      
      // Handle if duration is a number
      if (typeof pkg.duration === 'number') {
        return sum + pkg.duration;
      }
      
      // Handle if duration is a string (e.g., "3 days", "1 week")
      if (typeof pkg.duration === 'string') {
        const match = pkg.duration.match(/\d+/);
        return sum + (match ? parseInt(match[0]) : 0);
      }
      
      return sum;
    }, 0);
    const avg = Math.round(totalDays / packages.length);
    return avg > 0 ? `${avg}` : "0";
  };

  const stats = [
    { icon: FiMapPin, label: "Destinations", value: packages.length.toString(), color: "from-[#29AB87] to-[#06B6D4]" },
    { icon: FiTag, label: "Categories", value: (categories.length - 1).toString(), color: "from-[#4F46E5] to-[#9333EA]" },
    { icon: FiClock, label: "Avg Duration", value: `${calculateAvgDuration()} Days`, color: "from-[#06B6D4] to-[#4F46E5]" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#29AB87] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading amazing trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <p className="text-xl text-red-600 font-semibold mb-2">Error loading trips</p>
          <p className="text-gray-600">{error.message}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-x-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 right-0 w-72 h-72 bg-[#29AB87]/30 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-20 left-0 w-72 h-72 bg-[#4F46E5]/30 rounded-full filter blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-6 py-2 bg-[#29AB87]/10 text-[#29AB87] rounded-full text-sm font-bold mb-6"
            >
              Explore Bangladesh
            </motion.span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              All{' '}
              <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
                Trips
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Discover handpicked travel packages designed for unforgettable adventures
            </p>

            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="grow relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search destinations, locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none text-gray-800 font-medium"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-12 pr-8 py-4 rounded-full border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none text-gray-800 font-medium appearance-none bg-white cursor-pointer min-w-[200px]"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="px-4 pb-32">
        <div className="max-w-7xl mx-auto">
          {filteredPackages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-xl text-gray-600 font-semibold">No trips found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-8"
              >
                <p className="text-gray-600">
                  Showing <span className="font-bold text-[#29AB87]">{filteredPackages.length}</span> trip{filteredPackages.length !== 1 ? 's' : ''}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="group h-full"
                  >
                    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden h-full flex flex-col relative">
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden shrink-0">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop'}
                          alt={pkg.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                        {/* Category Badge */}
                        {pkg.tourType && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-gray-800 flex items-center gap-1">
                              <FiTag className="w-3 h-3" />
                              {pkg.tourType}
                            </span>
                          </div>
                        )}

                        {/* Price Tag */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-sm">৳{pkg.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 grow flex flex-col">
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-[#29AB87] transition-colors">
                          {pkg.title}
                        </h3>

                        <div className="space-y-2 mb-4 grow">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiMapPin className="w-4 h-4 text-[#29AB87] shrink-0" />
                            <span className="text-sm truncate">{pkg.location || 'Bangladesh'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiClock className="w-4 h-4 text-[#4F46E5] shrink-0" />
                            <span className="text-sm">
                              {typeof pkg.duration === 'number' ? `${pkg.duration} Days` : pkg.duration}
                            </span>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <Link to={`/package/${pkg._id}`} className="mt-auto">
                          <motion.button
                            whileHover={{ x: 5 }}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-full group-hover:bg-linear-to-r group-hover:from-[#29AB87] group-hover:to-[#4F46E5] transition-all"
                          >
                            View Details
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                        </Link>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AllTrips;
