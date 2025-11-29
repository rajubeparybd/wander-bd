/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import {
  FiUserCheck,
  FiFileText,
  FiGlobe,
  FiAward,
  FiLink,
  FiCheck,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";

const JoinAsTourGuide = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const applicationData = {
        ...data,
        name: user?.displayName || "Unknown",
        email: user?.email,
        photoURL: user?.photoURL || "",
        status: "pending",
        submittedAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/applications", applicationData);

      if (res.data.insertedId || res.data.success) {
        setIsOpen(true);
        reset();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Application submission error:", error);
      toast.error("Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-black mb-2">
          Become a{" "}
          <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
            Tour Guide
          </span>
        </h1>
        <p className="text-gray-600 text-lg">
          Share your expertise and passion for travel with others
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6"
      >
          {/* Application Title */}
          <div>
            <label className="flex items-center gap-2 text-lg font-bold mb-3">
              <FiUserCheck className="w-5 h-5 text-[#29AB87]" />
              Application Title
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              placeholder="e.g. Experienced Travel Enthusiast"
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none transition-colors text-lg"
            />
            {errors.title && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 flex items-center gap-1"
              >
                <FiX className="w-4 h-4" />
                {errors.title.message}
              </motion.p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="flex items-center gap-2 text-lg font-bold mb-3">
              <FiFileText className="w-5 h-5 text-[#29AB87]" />
              Why do you want to be a Tour Guide?
            </label>
            <textarea
              {...register("reason", { required: "This field is required" })}
              rows="4"
              placeholder="Share your passion, experience, or interest in becoming a tour guide..."
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none transition-colors text-lg resize-none"
            ></textarea>
            {errors.reason && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 flex items-center gap-1"
              >
                <FiX className="w-4 h-4" />
                {errors.reason.message}
              </motion.p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="flex items-center gap-2 text-lg font-bold mb-3">
              <FiAward className="w-5 h-5 text-[#29AB87]" />
              Experience
            </label>
            <input
              type="text"
              {...register("experience", { required: "Experience is required" })}
              placeholder="e.g. 3 years in Dhaka, Cox's Bazar, and Bandarban"
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none transition-colors text-lg"
            />
            {errors.experience && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 flex items-center gap-1"
              >
                <FiX className="w-4 h-4" />
                {errors.experience.message}
              </motion.p>
            )}
          </div>

          {/* Languages */}
          <div>
            <label className="flex items-center gap-2 text-lg font-bold mb-3">
              <FiGlobe className="w-5 h-5 text-[#29AB87]" />
              Languages You Speak
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Bangla",
                "English",
                "Hindi",
                "Arabic",
                "Mandarin",
                "Spanish",
                "French",
                "Russian",
                "German",
                "Japanese",
              ].map((lang) => (
                <label
                  key={lang}
                  className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 hover:border-[#29AB87] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    value={lang}
                    {...register("languages", { required: "Select at least one language" })}
                    className="w-5 h-5 text-[#29AB87] rounded focus:ring-[#29AB87]"
                  />
                  <span className="font-medium">{lang}</span>
                </label>
              ))}
            </div>
            {errors.languages && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 flex items-center gap-1"
              >
                <FiX className="w-4 h-4" />
                {errors.languages.message}
              </motion.p>
            )}
          </div>

          {/* Specialty */}
          <div>
            <label className="flex items-center gap-2 text-lg font-bold mb-3">
              <FiAward className="w-5 h-5 text-[#29AB87]" />
              Specialty
            </label>
            <textarea
              {...register("specialty", { required: "Specialty is required" })}
              rows="3"
              placeholder="e.g. Mountain trekking, city tours, cultural experiences, historical sites..."
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none transition-colors text-lg resize-none"
            ></textarea>
            {errors.specialty && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 flex items-center gap-1"
              >
                <FiX className="w-4 h-4" />
                {errors.specialty.message}
              </motion.p>
            )}
          </div>

          {/* CV Link */}
          <div>
            <label className="flex items-center gap-2 text-lg font-bold mb-3">
              <FiLink className="w-5 h-5 text-[#29AB87]" />
              CV/Portfolio Link
            </label>
            <input
              type="url"
              {...register("cvLink", { required: "CV/Portfolio link is required" })}
              placeholder="https://your-cv-link.com"
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#29AB87] focus:outline-none transition-colors text-lg"
            />
            {errors.cvLink && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 flex items-center gap-1"
              >
                <FiX className="w-4 h-4" />
                {errors.cvLink.message}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white hover:shadow-xl"
            }`}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                />
                Submitting...
              </>
            ) : (
              <>
                <FiCheck className="w-6 h-6" />
                Submit Application
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {isOpen && (
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
            />

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel
                as={motion.div}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl"
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-[#29AB87] to-[#4F46E5] flex items-center justify-center">
                    <FiCheckCircle className="w-10 h-10 text-white" />
                  </div>
                  
                  <Dialog.Title className="text-3xl font-black mb-3">
                    Application Submitted!
                  </Dialog.Title>
                  
                  <Dialog.Description className="text-gray-600 text-lg mb-6">
                    Thank you for applying to become a tour guide. Our team will review your application and get back to you soon.
                  </Dialog.Description>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                    className="px-8 py-3 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Got it!
                  </motion.button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JoinAsTourGuide;
