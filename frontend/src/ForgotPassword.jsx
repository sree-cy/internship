import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyEmail.css";

const API_BASE = "http://localhost:5000/api/auth";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const response = await axios.post(`${API_BASE}/forgot-password`, {
        email: email.trim().toLowerCase(),
      });

      setSuccessMsg("Verification code sent to your email.");

      // Transition to Verify Reset OTP
      setTimeout(() => {
        navigate("/verify-reset-otp", {
          state: {
            email: email.trim().toLowerCase(),
            message: "Verification code sent to your email.",
          },
        });
      }, 1200);

    } catch (err) {
      console.error("Forgot password error:", err);
      const msg = err.response?.data?.message || "Failed to process request. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* PrepGo Logo */}
        <div className="auth-brand-logo">
          PG
        </div>

        {/* Title */}
        <h1 className="auth-title">Forgot Password?</h1>

        <p className="auth-desc">
          Enter your registered email address to receive a 6-digit password reset code.
        </p>

        {/* Alerts */}
        {errorMsg && <div className="auth-alert auth-alert-error">{errorMsg}</div>}
        {successMsg && <div className="auth-alert auth-alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label>Email Address</label>
            <input
              type="email"
              className="auth-input-box"
              placeholder="e.g. candidate@domain.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg("");
              }}
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={loading || !email.trim()}
          >
            {loading ? "Sending verification code..." : "Send Reset Code →"}
          </button>
        </form>

        <div className="auth-back-link">
          Remember your password?{" "}
          <button type="button" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;
