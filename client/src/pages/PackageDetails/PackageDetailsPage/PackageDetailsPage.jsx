import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Gallery from "../Gallery/Gallery";
import AboutTour from "../AboutTour/AboutTour";
import TourPlan from "../TourPlan/TourPlan";
import TourGuideList from "../TourGuide/TourGuideList";
import BookingForm from "../BookingForm/BookingForm";

import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const PackageDetailsPage = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); 

  // Fetch tour package by ID
  const {
    data: tourPackage,
    isLoading: packageLoading,
    isError: packageError,
    error: packageFetchError,
  } = useQuery({
    queryKey: ["package", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/packages/${id}`);
      return res.data;
    },
  });

  // Fetch user by email
  const {
    data: currentUser,
    isLoading: userLoading,
    isError: userError,
    error: userFetchError,
  } = useQuery({
    queryKey: ["user", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // ✅ Fetch tour guides from backend
  const {
    data: tourGuides = [],
    isLoading: guideLoading,
    isError: guideError,
    error: guideFetchError,
  } = useQuery({
    queryKey: ["tourGuides"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tour-guides");
      return res.data;
    },
  });

  if (packageLoading || userLoading || guideLoading) {
    return <p className="text-center">Loading...</p>;
  }

  if (packageError || userError || guideError) {
    return (
      <p className="text-center text-red-500">
        {packageFetchError?.message || userFetchError?.message || guideFetchError?.message}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Gallery images={tourPackage.images || []} />

      <AboutTour
        title={tourPackage.title}
        description={tourPackage.description}
      />

      <TourPlan plan={parseItinerary(tourPackage.itinerary)} />

      <TourGuideList guides={tourGuides} /> {/* ✅ Using fetched data */}

      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6 border-b-2 border-primary pb-2">
          Book Your Tour
        </h2>
        <BookingForm
          price={tourPackage.price}
          packageName={tourPackage.title}
          user={currentUser}
          guides={tourGuides}
        />
      </section>
    </div>
  );
};

// Helper to parse itinerary string into array
function parseItinerary(itineraryStr = "") {
  const lines = itineraryStr.split("\n").filter(Boolean);
  return lines.map((line) => {
    const [day, ...rest] = line.split(":");
    return {
      day: day.trim(),
      activities: rest.join(":").trim(),
    };
  });
}

export default PackageDetailsPage;
