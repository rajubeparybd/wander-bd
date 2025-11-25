import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";



const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const TourismAndGuide = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch packages
  const { data: packages = [], isLoading: packagesLoading, error: packagesError } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages");
      return res.data;
    }
  });

  // Fetch tour guides
  const { data: guides = [], isLoading: guidesLoading, error: guidesError } = useQuery({
    queryKey: ["tourGuides"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tour-guides");
      return res.data;
    }
  });


  if (packagesLoading || guidesLoading) return <p>Loading...</p>;
  if (packagesError) return <p>Error loading packages: {packagesError.message}</p>;
  if (guidesError) return <p>Error loading guides: {guidesError.message}</p>;

  const randomPackages = getRandomItems(packages, 3);
  const randomGuides = getRandomItems(guides, 6);

  return (
    <section className="py-12 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Tourism & Travel Guide</h2>

        <Tabs>
          <TabList className="flex justify-center gap-4 mb-6">
            <Tab className="btn btn-outline">Our Packages</Tab>
            <Tab className="btn btn-outline">Meet Our Tour Guides</Tab>
          </TabList>

          {/* Packages Tab */}
          <TabPanel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {randomPackages.map(pkg => (
                <div key={pkg._id} className="card hover:bg-[#29AB87] bg-[#29AB8760] shadow-xl">
                  <figure>
                    <img
                      src={pkg.images?.[0] || "https://via.placeholder.com/400x250?text=No+Image"}
                      alt={pkg.name}
                      className="h-52 w-full object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">{pkg.name}</h3>
                    <p className="text-sm">Tour Type: {pkg.type || "N/A"}</p>
                    <p className="text-sm">Price: ৳ {pkg.price}</p>
                    <div className="card-actions justify-end">
                      <Link to={`/package/${pkg._id}`}>
                        <button className="btn btn-sm btn-error ">View Package</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>

          {/* Tour Guides Tab */}
          <TabPanel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {randomGuides.map(guide => (
                <div key={guide._id} className="card hover:bg-[#29AB87] bg-[#29AB8760] shadow-xl">
                  <figure>
                    <img
                      src={guide.photo || "https://via.placeholder.com/400x250?text=No+Image"}
                      alt={guide.name}
                      className="h-52 w-full object-cover"
                    />
                  </figure>
                  <div className="card-body ">
                    <h3 className="card-title">{guide.name}</h3>
                    <p className="text-sm">Experience: {guide.experience}</p>
                    <p className="text-sm">
                      Languages: {Array.isArray(guide.languages) ? guide.languages.join(", ") : guide.languages}
                    </p>
                    <p className="text-sm">Specialty: {guide.specialty}</p>
                    <div className="card-actions justify-end">
                      <Link to={`/guides/${guide._id}`}>
                        <button className="btn btn-sm btn-error">View Profile</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </section>
  );
};

export default TourismAndGuide;
