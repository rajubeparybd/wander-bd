import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const MyBookings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myBookings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?email=${user.email}`);
      return res.data;
    },
  });

  const handleCancel = async (bookingId) => {
    const confirmCancel = confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      await axiosSecure.delete(`/bookings/${bookingId}`);
      alert("Booking cancelled.");
      refetch();
    } catch (error) {
      console.error("Cancel error:", error);
    }
  };

  if (isLoading) return <p className="p-5">Loading bookings...</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-5">My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border bg-[#29AB8760]">
            <thead className=" bg-[#29AB8790]">
              <tr>
                <th>#</th>
                <th>Package</th>
                <th>Guide</th>
                <th>Date</th>
                <th>Price (৳)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => (
                <tr key={booking._id} className="border-t">
                  <td>{idx + 1}</td>
                  <td>{booking.packageName}</td>
                  <td>{booking.guideName}</td>
                  <td>{booking.tourDate}</td>
                  <td>{booking.price}</td>
                  <td>
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        booking.status === "Accepted"
                          ? "bg-green-100 text-green-600"
                          : booking.status === "Rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="space-x-2">
                    {booking.status === "Pending" && (
                      <>
                        <Link
                          to={`/dashboard/payment/${booking._id}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Pay
                        </Link>
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
