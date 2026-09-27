import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const googleBtnRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState(location.state?.message || "");

  useEffect(() => {
    if (location.state?.message) {
      setInfoMessage(location.state.message);
    }
  }, [location.state]);

  const handleGoogleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Google authentication failed");
        return;
      }

      // Save JWT token
      localStorage.setItem("prepgoToken", data.token);

      // Save logged-in user
      localStorage.setItem("prepgoUser", JSON.stringify(data.user));

      alert("Login successful!");
      navigate("/home");
    } catch (error) {
      console.error("Google authentication error:", error);
      alert("Unable to connect to PrepGo server for Google authentication.");
    } finally {
      setLoading(false);
    }
  };

  const [googleClientId, setGoogleClientId] = useState(
    import.meta.env.VITE_GOOGLE_CLIENT_ID || ""
  );
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  // Fetch client ID from backend if not in frontend env
  useEffect(() => {
    const fetchClientId = async () => {
      if (googleClientId && googleClientId !== "your_google_client_id") return;
      try {
        const res = await fetch("http://localhost:5000/api/auth/google-client-id");
        const data = await res.json();
        if (data.clientId) {
          setGoogleClientId(data.clientId);
        }
      } catch (err) {
        console.warn("Could not fetch Google Client ID from backend:", err);
      }
    };
    fetchClientId();
  }, []);

  useEffect(() => {
    if (!googleClientId || googleClientId === "your_google_client_id") {
      return;
    }

    const initGIS = () => {
      if (!window.google?.accounts?.id) return;
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            type: "standard",
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "left",
            width: 380,
          });
          setIsGoogleReady(true);
        }
      } catch (err) {
        console.warn("Google Identity Services initialization warning:", err);
      }
    };

    if (window.google?.accounts?.id) {
      initGIS();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGIS();
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [googleClientId]);

  const handleCustomGoogleClick = () => {
    if (!googleClientId || googleClientId === "your_google_client_id") {
      alert(
        "Google Sign-In requires GOOGLE_CLIENT_ID in your .env file.\n" +
        "Please provide a valid client ID to continue with Google."
      );
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 || data.isVerified === false) {
          const shouldVerify = window.confirm(
            (data.message || "Please verify your email before logging in.") +
            "\n\nClick OK to verify your email now."
          );
          if (shouldVerify) {
            navigate("/verify-email", { state: { email } });
          }
          return;
        }

        alert(data.message || "Login failed");
        return;
      }

      // Save JWT token
      localStorage.setItem("prepgoToken", data.token);

      // Save logged-in user
      localStorage.setItem(
        "prepgoUser",
        JSON.stringify(data.user)
      );

      alert("Login successful!");

      // Navigate to PrepGo Home page
      navigate("/home");

    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Unable to connect to PrepGo server. " +
        "Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ================= LEFT SIDE ================= */}

      <div className="login-left">

        {/* Logo */}

        <div className="brand">

          <div className="brand-icon">
            PG
          </div>

          <span>PrepGo</span>

        </div>


        {/* Hero */}

        <div className="hero-content">

          <h1>
            Prepare Smarter.
            <br />

            <span>
              Grow Faster.
            </span>
          </h1>

          <p>
            Practice interviews, improve your skills and
            discover opportunities with PrepGo.
          </p>

        </div>

      </div>


      {/* ================= RIGHT SIDE ================= */}

      <div className="login-right">

        <div className="login-card">

          <h2>
            Welcome Back 👋
          </h2>

          <p className="subtitle">
            Login to continue your learning journey.
          </p>

          {infoMessage && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#16a34a",
                padding: "10px 14px",
                borderRadius: "10px",
                marginBottom: "18px",
                fontSize: "13.5px",
                fontWeight: "500",
                textAlign: "left",
              }}
            >
              ✓ {infoMessage}
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}

          <form onSubmit={handleLogin}>

            {/* Email */}

            <div className="input-group">

              <label>
                Email Address
              </label>

              <div className="input-box">

                <span>
                  ✉
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />

              </div>

            </div>


            {/* Password */}

            <div className="input-group">

              <label>
                Password
              </label>

              <div className="input-box">

                <span>
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            {/* Remember + Forgot */}

            <div className="login-options">

              <label>

                <input
                  type="checkbox"
                />

                Remember me

              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  navigate("/forgot-password")
                }
              >
                Forgot Password?
              </button>

            </div>


            {/* Login */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login →"}
            </button>

          </form>


          {/* ================= DIVIDER ================= */}

          <div className="divider">

            <span>
              OR
            </span>

          </div>


          {/* ================= GOOGLE ================= */}

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "48px",
            }}
          >
            <div
              ref={googleBtnRef}
              style={{
                width: "100%",
                display: isGoogleReady ? "flex" : "none",
                justifyContent: "center",
              }}
            />

            {!isGoogleReady && (
              <button
                type="button"
                className="google-button"
                onClick={handleCustomGoogleClick}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                Continue with Google
              </button>
            )}
          </div>


          {/* ================= REGISTER ================= */}

          <p className="register-text">

            Don't have an account?

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
            >
              Create Account
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
