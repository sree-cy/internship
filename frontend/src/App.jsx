import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AptitudeHome from "./AptitudeHome";
import AptitudeInstructions from "./AptitudeInstructions";
import AptitudeTest from "./AptitudeTest";
import AptitudeResult from "./AptitudeResult";
import ReviewAnswers from "./ReviewAnswers";

import DSAHome from "./DSAHome";
import DSAInstructions from "./DSAInstructions";
import DSATest from "./DSATest";
import DSAResult from "./DSAResult";

import Login from "./Login";
import Register from "./Register";
import VerifyEmail from "./VerifyEmail";
import ForgotPassword from "./ForgotPassword";
import VerifyResetOTP from "./VerifyResetOTP";
import ResetPassword from "./ResetPassword";
import Home from "./Home";
import LandingPage from "./LandingPage";
import Profile from "./Profile";
import Progress from "./Progress";
import Reports from "./Reports";
import Achievements from "./Achievements";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<Navigate to="/home" replace />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/achievements" element={<Achievements />} />

      {/* Redirect /practice to Round 1 */}
      <Route path="/practice" element={<Navigate to="/aptitude" replace />} />

      {/* Round 1 (Aptitude) */}
      <Route path="/aptitude" element={<AptitudeHome />} />
      <Route path="/aptitude/instructions/:level" element={<AptitudeInstructions />} />
      <Route path="/aptitude/test/:level" element={<AptitudeTest />} />
      <Route path="/aptitude/result" element={<AptitudeResult />} />
      <Route path="/aptitude/review" element={<ReviewAnswers />} />

      {/* Round 2 (DSA) */}
      <Route path="/dsa" element={<DSAHome />} />
      <Route path="/dsa/instructions/:level" element={<DSAInstructions />} />
      <Route path="/dsa/test/:level" element={<DSATest />} />
      <Route path="/dsa/result" element={<DSAResult />} />
    </Routes>
  );
}

export default App;
