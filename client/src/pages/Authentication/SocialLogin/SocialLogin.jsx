/* eslint-disable no-unused-vars */
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-hot-toast";
import { auth } from "../../../firebase/firebase.init";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

const SocialLogin = () => {
  const [loading, setLoading] = useState(false);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        role: "user", // Default role
      };

      const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await fetch(`${serverUrl}/users/${user.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      navigate("/");
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full py-3.5 bg-white border-2 border-gray-200 hover:border-[#29AB87] rounded-xl font-semibold text-gray-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        <FcGoogle size={24} />
      )}
      {loading ? "Signing in..." : "Continue with Google"}
    </motion.button>
  );
};

export default SocialLogin;
