/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiPackage, FiArrowRight, FiLoader } from "react-icons/fi";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  
  const [verifying, setVerifying] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState("");

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setError("No payment session found");
      setVerifying(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axiosSecure.get(`/payments/verify-session/${sessionId}`);
        setPaymentDetails(response.data);
        setVerifying(false);
      } catch (err) {
        console.error("Payment verification error:", err);
        setError("Failed to verify payment");
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, axiosSecure]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 border-4 border-[#29AB87] border-t-transparent rounded-full"
          />
          <p className="text-xl font-semibold text-gray-700">Verifying payment...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 via-white to-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <FiCheckCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error || "Unable to verify payment"}</p>
          <button
            onClick={() => navigate("/dashboard/my-bookings")}
            className="px-6 py-3 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white font-bold rounded-xl hover:shadow-lg transition-shadow"
          >
            Go to My Bookings
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with Animation */}
          <div className="bg-linear-to-r from-green-500 to-[#29AB87] p-8 text-center relative overflow-hidden">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative z-10"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                >
                  <FiCheckCircle className="w-12 h-12 text-green-500" />
                </motion.div>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl md:text-4xl font-black text-white mb-2"
              >
                Payment Successful!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-white/90 text-lg"
              >
                Your booking has been confirmed
              </motion.p>
            </motion.div>

            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                <FiCheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">Payment Status</p>
                  <p className="text-sm text-green-700 capitalize">
                    {paymentDetails.paymentStatus || "Completed"}
                  </p>
                </div>
              </div>

              {paymentDetails.customerEmail && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Email</span>
                  <span className="font-semibold text-gray-900">{paymentDetails.customerEmail}</span>
                </div>
              )}

              {paymentDetails.amountTotal && (
                <div className="flex justify-between items-center p-4 bg-linear-to-br from-[#29AB87]/10 to-[#4F46E5]/10 rounded-xl border border-[#29AB87]/20">
                  <span className="text-gray-700 font-medium">Amount Paid</span>
                  <span className="text-2xl font-black text-[#29AB87]">
                    ৳{paymentDetails.amountTotal.toLocaleString()}
                  </span>
                </div>
              )}
            </motion.div>

            {/* What's Next Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiPackage className="w-5 h-5 text-[#4F46E5]" />
                What's Next?
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#29AB87] mt-1">✓</span>
                  <span>Your booking is now under review</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#29AB87] mt-1">✓</span>
                  <span>The tour guide will confirm your booking soon</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#29AB87] mt-1">✓</span>
                  <span>You'll receive updates via email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#29AB87] mt-1">✓</span>
                  <span>Check your bookings page for status updates</span>
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/dashboard/my-bookings")}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <span>View My Bookings</span>
                <FiArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/trips")}
                className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-[#29AB87] hover:text-[#29AB87] transition-all"
              >
                Browse More Trips
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Confetti Effect (Optional) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6 text-gray-500 text-sm"
        >
          🎉 Thank you for choosing WanderBD! 🎉
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;

