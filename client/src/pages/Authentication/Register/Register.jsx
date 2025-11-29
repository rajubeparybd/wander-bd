import { useForm } from "react-hook-form";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../../firebase/firebase.init";
import { Link, useNavigate } from "react-router-dom";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      // Step 1: Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Step 2: Update Firebase displayName (optional but useful)
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

      // Optional: reset form and navigate
      reset();
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          {...register("name", { required: true })}
          placeholder="Full Name"
          className="input input-bordered w-full"
        />

        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="Email"
          className="input input-bordered w-full"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: true })}
            placeholder="Password"
            className="input input-bordered w-full pr-10"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Register
        </button>
      </form>

      <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Login here
        </Link>
      </p>

      <div className="divider">OR</div>

      <SocialLogin />
    </div>
  );
};

export default Register;
