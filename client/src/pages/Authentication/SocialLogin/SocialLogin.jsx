import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase/firebase.init";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

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

      // Replace with your actual backend URL
      await fetch(`https://your-backend-server.com/users/${user.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      navigate("/");
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="btn btn-outline w-full flex items-center justify-center gap-3"
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <FcGoogle size={20} />
        )}
        {loading ? "Signing in..." : "Continue with Google"}
      </button>
    </div>
  );
};

export default SocialLogin;
