/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import {
  FiMapPin,
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiCreditCard,
  FiX,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiPackage,
} from "react-icons/fi";

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
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, cancel it",
    });
    if (!result.isConfirmed) return;

    try {
      await axiosSecure.delete(`/bookings/${bookingId}`);
      Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
      refetch();
    } catch (error) {
      console.error("Cancel error:", error);
      Swal.fire("Error", "Failed to cancel booking.", "error");
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Accepted":
        return {
          icon: FiCheckCircle,
          color: "from-green-500 to-green-600",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          label: "Confirmed",
        };
      case "In Review":
        return {
          icon: FiCreditCard,
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
          label: "In Review",
        };
      case "Rejected":
        return {
          icon: FiXCircle,
          color: "from-red-500 to-red-600",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          label: "Rejected",
        };
      case "Pending":
        return {
          icon: FiClock,
          color: "from-yellow-500 to-yellow-600",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
          label: "Pending",
        };
      default:
        return {
          icon: FiClock,
          color: "from-yellow-500 to-yellow-600",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
          label: status || "Pending",
        };
    }
  };

  const { confirmedCount, pendingCount } = useMemo(() => ({
    confirmedCount: bookings.filter(b => b.status === "Accepted").length,
    pendingCount: bookings.filter(b => b.status === "Pending" || b.status === "In Review").length,
  }), [bookings]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#29AB87] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-black mb-2">
          My{" "}
          <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
            Bookings
          </span>
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your travel reservations and upcoming trips
        </p>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#29AB87] to-[#06B6D4] flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black">{bookings.length}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black">
                {confirmedCount}
              </div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#06B6D4] to-[#4F46E5] flex items-center justify-center">
              <FiClock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black">
                {pendingCount}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-16 text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-[#29AB87] to-[#4F46E5] flex items-center justify-center">
            <FiPackage className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-black mb-2">No Bookings Yet</h3>
          <p className="text-gray-600 mb-6">
            Start your adventure by booking your first trip!
          </p>
          <Link to="/trips">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              Browse Trips
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {bookings.map((booking, idx) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.1, 0.5) }}
                  whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                  className="group relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:border-[#29AB87]/30 transition-all duration-300 flex flex-col"
                >
                  {/* Status Badge - Top Right */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} font-bold text-xs shadow-lg backdrop-blur-sm`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig.label}
                    </div>
                  </div>

                  {/* Gradient Header */}
                  <div className="h-2 bg-linear-to-r from-[#29AB87] via-[#4F46E5] to-[#9333EA]" />

                  <div className="p-6 flex flex-col flex-1">
                    {/* Package Title */}
                    <div className="mb-4">
                      <h3 className="text-xl font-black text-gray-800 mb-2 pr-24 line-clamp-2">
                        {booking.packageName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FiPackage className="w-3.5 h-3.5" />
                        <span>#{booking._id.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-3 mb-4 flex-1">
                      {/* Tour Guide */}
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-[#29AB87] to-[#06B6D4] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <FiUser className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tour Guide</div>
                          <div className="font-bold text-sm text-gray-800 truncate">{booking.tourGuideName || booking.guideName}</div>
                        </div>
                      </div>

                      {/* Tour Date */}
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <FiCalendar className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tour Date</div>
                          <div className="font-bold text-sm text-gray-800">{new Date(booking.tourDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-[#06B6D4] to-[#4F46E5] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <FiDollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Price</div>
                          <div className="font-black text-xl text-transparent bg-clip-text bg-linear-to-r from-[#29AB87] to-[#4F46E5]">
                            ৳{booking.price}
                          </div>
                        </div>
                      </div>

                      {/* Payment Status */}
                      {booking.paymentStatus && (
                        <div className="p-3 rounded-xl bg-linear-to-r from-gray-50 to-gray-100 border border-gray-200">
                          <div className="flex items-center gap-2">
                            <FiCreditCard className="w-4 h-4 text-gray-600" />
                            <div>
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</div>
                              <div className="font-bold text-sm text-gray-800 capitalize">{booking.paymentStatus}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {booking.status === "Pending" && (
                      <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 mt-auto">
                        <Link to={`/dashboard/payment/${booking._id}`} className="w-full">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-2xl transition-all"
                          >
                            <FiCreditCard className="w-4 h-4" />
                            Pay Now
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCancel(booking._id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-red-500 text-red-500 font-bold text-sm rounded-xl hover:bg-red-50 transition-all"
                        >
                          <FiX className="w-4 h-4" />
                          Cancel
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
