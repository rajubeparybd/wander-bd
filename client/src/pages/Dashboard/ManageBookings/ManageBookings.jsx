import { useState } from "react";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "In Review", label: "In Review" },
  { value: "Accepted", label: "Accepted" },
  { value: "Rejected", label: "Rejected" },
];

const paymentStatusOptions = [
  { value: "all", label: "All Payments" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
];

const ManageBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(paymentStatusOptions[0]);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ["allBookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings/all");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/bookings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allBookings"]);
      Swal.fire("Deleted!", "Booking has been cancelled.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to cancel booking.", "error");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await axiosSecure.patch(`/bookings/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allBookings"]);
      Swal.fire("Updated!", "Booking status has been updated.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to update booking status.", "error");
    },
  });

  const handleDelete = async (booking) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Cancel booking for "${booking.packageName || booking.packageTitle}"? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, cancel it!",
    });

    if (confirm.isConfirmed) {
      deleteMutation.mutate(booking._id);
    }
  };

  const handleStatusChange = async (booking) => {
    const { value: newStatus } = await Swal.fire({
      title: "Change Booking Status",
      text: `Current status: ${booking.status}`,
      input: "select",
      inputOptions: {
        Pending: "Pending",
        "In Review": "In Review",
        Accepted: "Accepted",
        Rejected: "Rejected",
      },
      inputPlaceholder: "Select new status",
      showCancelButton: true,
      confirmButtonText: "Update",
      inputValidator: (value) => {
        if (!value) {
          return "You need to select a status!";
        }
      },
    });

    if (newStatus) {
      updateStatusMutation.mutate({ id: booking._id, status: newStatus });
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.touristName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.touristEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.packageTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus.value === "all" || booking.status === selectedStatus.value;
    const matchesPaymentStatus =
      selectedPaymentStatus.value === "all" || booking.paymentStatus === selectedPaymentStatus.value;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "badge badge-warning";
      case "In Review":
        return "badge badge-info";
      case "Accepted":
        return "badge badge-success";
      case "Rejected":
        return "badge badge-error";
      default:
        return "badge";
    }
  };

  const getPaymentBadgeClass = (paymentStatus) => {
    return paymentStatus === "paid" ? "badge badge-success" : "badge badge-warning";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        {/* Search */}
        <div className="flex items-center w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by tourist name/email or package"
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="-ml-8 text-gray-500" />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-1/3">
          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={setSelectedStatus}
            className="text-sm"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#d1d5db",
              }),
            }}
          />
        </div>

        {/* Payment Status Filter */}
        <div className="w-full md:w-1/3">
          <Select
            options={paymentStatusOptions}
            value={selectedPaymentStatus}
            onChange={setSelectedPaymentStatus}
            className="text-sm"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#d1d5db",
              }),
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg border">
        {isLoading ? (
          <p className="p-4">Loading bookings...</p>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Tourist</th>
                <th>Package</th>
                <th>Tour Guide</th>
                <th>Tour Date</th>
                <th>Price</th>
                <th className="text-center">Status</th>
                <th className="text-center">Payment</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center p-4 text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking, index) => (
                  <tr key={booking._id} className="hover:bg-gray-100 transition-colors">
                    <td>{index + 1}</td>
                    <td>
                      <div>
                        <div className="font-semibold">{booking.touristName}</div>
                        <div className="text-sm text-gray-500">{booking.touristEmail}</div>
                      </div>
                    </td>
                    <td className="font-semibold">
                      {booking.packageName || booking.packageTitle}
                    </td>
                    <td>
                      <div>
                        <div className="font-semibold">{booking.tourGuideName}</div>
                        <div className="text-sm text-gray-500">{booking.tourGuideEmail}</div>
                      </div>
                    </td>
                    <td>{formatDate(booking.tourDate)}</td>
                    <td>${booking.price}</td>
                    <td className="text-center">
                      <span className={getStatusBadgeClass(booking.status)}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={getPaymentBadgeClass(booking.paymentStatus)}>
                        {booking.paymentStatus === "paid" ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleStatusChange(booking)}
                          className="btn btn-sm btn-info"
                          title="Change Status"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(booking)}
                          className="btn btn-sm btn-error"
                          title="Cancel Booking"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;

