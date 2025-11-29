/* eslint-disable no-unused-vars */
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar, FiUser, FiMail, FiDollarSign, FiCheck } from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BookingForm = ({ price, packageName, user, guides }) => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      packageName: packageName || "",
      touristName: user?.name || "",
      touristEmail: user?.email || "",
      touristImage: user?.photoURL || "",
      price: price || "",
      tourDate: new Date(),
      tourGuide: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const selectedGuide = JSON.parse(data.tourGuide);

      const bookingData = {
        ...data,
        tourGuideName: selectedGuide.name,
        tourGuideEmail: selectedGuide.email,
        status: "Pending",
      };

      delete bookingData.tourGuide;

      const res = await axiosSecure.post("/bookings", bookingData);

      if (res.data.insertedId || res.data.acknowledged) {
        toast.success("Booking successful!");
        reset();
        navigate("/dashboard/my-bookings");
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative"
    >
      {/* Glassmorphism Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="w-12 h-12 rounded-xl bg-linear-to-br from-[#29AB87] to-[#4F46E5] flex items-center justify-center shadow-lg"
            >
              <FiCheck className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-black">Book Now</h3>
              <p className="text-sm text-gray-600">Secure your adventure</p>
            </div>
          </div>
        </div>

        {/* Price Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6 p-6 bg-linear-to-br from-[#29AB87]/10 to-[#4F46E5]/10 rounded-2xl border border-[#29AB87]/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-semibold">Total Price</span>
            <div className="text-right">
              <div className="text-4xl font-black bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
                ${price}
              </div>
              <div className="text-xs text-gray-500">per person</div>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Package Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-bold text-gray-700 mb-2">Package</label>
            <input
              type="text"
              {...register("packageName")}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29AB87] focus:border-transparent transition-all cursor-not-allowed"
              readOnly
            />
          </motion.div>

          {/* Tourist Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 }}
          >
            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FiUser className="text-[#29AB87]" />
              Your Name
            </label>
            <input
              type="text"
              {...register("touristName")}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29AB87] focus:border-transparent transition-all cursor-not-allowed"
              readOnly
            />
          </motion.div>

          {/* Tourist Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FiMail className="text-[#4F46E5]" />
              Email Address
            </label>
            <input
              type="email"
              {...register("touristEmail")}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29AB87] focus:border-transparent transition-all cursor-not-allowed"
              readOnly
            />
          </motion.div>

          {/* Hidden Tourist Image */}
          <input type="hidden" {...register("touristImage")} />

          {/* Hidden Price */}
          <input type="hidden" {...register("price")} />

          {/* Tour Date */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 }}
          >
            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FiCalendar className="text-[#29AB87]" />
              Tour Date
            </label>
            <Controller
              control={control}
              name="tourDate"
              rules={{ required: "Tour date is required" }}
              render={({ field }) => (
                <DatePicker
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29AB87] focus:border-transparent transition-all ${
                    errors.tourDate ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholderText="Select a date"
                  selected={field.value}
                  onChange={field.onChange}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                />
              )}
            />
            {errors.tourDate && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 mt-1 text-sm"
              >
                {errors.tourDate.message}
              </motion.p>
            )}
          </motion.div>

          {/* Tour Guide Dropdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FiUser className="text-[#4F46E5]" />
              Select Tour Guide
            </label>
            <select
              {...register("tourGuide", { required: "Please select a tour guide" })}
              className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29AB87] focus:border-transparent transition-all ${
                errors.tourGuide ? "border-red-500" : "border-gray-200"
              }`}
              defaultValue=""
            >
              <option value="" disabled>
                Choose your guide
              </option>
              {guides.map((guide) => (
                <option
                  key={guide.id}
                  value={JSON.stringify({ name: guide.name, email: guide.email })}
                >
                  {guide.name}
                </option>
              ))}
            </select>
            {errors.tourGuide && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 mt-1 text-sm"
              >
                {errors.tourGuide.message}
              </motion.p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Confirm Booking
          </motion.button>
        </form>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5 text-[#29AB87]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">Secure & Protected Booking</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-6 -right-6 w-32 h-32 bg-linear-to-br from-[#29AB87]/20 to-[#4F46E5]/20 rounded-full blur-3xl -z-10"
      />
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-6 -left-6 w-32 h-32 bg-linear-to-br from-[#4F46E5]/20 to-[#29AB87]/20 rounded-full blur-3xl -z-10"
      />
    </motion.div>
  );
};

export default BookingForm;
