import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyEmail.css";

const API_BASE = "http://localhost:5000/api/auth";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [isEditingEmail, setIsEditingEmail] = useState(!location.state?.email);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const inputRefs = useRef([]);

  // Countdown timer for 60 seconds
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle single digit input
  const handleOtpChange = (index, value) => {
    // Only accept numeric digit
    const cleaned = value.replace(/[^0-9]/g, "");
    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const digit = cleaned.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setErrorMsg("");

    // Automatically focus next input
    if (index < 5 && digit) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full 6-digit OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().replace(/[^0-9]/g, "");
    if (pasteData.length > 0) {
      const digits = pasteData.slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      setErrorMsg("");
      const nextFocus = Math.min(digits.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  // Submit OTP Verification
  const handleVerify = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    if (enteredOtp.length !== 6) {
      setErrorMsg("Please enter all 6 digits of the verification code.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const response = await axios.post(`${API_BASE}/verify-email`, {
        email: email.trim().toLowerCase(),
        otp: enteredOtp,
      });

      setSuccessMsg(response.data.message || "Email verified successfully!");

      // Brief delay to display success message before redirect
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Email verified successfully! You can now log in." },
        });
      }, 1500);

    } catch (err) {
      console.error("Verification error:", err);
      const msg = err.response?.data?.message || "Failed to verify OTP. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend || resending) return;

    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    try {
      setResending(true);
      setErrorMsg("");
      setSuccessMsg("");

      const response = await axios.post(`${API_BASE}/resend-otp`, {
        email: email.trim().toLowerCase(),
      });

      setSuccessMsg(response.data.message || "New verification OTP sent to your email!");
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

    } catch (err) {
      console.error("Resend OTP error:", err);
      const msg = err.response?.data?.message || "Unable to resend OTP. Please try again later.";
      setErrorMsg(msg);
      if (err.response?.data?.retryAfter) {
        setCountdown(err.response.data.retryAfter);
        setCanResend(false);
      }
    } finally {
      setResending(false);
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
        <h1 className="auth-title">Verify Your Email</h1>

        {/* Subtitle with email indicator */}
        <p className="auth-desc">
          We have sent a 6-digit verification code to
          <br />
          {isEditingEmail ? (
            <input
              type="email"
              className="auth-input-box"
              style={{ marginTop: "10px", textAlign: "center" }}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <span className="auth-email-highlight">
              {email}
              <button
                type="button"
                onClick={() => setIsEditingEmail(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#10b981",
                  marginLeft: "8px",
                  fontSize: "12px",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Change
              </button>
            </span>
          )}
        </p>

        {/* Notifications */}
        {errorMsg && <div className="auth-alert auth-alert-error">{errorMsg}</div>}
        {successMsg && <div className="auth-alert auth-alert-success">{successMsg}</div>}

        {/* OTP Input Grid */}
        <form onSubmit={handleVerify}>
          <div className="otp-container" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                className={`otp-digit-input ${digit ? "filled" : ""}`}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="auth-primary-btn"
            disabled={loading || otp.join("").length !== 6}
          >
            {loading ? "Verifying Code..." : "Verify Code →"}
          </button>
        </form>

        {/* Resend OTP Section with 60s countdown */}
        <div className="resend-section">
          <span>Didn't receive the code?</span>
          {canResend ? (
            <button
              type="button"
              className="resend-btn"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          ) : (
            <span className="countdown-badge">
              Resend in {countdown}s
            </span>
          )}
        </div>

        {/* Back to Login link */}
        <div className="auth-back-link">
          Already verified?{" "}
          <button type="button" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default VerifyEmail;
