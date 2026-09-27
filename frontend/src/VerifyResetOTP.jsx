import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyEmail.css";

const API_BASE = "http://localhost:5000/api/auth";

function VerifyResetOTP() {
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

  // 60-second countdown
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

  const handleOtpChange = (index, value) => {
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

    if (index < 5 && digit) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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

  const handleVerify = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    if (enteredOtp.length !== 6) {
      setErrorMsg("Please enter all 6 digits of the reset code.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const response = await axios.post(`${API_BASE}/verify-reset-otp`, {
        email: email.trim().toLowerCase(),
        otp: enteredOtp,
      });

      setSuccessMsg(response.data.message || "Code verified!");

      setTimeout(() => {
        navigate("/reset-password", {
          state: {
            email: email.trim().toLowerCase(),
            otp: enteredOtp,
          },
        });
      }, 1000);

    } catch (err) {
      console.error("Verification error:", err);
      const msg = err.response?.data?.message || "Invalid or expired reset code.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;

    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    try {
      setResending(true);
      setErrorMsg("");
      setSuccessMsg("");

      const response = await axios.post(`${API_BASE}/forgot-password`, {
        email: email.trim().toLowerCase(),
      });

      setSuccessMsg(response.data.message || "A new reset code has been sent!");
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

    } catch (err) {
      console.error("Resend error:", err);
      const msg = err.response?.data?.message || "Unable to resend reset code. Try again later.";
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

        <div className="auth-brand-logo">
          PG
        </div>

        <h1 className="auth-title">Verify Reset Code</h1>

        <p className="auth-desc">
          Enter the 6-digit code sent to
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

        {errorMsg && <div className="auth-alert auth-alert-error">{errorMsg}</div>}
        {successMsg && <div className="auth-alert auth-alert-success">{successMsg}</div>}

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

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={loading || otp.join("").length !== 6}
          >
            {loading ? "Verifying..." : "Verify & Continue →"}
          </button>
        </form>

        <div className="resend-section">
          <span>Didn't receive code?</span>
          {canResend ? (
            <button
              type="button"
              className="resend-btn"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? "Sending..." : "Resend Code"}
            </button>
          ) : (
            <span className="countdown-badge">
              Resend in {countdown}s
            </span>
          )}
        </div>

        <div className="auth-back-link">
          <button type="button" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default VerifyResetOTP;
