/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiCreditCard, FiCheckCircle, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const PaymentForm = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Fetch booking using TanStack Query
  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/${bookingId}`);
      return res.data;
    },
    enabled: !!bookingId,
  });

  const handlePayment = async () => {
    if (!bookingId) {
      setError("Invalid booking ID");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      // Create Stripe Checkout Session
      const response = await axiosSecure.post("/payments/create-checkout-session", {
        bookingId: bookingId,
        customerEmail: user?.email,
      });

      if (response.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        setError("Failed to create checkout session");
        setProcessing(false);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to initialize payment";
      setError(msg);
      console.error("Checkout session error:", err);
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#29AB87] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
        >
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">
            The booking you're trying to pay for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/dashboard/my-bookings")}
            className="px-6 py-3 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white font-bold rounded-xl hover:shadow-lg transition-shadow"
          >
            Back to Bookings
          </button>
        </motion.div>
      </div>
    );
  }

  const isAlreadyPaid = booking.status === "In Review" || booking.paymentStatus === "paid";

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/dashboard/my-bookings")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#29AB87] mb-6 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Bookings</span>
        </motion.button>

        {/* Payment Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] p-8 text-white">
            <h1 className="text-3xl font-black mb-2">Complete Payment</h1>
            <p className="text-white/90">Secure checkout powered by Stripe</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Booking Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Package</p>
                  <h2 className="text-2xl font-bold">{booking.packageName}</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tour Date</p>
                  <p className="font-semibold">{booking.tourDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tour Guide</p>
                  <p className="font-semibold">{booking.tourGuideName || booking.guideName}</p>
                </div>
              </div>

              {/* Price */}
              <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Total Amount</span>
                  <span className="text-3xl font-black text-[#29AB87]">
                    ৳{booking.price?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Already Paid Message */}
            {isAlreadyPaid && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <FiCheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-green-700 text-sm font-medium">
                  This booking has already been paid for
                </p>
              </motion.div>
            )}

            {/* Payment Button */}
            <motion.button
              whileHover={!processing && !isAlreadyPaid ? { scale: 1.02, y: -2 } : {}}
              whileTap={!processing && !isAlreadyPaid ? { scale: 0.98 } : {}}
              onClick={handlePayment}
              disabled={processing || isAlreadyPaid}
              className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                processing || isAlreadyPaid
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white hover:shadow-xl"
              }`}
            >
              {processing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Redirecting to Stripe...</span>
                </>
              ) : isAlreadyPaid ? (
                <>
                  <FiCheckCircle className="w-6 h-6" />
                  <span>Already Paid</span>
                </>
              ) : (
                <>
                  <FiCreditCard className="w-6 h-6" />
                  <span>Proceed to Payment</span>
                </>
              )}
            </motion.button>

            {/* Security Note */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                🔒 Secure payment processing by Stripe
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentForm;
