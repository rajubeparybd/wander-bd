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
      case "Rejected":
        return {
          icon: FiXCircle,
          color: "from-red-500 to-red-600",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          label: "Rejected",
        };
      default:
        return {
          icon: FiClock,
          color: "from-yellow-500 to-yellow-600",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
          label: "Pending",
        };
    }
  };

  const { confirmedCount, pendingCount } = useMemo(() => ({
    confirmedCount: bookings.filter(b => b.status === "Accepted").length,
    pendingCount: bookings.filter(b => b.status === "Pending").length,
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
        <div className="space-y-6">
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
                  whileHover={{ y: -4 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-2xl transition-all"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left Section - Main Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-black mb-2">
                              {booking.packageName}
                            </h3>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${statusConfig.bgColor} ${statusConfig.textColor} font-semibold`}>
                              <StatusIcon className="w-4 h-4" />
                              {statusConfig.label}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#29AB87] to-[#06B6D4] flex items-center justify-center">
                              <FiUser className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Tour Guide</div>
                              <div className="font-bold">{booking.guideName}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center">
                              <FiCalendar className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Tour Date</div>
                              <div className="font-bold">{booking.tourDate}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#06B6D4] to-[#4F46E5] flex items-center justify-center">
                              <FiDollarSign className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Price</div>
                              <div className="font-bold">৳{booking.price}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#9333EA] to-[#29AB87] flex items-center justify-center">
                              <FiMapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Booking ID</div>
                              <div className="font-bold text-sm">#{booking._id.slice(-8)}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      {booking.status === "Pending" && (
                        <div className="flex flex-col gap-3 lg:min-w-[200px]">
                          <Link to={`/dashboard/payment/${booking._id}`} className="w-full">
                            <motion.button
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                              <FiCreditCard className="w-5 h-5" />
                              Pay Now
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCancel(booking._id)}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                          >
                            <FiX className="w-5 h-5" />
                            Cancel
                          </motion.button>
                        </div>
                      )}
                    </div>
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
