import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-base-100 p-8 rounded shadow-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
