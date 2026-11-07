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
import ProtectedRoute from "./ProtectedRoute";

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

      {/* Protected Candidate Workspace Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard" element={<Navigate to="/home" replace />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute>
            <Achievements />
          </ProtectedRoute>
        }
      />

      {/* Redirect /practice to Round 1 */}
      <Route path="/practice" element={<Navigate to="/aptitude" replace />} />

      {/* Round 1 (Aptitude) */}
      <Route
        path="/aptitude"
        element={
          <ProtectedRoute>
            <AptitudeHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aptitude/instructions/:level"
        element={
          <ProtectedRoute>
            <AptitudeInstructions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aptitude/test/:level"
        element={
          <ProtectedRoute>
            <AptitudeTest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aptitude/result"
        element={
          <ProtectedRoute>
            <AptitudeResult />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aptitude/review"
        element={
          <ProtectedRoute>
            <ReviewAnswers />
          </ProtectedRoute>
        }
      />

      {/* Round 2 (DSA) */}
      <Route
        path="/dsa"
        element={
          <ProtectedRoute>
            <DSAHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dsa/instructions/:level"
        element={
          <ProtectedRoute>
            <DSAInstructions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dsa/test/:level"
        element={
          <ProtectedRoute>
            <DSATest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dsa/result"
        element={
          <ProtectedRoute>
            <DSAResult />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
