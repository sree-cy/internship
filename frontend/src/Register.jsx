import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert(
        data.message ||
        "Registration successful! Please enter the OTP sent to your email to verify your account."
      );

      navigate("/verify-email", {
        state: { email },
      });

    } catch (error) {
      console.error("Registration error:", error);

      alert(
        "Unable to connect to PrepGo server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <div className="register-logo">
          PG
        </div>

        <h1>
          Create Account
        </h1>

        <p className="register-subtitle">
          Start your PrepGo journey today.
        </p>

        <form onSubmit={handleRegister}>

          <div className="input-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
            />

          </div>

          <div className="input-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            />

          </div>

          <div className="input-group">

            <label>
              Password
            </label>

            <div className="password-box">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Create a password"
                required
              />

              <button
                type="button"
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

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account →"}
          </button>

        </form>

        <div className="register-divider">
          <span>OR</span>
        </div>

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

        <p className="login-link">

          Already have an account?

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>

        </p>

      </div>

    </div>
  );
}

export default Register;
