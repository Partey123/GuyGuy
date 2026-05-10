import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Landing from "@/pages/landing/Landing";
import About from "@/pages/marketing/About";
import HowItWorks from "@/pages/marketing/HowItWorks";
import Pricing from "@/pages/marketing/Pricing";
import Contact from "@/pages/marketing/Contact";
import Terms from "@/pages/marketing/Terms";
import Privacy from "@/pages/marketing/Privacy";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import RoleSelect from "@/pages/auth/RoleSelect";
import EmailVerify from "@/pages/auth/EmailVerify";
import ClientDashboard from "@/pages/client/Dashboard";
import ArtisanDashboard from "@/pages/artisan/Dashboard";

import ClientHome from "@/pages/client/Home";
import Search from "@/pages/client/Search";
import ArtisanDetail from "@/pages/client/ArtisanDetail";
import BookingRequest from "@/pages/client/BookingRequest";
import MyBookings from "@/pages/client/MyBookings";
import BookingDetail from "@/pages/client/BookingDetail";
import ClientProfile from "@/pages/client/ClientProfile";
import Requests from "@/pages/artisan/Requests";
import ActiveJobs from "@/pages/artisan/ActiveJobs";
import Earnings from "@/pages/artisan/Earnings";
import Boost from "@/pages/artisan/Boost";
import EditProfile from "@/pages/artisan/EditProfile";
import Portfolio from "@/pages/artisan/Portfolio";
import PublicProfile from "@/pages/artisan/PublicProfile";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import VerificationQueue from "@/pages/admin/VerificationQueue";
import DisputeCenter from "@/pages/admin/DisputeCenter";
import Transactions from "@/pages/admin/Transactions";
import Users from "@/pages/admin/Users";
import UserDetail from "@/pages/admin/UserDetail";
import Analytics from "@/pages/admin/Analytics";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<EmailVerify />} />
      <Route path="/role" element={<RoleSelect />} />

      {/* Public shareable artisan profile (per Tech Bible) */}
      <Route path="/a/:slug" element={<PublicProfile />} />

      {/* Authed routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<ClientHome />} />
        <Route path="/search" element={<Search />} />
        <Route path="/artisans/:slug" element={<ArtisanDetail />} />
        <Route path="/book/:artisanId" element={<BookingRequest />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
        <Route path="/me" element={<ClientProfile />} />
      </Route>

      {/* Client-only routes */}
      <Route element={<RoleRoute allow={["client"]} />}>
        <Route path="/client/dashboard" element={<ClientDashboard />} />
      </Route>

     {/* Artisan-only routes */}
  <Route element={<RoleRoute allow={["artisan"]} />}>
  <Route path="/artisan" element={<ArtisanDashboard />} />  {/* ← fixed */}
  <Route path="/artisan/requests" element={<Requests />} />
  <Route path="/artisan/jobs" element={<ActiveJobs />} />
  <Route path="/artisan/earnings" element={<Earnings />} />
  <Route path="/artisan/boost" element={<Boost />} />
  <Route path="/artisan/profile/edit" element={<EditProfile />} />
  <Route path="/artisan/portfolio" element={<Portfolio />} />
</Route>

      {/* Admin-only */}
      <Route element={<RoleRoute allow={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/verifications" element={<VerificationQueue />} />
        <Route path="/admin/disputes" element={<DisputeCenter />} />
        <Route path="/admin/transactions" element={<Transactions />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/users/:id" element={<UserDetail />} />
        <Route path="/admin/analytics" element={<Analytics />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

