import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";


import Home from "../pages/Home/Home/Home";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import StoryDetails from "../pages/Story/StoryDetails";
import PackageDetailsPage from "../pages/PackageDetails/PackageDetailsPage/PackageDetailsPage";
import Community from "../pages/Community/Community";
import AboutUs from "../pages/AboutUs/AboutUs";
import AllTrips from "../pages/AllTrips/AllTrips";
import TourGuideProfile from "../pages/TourGuideProfile/TourGuideProfile";

import PrivateRoute from "../routes/PrivateRoute";
import AdminRoute from "../routes/AdminRoute";
import TourGuideRoute from "../routes/TourGuideRoute";

import DashboardProfile from "../pages/Dashboard/DashboardHome/DashboardProfile/DashboardProfile";
import MyBookings from "../pages/Dashboard/MyBookings/MyBookings";
import JoinAsTourGuide from "../pages/Dashboard/JoinAsTourGuide/JoinAsTourGuide";
import MyAssignedTours from "../pages/Dashboard/MyAssignedTours/MyAssignedTours";
import AddPackage from "../pages/Dashboard/AddPackage/AddPackage";
import ManageUsers from "../pages/Dashboard/ManageUsers/ManageUsers";
import ManageCandidates from "../pages/Dashboard/ManageCandidates/ManageCandidates";
import AddStory from "../pages/Dashboard/AddStory/AddStory";
import ManageStories from "../pages/Dashboard/ManageStories/ManageStories";
import EditStory from "../pages/Dashboard/ManageStories/EditStory";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentSuccess from "../pages/PaymentSuccess/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel/PaymentCancel";

// Dashboard Pages

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      {
        path: "story/:id",
        element: (
          <PrivateRoute>
            <StoryDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "package/:id",
        element: (
          <PrivateRoute>
            <PackageDetailsPage />
          </PrivateRoute>
        ),
      },
      { path: "community", element: <Community /> },
      { path: "about", element: <AboutUs /> },
      { path: "trips", element: <AllTrips /> },
      { path: "guides/:id", element: <TourGuideProfile /> },
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "payment-cancel", element: <PaymentCancel /> },
    ],
  },
  {
    path: "/login",
    Component: AuthLayout,
    children: [{ index: true, Component: Login }],
  },
  {
    path: "/register",
    Component: AuthLayout,
    children: [{ index: true, Component: Register }],
  },

  // ✅ Dashboard Routes
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "profile", element: <DashboardProfile /> },

      // Tourist Routes
      { path: "my-bookings", element: <MyBookings /> },
      { path: "join-as-tour-guide", element: <JoinAsTourGuide /> },

      // Tour Guide Routes
      {
        path: "my-assigned-tours",
        element: (
          <TourGuideRoute>
            <MyAssignedTours />
          </TourGuideRoute>
        ),
      },

      // Admin Routes
      {
        path: "add-package",
        element: (
          <AdminRoute>
            <AddPackage />
          </AdminRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "manage-candidates",
        element: (
          <AdminRoute>
            <ManageCandidates />
          </AdminRoute>
        ),
      },

      // Shared Routes
      { path: "add-story", element: <AddStory /> },
      { path: "manage-stories", element: <ManageStories /> },
      { path: "edit-story/:id", element: <EditStory /> },
      { path: "payment/:bookingId", element: <Payment /> },
    ],
  },
]);
