import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyAssignedTours = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch assigned tours from backend using the logged-in user's email
  const { data: tours = [], isLoading } = useQuery({
    queryKey: ["assignedTours", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/guide/${user.email}`);
      return res.data;
    },
  });

  // Mutation for rejecting a tour
  const rejectTourMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/bookings/${id}`, {
        status: "Rejected",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assignedTours", user.email]);
      setIsModalOpen(false);
    },
  });

  // Mutation for accepting a tour
  const acceptTourMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/bookings/${id}`, {
        status: "Accepted",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assignedTours", user.email]);
    },
  });

  const openRejectModal = (tour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  const confirmReject = () => {
    if (selectedTour) {
      rejectTourMutation.mutate(selectedTour._id);
    }
  };

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">My Assigned Tours</h2>

      {isLoading ? (
        <p>Loading tours...</p>
      ) : (
        <table className="table w-full border bg-[#29AB8760]">
          <thead className="bg-[#29AB8790]">
            <tr>
              <th>#</th>
              <th>Package</th>
              <th>Tourist</th>
              <th>Tour Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour, index) => (
              <tr key={tour._id} className="hover">
                <td>{index + 1}</td>
                <td>{tour.packageName}</td>
                <td>{tour.touristName}</td>
                <td>{new Date(tour.tourDate).toLocaleDateString()}</td>
                <td>${tour.price}</td>
                <td>{tour.status}</td>
                <td className="space-x-2">
                  <button
                    disabled={tour.status !== "In Review"}
                    onClick={() => acceptTourMutation.mutate(tour._id)}
                    className={`btn btn-success btn-sm ${tour.status !== "In Review" ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    Accept
                  </button>
                  {tour.status === "In Review" && (
                    <button
                      onClick={() => openRejectModal(tour)}
                      className="btn btn-error btn-sm"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Reject Confirmation Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
            <Dialog.Title className="text-xl font-bold mb-2 text-red-600">Reject Tour?</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to reject the tour:{" "}
              <span className="font-semibold">{selectedTour?.packageName}</span>?
            </Dialog.Description>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={confirmReject}>
                Confirm Reject
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MyAssignedTours;
