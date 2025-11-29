import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiChevronRight } from "react-icons/fi";

const defaultPosition = [23.685, 90.3563];

import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FlyToDistrict({ coords }) {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, 14, { duration: 1.5 });
  }
  return null;
}

const dummyServiceCenters = [
  { district: "Cox's Bazar", latitude: 21.4272, longitude: 92.0058, covered_area: ["Inani", "Himchari", "Laboni Beach"], travelers: "2.3k+" },
  { district: "Dhaka", latitude: 23.8103, longitude: 90.4125, covered_area: ["Lalbagh", "Old Dhaka", "Dhanmondi"], travelers: "5.1k+" },
  { district: "Bandarban", latitude: 21.8311, longitude: 92.3686, covered_area: ["Nilgiri", "Boga Lake", "Sangu River"], travelers: "1.8k+" },
  { district: "Srimangal", latitude: 24.3065, longitude: 91.7296, covered_area: ["Lawachara", "Tea Gardens", "Baikka Beel"], travelers: "1.2k+" },
  { district: "Sundarbans", latitude: 21.9497, longitude: 89.1833, covered_area: ["Tiger Reserve", "Mangrove Forest", "River Safari"], travelers: "980+" },
  { district: "Sylhet", latitude: 24.8949, longitude: 91.8687, covered_area: ["Ratargul", "Jaflong", "Tea Estates"], travelers: "1.5k+" },
];

const CoverageMap = () => {
  const [activeCoords, setActiveCoords] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(null);

  const handleLocationClick = (location) => {
    setActiveCoords([location.latitude, location.longitude]);
    setActiveDistrict(location.district);
  };

  return (
    <section className="py-32 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-6">
            We're{' '}
            <span className="bg-gradient-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
              Everywhere
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our coverage across Bangladesh's most beautiful destinations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Location List */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold mb-6">Popular Destinations</h3>
            {dummyServiceCenters.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 8 }}
                onClick={() => handleLocationClick(location)}
                className={`p-6 rounded-2xl cursor-pointer transition-all ${
                  activeDistrict === location.district
                    ? 'bg-black text-white shadow-2xl'
                    : 'bg-white hover:bg-gray-50 shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FiMapPin className={`w-5 h-5 ${activeDistrict === location.district ? 'text-[#29AB87]' : 'text-gray-400'}`} />
                      <h4 className="text-xl font-bold">{location.district}</h4>
                    </div>
                    <p className={`text-sm mb-2 ${activeDistrict === location.district ? 'text-white/80' : 'text-gray-600'}`}>
                      {location.covered_area.join(", ")}
                    </p>
                    <div className={`text-xs ${activeDistrict === location.district ? 'text-white/70' : 'text-gray-500'}`}>
                      {location.travelers} travelers visited
                    </div>
                  </div>
                  <FiChevronRight className={`w-6 h-6 ${activeDistrict === location.district ? 'text-white' : 'text-gray-400'}`} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column - Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl sticky top-24"
          >
            <MapContainer center={defaultPosition} zoom={7} scrollWheelZoom={true} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyToDistrict coords={activeCoords} />
              {dummyServiceCenters.map((center, index) => (
                <Marker key={index} position={[center.latitude, center.longitude]} icon={customIcon}>
                  <Popup autoOpen={center.district === activeDistrict}>
                    <strong>{center.district}</strong>
                    <br />
                    {center.covered_area.join(", ")}
                    <br />
                    <span style={{ fontSize: '12px', color: '#666' }}>{center.travelers} travelers</span>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CoverageMap;
