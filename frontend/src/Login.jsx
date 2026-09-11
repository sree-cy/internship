import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
                  alert("Forgot password feature coming soon.")
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

          <button
            type="button"
            className="google-button"
            onClick={() =>
              alert(
                "Google login will be connected later."
              )
            }
          >

            <span>
              G
            </span>

            Continue with Google

          </button>


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
