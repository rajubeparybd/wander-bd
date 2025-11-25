import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

// Default position: Center of Bangladesh
const defaultPosition = [23.685, 90.3563];

// Fix leaflet default marker icons in Vite
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Fly animation helper
function FlyToDistrict({ coords }) {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, 14, { duration: 1.5 });
  }
  return null;
}

// Dummy coverage data (use your DB later)
const dummyServiceCenters = [
  {
    district: "Cox’s Bazar",
    latitude: 21.4272,
    longitude: 92.0058,
    covered_area: ["Inani", "Himchari", "Laboni Beach"],
  },
  {
    district: "Dhaka",
    latitude: 23.8103,
    longitude: 90.4125,
    covered_area: ["Lalbagh", "Old Dhaka", "Dhanmondi"],
  },
  {
    district: "Bandarban",
    latitude: 21.8311,
    longitude: 92.3686,
    covered_area: ["Nilgiri", "Boga Lake", "Sangu River"],
  },
  {
    district: "Srimangal",
    latitude: 24.3065,
    longitude: 91.7296,
    covered_area: ["Lawachara", "Tea Gardens", "Baikka Beel"],
  },
];

const CoveragehMap = () => {
  const [searchText, setSearchText] = useState("");
  const [activeCoords, setActiveCoords] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const district = dummyServiceCenters.find((d) =>
      d.district.toLowerCase().includes(searchText.toLowerCase())
    );
    if (district) {
      setActiveCoords([district.latitude, district.longitude]);
      setActiveDistrict(district.district);
    }
  };

  return (
    <section className="my-12 w-11/12 mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Tourism Coverage Map</h2>
        <p className="text-gray-600">See where Wander BD currently offers tours</p>
      </div>

      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg relative">
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-md px-4 flex bg-white rounded shadow"
        >
          <input
            type="text"
            placeholder="Search district..."
            className="flex-1 px-4 py-2 border rounded-l-md outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-focus"
          >
            Go
          </button>
        </form>

        {/* Map */}
        <MapContainer
          center={defaultPosition}
          zoom={7}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyToDistrict coords={activeCoords} />

          {dummyServiceCenters.map((center, index) => (
            <Marker
              key={index}
              position={[center.latitude, center.longitude]}
              icon={customIcon}
            >
              <Popup autoOpen={center.district === activeDistrict}>
                <strong>{center.district}</strong>
                <br />
                {center.covered_area.join(", ")}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
};

export default CoveragehMap;
