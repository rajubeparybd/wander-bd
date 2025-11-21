import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase.init";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  // Retrieve the route user attempted to access
  const from = location.state?.from || "/";

  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate(from, { replace: true }); // Redirect to original page after login
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-base-100 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="Email"
          className="input input-bordered w-full"
        />

        {/* Password with toggle */}
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

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full">Login</button>
      </form>

      {/* Register Link */}
      <p className="text-sm mt-4 text-center">
        Don’t have an account?{" "}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Register here
        </Link>
      </p>

      {/* Social Login */}
      <SocialLogin />
    </div>
  );
};

export default Login;
