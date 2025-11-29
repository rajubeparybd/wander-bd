/* eslint-disable no-unused-vars */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiMapPin, FiClock, FiHeart, FiDollarSign } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";

// Icon mapping for destinations
const destinationIcons = {
  "cox's bazar": "🏖️",
  "coxs bazar": "🏖️",
  "sundarbans": "🌴",
  "srimangal": "🍵",
  "bandarban": "⛰️",
  "dhaka": "🏛️",
  "sylhet": "💚",
  "chittagong": "🏙️",
  "rangamati": "🏞️",
  "khulna": "🌊",
};

// Icon mapping for tour types
const tourTypeIcons = {
  "adventure": { icon: "🧗", description: "Thrilling experiences" },
  "relaxing": { icon: "🧘", description: "Peace and tranquility" },
  "cultural": { icon: "🎭", description: "Heritage & traditions" },
  "family": { icon: "👨‍👩‍👧‍👦", description: "Fun for all ages" },
  "romantic": { icon: "💕", description: "Couples getaway" },
  "wildlife": { icon: "🦁", description: "Nature & animals" },
  "beach": { icon: "🏖️", description: "Coastal paradise" },
  "historical": { icon: "🏛️", description: "Ancient wonders" },
  "nature": { icon: "🌿", description: "Natural beauty" },
};

// Helper function to parse duration string to days
const parseDurationToDays = (durationStr) => {
  if (!durationStr) return 0;
  
  // Convert to string if it's a number
  const str = typeof durationStr === 'string' ? durationStr : String(durationStr);
  
  const match = str.toLowerCase().match(/(\d+)\s*(day|week)/);
  if (!match) return 0;
  const value = parseInt(match[1]);
  const unit = match[2];
  return unit === "week" ? value * 7 : value;
};

const PlanYourTrip = () => {
  const axiosSecure = useAxiosSecure();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: "",
    duration: "",
    travelType: "",
    budget: 500,
  });

  // Fetch packages from API
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages");
      return res.data;
    }
  });

  // Extract unique destinations from packages
  const destinations = useMemo(() => {
    const uniqueLocations = [...new Set(packages.map(pkg => pkg.location).filter(Boolean))];
    return uniqueLocations.map(location => {
      const lowerLocation = location.toLowerCase();
      const icon = destinationIcons[lowerLocation] || "📍";
      return { name: location, icon };
    });
  }, [packages]);

  // Extract unique durations from packages
  const durations = useMemo(() => {
    const uniqueDurations = [...new Set(packages.map(pkg => pkg.duration).filter(Boolean))];
    const durationMap = new Map();
    
    uniqueDurations.forEach(duration => {
      const durationDays = parseDurationToDays(duration);
      if (!durationMap.has(durationDays)) {
        durationMap.set(durationDays, {
          label: duration,
          value: durationDays,
          icon: durationDays <= 3 ? "⚡" : durationDays <= 5 ? "📅" : durationDays <= 7 ? "🌟" : "🎒"
        });
      }
    });
    
    return Array.from(durationMap.values()).sort((a, b) => a.value - b.value);
  }, [packages]);

  // Extract unique travel types from packages
  const travelTypes = useMemo(() => {
    const uniqueTypes = [...new Set(packages.map(pkg => pkg.tourType).filter(Boolean))];
    return uniqueTypes.map(type => {
      const lowerType = type.toLowerCase();
      const typeInfo = tourTypeIcons[lowerType] || { icon: "🎯", description: "Unique experience" };
      return {
        name: type,
        icon: typeInfo.icon,
        description: typeInfo.description
      };
    });
  }, [packages]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleDestinationSelect = (destination) => {
    setFormData((prev) => ({ ...prev, destination: destination.name }));
  };

  const handleDurationSelect = (duration) => {
    setFormData((prev) => ({ ...prev, duration: duration.value }));
  };

  const handleTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, travelType: type.name }));
  };

  const handleBudgetChange = (e) => {
    setFormData((prev) => ({ ...prev, budget: e.target.value }));
  };

  // Filter packages based on user preferences
  const filteredPackages = packages.filter((pkg) => {
    const pkgDurationDays = parseDurationToDays(pkg.duration);
    
    // Exact match for destination
    const destinationMatch = formData.destination 
      ? pkg.location === formData.destination 
      : true;
    
    // Exact match for tour type
    const typeMatch = formData.travelType 
      ? pkg.tourType === formData.travelType 
      : true;
    
    // Duration match - package duration should be less than or equal to selected duration
    const durationMatch = formData.duration 
      ? pkgDurationDays <= Number(formData.duration) 
      : true;
    
    // Budget match
    const budgetMatch = pkg.price <= Number(formData.budget);

    return destinationMatch && typeMatch && durationMatch && budgetMatch;
  });

  return (
    <section className="py-32 px-4 md:px-8 lg:px-16 bg-white">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-6">
            Plan Your{' '}
            <span className="bg-linear-to-r from-[#29AB87] to-[#9333EA] bg-clip-text text-transparent">
              Perfect Trip
            </span>
          </h2>
          <p className="text-xl text-gray-600">Tell us your preferences, we'll suggest the best packages</p>
        </motion.div>

        {/* Modern Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-linear-to-br from-gray-50 to-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* Step Progress */}
          <div className="bg-white px-8 py-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4 relative">
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-100 rounded-full" />
              <motion.div
                className="absolute top-6 left-0 h-1 bg-linear-to-r from-[#29AB87] to-[#4F46E5] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((step - 1) / 4) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />

              {[1, 2, 3, 4, 5].map((s) => (
                <motion.div
                  key={s}
                  onClick={() => setStep(s)}
                  className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer font-bold transition-all shadow-lg ${
                    step >= s
                      ? "bg-linear-to-br from-[#29AB87] to-[#4F46E5] text-white"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                  }`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {step > s ? <FiCheck className="text-xl" /> : s}
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span className={step === 1 ? "font-bold text-black" : ""}>Destination</span>
              <span className={step === 2 ? "font-bold text-black" : ""}>Duration</span>
              <span className={step === 3 ? "font-bold text-black" : ""}>Experience</span>
              <span className={step === 4 ? "font-bold text-black" : ""}>Budget</span>
              <span className={step === 5 ? "font-bold text-black" : ""}>Results</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[320px]"
              >
                {step === 1 && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-3xl font-bold">Where do you want to go?</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Select your dream destination</p>

                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-[#29AB87] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-gray-600 mt-4">Loading destinations...</p>
                      </div>
                    ) : destinations.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📍</div>
                        <p className="text-xl text-gray-600">No destinations available yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {destinations.map((dest) => (
                          <motion.button
                            key={dest.name}
                            type="button"
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDestinationSelect(dest)}
                            className={`p-6 rounded-2xl font-semibold transition-all border-2 ${
                              formData.destination === dest.name
                                ? "bg-linear-to-br from-[#29AB87] to-[#4F46E5] text-white border-transparent shadow-xl"
                                : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg"
                            }`}
                          >
                            <div className="text-sm">{dest.name}</div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-3xl font-bold">How long is your trip?</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Choose your preferred duration</p>
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-[#29AB87] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-gray-600 mt-4">Loading durations...</p>
                      </div>
                    ) : durations.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">⏱️</div>
                        <p className="text-xl text-gray-600">No durations available yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {durations.map((dur) => (
                          <motion.button
                            key={dur.value}
                            type="button"
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDurationSelect(dur)}
                            className={`p-6 rounded-2xl font-semibold transition-all border-2 ${
                              formData.duration === dur.value
                                ? "bg-linear-to-br from-[#29AB87] to-[#4F46E5] text-white border-transparent shadow-xl"
                                : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg"
                            }`}
                          >
                            <div className="text-sm">{dur.label}</div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-3xl font-bold">What type of experience?</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Pick your travel style</p>

                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-[#29AB87] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-gray-600 mt-4">Loading experiences...</p>
                      </div>
                    ) : travelTypes.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <p className="text-xl text-gray-600">No travel types available yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {travelTypes.map((type) => (
                          <motion.button
                            key={type.name}
                            type="button"
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTypeSelect(type)}
                            className={`p-6 rounded-2xl font-semibold transition-all border-2 ${
                              formData.travelType === type.name
                                ? "bg-linear-to-br from-[#29AB87] to-[#4F46E5] text-white border-transparent shadow-xl"
                                : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg"
                            }`}
                          >
                            <div className="text-sm font-bold mb-1">{type.name}</div>
                            <div className={`text-xs ${formData.travelType === type.name ? 'text-white/80' : 'text-gray-500'}`}>
                              {type.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-3xl font-bold">What's your budget?</h3>
                    </div>
                    <p className="text-gray-600 mb-8">Set your travel budget per person</p>
                    <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                      <input
                        type="range"
                        name="budget"
                        min="50"
                        max="1000"
                        step="10"
                        value={formData.budget}
                        onChange={handleBudgetChange}
                        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#29AB87]"
                        style={{
                          background: `linear-gradient(to right, #29AB87 0%, #29AB87 ${((formData.budget - 50) / 950) * 100}%, #e5e7eb ${((formData.budget - 50) / 950) * 100}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="flex justify-between mt-4 text-sm text-gray-500">
                        <span>$50</span>
                        <span>$1000</span>
                      </div>
                      <div className="text-center mt-8">
                        <div className="text-5xl font-black bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
                          ${formData.budget}
                        </div>
                        <div className="text-gray-500 mt-2">per person</div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-linear-to-br from-[#29AB87] to-[#4F46E5] rounded-xl flex items-center justify-center">
                        <FiCheck className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold">Perfect Matches for You</h3>
                    </div>
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-[#29AB87] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-gray-600 mt-4">Finding perfect packages for you...</p>
                      </div>
                    ) : filteredPackages.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl text-gray-600">No packages match your criteria.</p>
                        <p className="text-gray-500 mt-2">Try adjusting your preferences.</p>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {filteredPackages.map((pkg, index) => (
                          <Link key={pkg._id} to={`/package/${pkg._id}`}>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 8 }}
                              className="p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#29AB87] transition-all shadow-lg hover:shadow-xl cursor-pointer"
                            >
                              <div className="flex gap-6 items-start">
                                {/* Package Image */}
                                {pkg.images && pkg.images[0] && (
                                  <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0">
                                    <img 
                                      src={pkg.images[0]} 
                                      alt={pkg.title || pkg.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                      <h4 className="text-2xl font-bold mb-2 group-hover:text-[#29AB87] transition-colors">
                                        {pkg.title || pkg.name}
                                      </h4>
                                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                          <FiMapPin className="text-[#29AB87]" />
                                          {pkg.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          🎯 {pkg.tourType}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <FiClock className="text-[#4F46E5]" />
                                          {pkg.duration}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right ml-4">
                                      <div className="text-3xl font-black bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
                                        ${pkg.price}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">per person</div>
                                    </div>
                                  </div>
                                  
                                  {pkg.description && (
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                      {pkg.description}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-2 text-[#29AB87] font-bold text-sm">
                                    <span>View Details</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="bg-white px-8 py-6 border-t border-gray-100 flex justify-between items-center">
            {step > 1 ? (
              <motion.button
                whileHover={{ scale: 1.05, x: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevStep}
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 rounded-full font-bold transition-colors"
              >
                ← Back
              </motion.button>
            ) : (
              <div />
            )}
            {step < 5 && (
              <motion.button
                whileHover={{ scale: 1.05, x: 4 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="ml-auto px-8 py-3 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-shadow"
              >
                Continue →
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PlanYourTrip;



