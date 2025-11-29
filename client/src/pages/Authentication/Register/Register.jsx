/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-hot-toast";
import { auth } from "../../../firebase/firebase.init";
import { Link, useNavigate } from "react-router-dom";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useState } from "react";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiUserPlus } from "react-icons/fi";
import { motion } from "framer-motion";

const Register = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Step 1: Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Step 2: Update Firebase displayName
      await updateProfile(user, {
        displayName: data.name,
      });

      // Step 3: Save user to MongoDB
      const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await fetch(`${serverUrl}/users/${user.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: user.email,
          role: "tourist", // default role
        }),
      });

      reset();
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Glass Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 relative overflow-hidden">
        {/* Decorative Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#29AB87] via-[#4F46E5] to-[#06B6D4]" />
        
        {/* Floating Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-6 -right-6 w-24 h-24 bg-linear-to-br from-[#29AB87]/20 to-[#4F46E5]/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 10, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-6 -left-6 w-24 h-24 bg-linear-to-br from-[#4F46E5]/20 to-[#06B6D4]/20 rounded-full blur-2xl"
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-black mb-3">
            Create{' '}
            <span className="bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text text-transparent">
              Account
            </span>
          </h2>
          <p className="text-gray-600">Start your adventure with us today</p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiUser className="w-5 h-5" />
              </div>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:border-[#29AB87] focus:bg-white transition-all duration-300 outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiMail className="w-5 h-5" />
              </div>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="your@email.com"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:border-[#29AB87] focus:bg-white transition-all duration-300 outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiLock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                placeholder="Create a strong password"
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:border-[#29AB87] focus:bg-white transition-all duration-300 outline-none text-gray-800 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#29AB87] transition-colors"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-linear-to-r from-[#29AB87] to-[#4F46E5] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <FiUserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative my-6"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/80 text-gray-500 font-medium">Or continue with</span>
          </div>
        </motion.div>

        {/* Social Login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <SocialLogin />
        </motion.div>

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-gray-600 mt-6"
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-transparent bg-linear-to-r from-[#29AB87] to-[#4F46E5] bg-clip-text hover:from-[#4F46E5] hover:to-[#29AB87] transition-all duration-300"
          >
            Sign In
          </Link>
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Register;
