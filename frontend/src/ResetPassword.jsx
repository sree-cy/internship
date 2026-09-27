import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyEmail.css";

const API_BASE = "http://localhost:5000/api/auth";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState(location.state?.otp || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email.trim() || !otp.trim()) {
      setErrorMsg("Missing email or verification code. Please start over from Forgot Password.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const response = await axios.post(`${API_BASE}/reset-password`, {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword: password,
      });

      setSuccessMsg(response.data.message || "Password reset successfully!");

      setTimeout(() => {
        navigate("/login", {
          state: { message: "Password reset successfully! Please log in with your new password." },
        });
      }, 1500);

    } catch (err) {
      console.error("Password reset error:", err);
      const msg = err.response?.data?.message || "Failed to reset password. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="auth-brand-logo">
          PG
        </div>

        <h1 className="auth-title">Create New Password</h1>

        <p className="auth-desc">
          Enter a secure new password for your PrepGo account.
        </p>

        {errorMsg && <div className="auth-alert auth-alert-error">{errorMsg}</div>}
        {successMsg && <div className="auth-alert auth-alert-success">{successMsg}</div>}

        <form onSubmit={handleReset}>

          {/* New Password */}
          <div className="auth-input-group">
            <label>New Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input-box"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg("");
                }}
                required
                style={{ paddingRight: "60px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="auth-input-group">
            <label>Confirm New Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="auth-input-box"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrorMsg("");
                }}
                required
                style={{ paddingRight: "60px" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={loading || !password || !confirmPassword}
          >
            {loading ? "Resetting Password..." : "Update Password →"}
          </button>
        </form>

        <div className="auth-back-link">
          <button type="button" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;
