import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiXCircle, FiArrowLeft, FiCreditCard, FiAlertCircle } from "react-icons/fi";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const bookingId = searchParams.get("booking_id");

  const handleRetryPayment = () => {
    if (bookingId) {
      navigate(`/dashboard/payment/${bookingId}`);
    } else {
      navigate("/dashboard/my-bookings");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Cancel Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-orange-500 to-red-500 p-8 text-center relative overflow-hidden">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative z-10"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                >
                  <FiXCircle className="w-12 h-12 text-orange-500" />
                </motion.div>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl md:text-4xl font-black text-white mb-2"
              >
                Payment Cancelled
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-white/90 text-lg"
              >
                Your payment was not completed
              </motion.p>
            </motion.div>

            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Info Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl"
            >
              <FiAlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-orange-900 mb-1">Payment Not Processed</p>
                <p className="text-sm text-orange-700">
                  You cancelled the payment process. Your booking is still pending and no charges were made to your card.
                </p>
              </div>
            </motion.div>

            {/* What Happened Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3">What happened?</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>You closed the payment window or clicked the back button</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>No payment was processed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Your booking remains in "Pending" status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>You can retry the payment anytime</span>
                </li>
              </ul>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3">What can you do?</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#29AB87] mt-1">✓</span>
                  <span>Retry the payment to complete your booking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#29AB87] mt-1">✓</span>
                  <span>Review your booking details before paying</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#29AB87] mt-1">✓</span>
                  <span>Contact support if you need assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#29AB87] mt-1">✓</span>
                  <span>Cancel the booking if you've changed your mind</span>
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetryPayment}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <FiCreditCard className="w-5 h-5" />
                <span>Retry Payment</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/dashboard/my-bookings")}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-[#29AB87] hover:text-[#29AB87] transition-all"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back to Bookings</span>
              </motion.button>
            </motion.div>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-center pt-4 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500">
                Need help? Contact our support team at{" "}
                <a href="mailto:support@wanderbd.com" className="text-[#29AB87] hover:underline font-medium">
                  support@wanderbd.com
                </a>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6 text-gray-500 text-sm"
        >
          Don't worry, you can always retry the payment later! 💳
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentCancel;

