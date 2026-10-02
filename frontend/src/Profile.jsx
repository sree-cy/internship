import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const API_BASE = "http://localhost:5000/api/auth";

function Profile() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // User & Form state
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    targetRole: "",
    skillLevel: "Beginner",
    preferredLanguage: "Python",
  });

  // Load existing profile from backend or localStorage
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("prepgoToken");
      const localUserStr = localStorage.getItem("prepgoUser");
      let localUser = null;

      if (localUserStr) {
        try {
          localUser = JSON.parse(localUserStr);
        } catch (e) {
          console.error("Error parsing local user:", e);
        }
      }

      if (!token) {
        // Not authenticated, redirect to login
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUserProfile(data.user);
            setFormData({
              name: data.user.name || "",
              email: data.user.email || "",
              phone: data.user.phone || "",
              education: data.user.education || "",
              targetRole: data.user.targetRole || "",
              skillLevel: data.user.skillLevel || "Beginner",
              preferredLanguage: data.user.preferredLanguage || "Python",
            });

            // Keep localStorage updated with fresh data
            localStorage.setItem("prepgoUser", JSON.stringify({
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              phone: data.user.phone,
              education: data.user.education,
              targetRole: data.user.targetRole,
              skillLevel: data.user.skillLevel,
              preferredLanguage: data.user.preferredLanguage,
              authProvider: data.user.authProvider,
            }));
            return;
          }
        }

        // Fallback to local user if API fails or server warm-up
        if (localUser) {
          setUserProfile(localUser);
          setFormData({
            name: localUser.name || "",
            email: localUser.email || "",
            phone: localUser.phone || "",
            education: localUser.education || "",
            targetRole: localUser.targetRole || "",
            skillLevel: localUser.skillLevel || "Beginner",
            preferredLanguage: localUser.preferredLanguage || "Python",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        if (localUser) {
          setUserProfile(localUser);
          setFormData({
            name: localUser.name || "",
            email: localUser.email || "",
            phone: localUser.phone || "",
            education: localUser.education || "",
            targetRole: localUser.targetRole || "",
            skillLevel: localUser.skillLevel || "Beginner",
            preferredLanguage: localUser.preferredLanguage || "Python",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMsg("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMsg("Full Name is required.");
      return;
    }

    const token = localStorage.getItem("prepgoToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          education: formData.education.trim(),
          targetRole: formData.targetRole.trim(),
          skillLevel: formData.skillLevel,
          preferredLanguage: formData.preferredLanguage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Unable to update profile. Please try again.");
        return;
      }

      setSuccessMsg(data.message || "✓ Profile updated successfully.");
      if (data.user) {
        setUserProfile(data.user);

        // Update localStorage so dashboard shows updated name immediately
        localStorage.setItem(
          "prepgoUser",
          JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            education: data.user.education,
            targetRole: data.user.targetRole,
            skillLevel: data.user.skillLevel,
            preferredLanguage: data.user.preferredLanguage,
            authProvider: data.user.authProvider,
          })
        );
      }

      // Auto-hide success message after 4s
      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);

    } catch (err) {
      console.error("Save profile error:", err);
      setErrorMsg("Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("prepgoToken");
    localStorage.removeItem("prepgoUser");
    navigate("/login");
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    const nameInput = document.getElementById("profile-name-input");
    nameInput?.focus();
  };

  // Helper for initials
  const getInitials = (name) => {
    if (!name) return "PG";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (loading) {
    return (
      <div className="profile-page-wrapper">
        <header className="profile-navbar">
          <div className="profile-navbar-inner">
            <div className="profile-brand" onClick={() => navigate("/home")}>
              <div className="profile-brand-logo">PG</div>
              <div className="profile-brand-text">
                <span className="profile-brand-title">PrepGo</span>
                <span className="profile-brand-tagline">Where Practice Meets Opportunity</span>
              </div>
            </div>
            <button type="button" className="profile-nav-back-btn" onClick={() => navigate("/home")}>
              ← Back to Dashboard
            </button>
          </div>
        </header>

        <div className="profile-loading-container">
          <div className="profile-spinner"></div>
          <p>Loading profile information...</p>
        </div>
      </div>
    );
  }

  const displayName = formData.name || userProfile?.name || "Candidate";
  const displayEmail = formData.email || userProfile?.email || "user@example.com";
  const authProvider = userProfile?.authProvider || (userProfile?.googleId ? "Google" : "Email");
  const memberSince = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Active Member";

  return (
    <div className="profile-page-wrapper">
      {/* ================= HEADER ================= */}
      <header className="profile-navbar">
        <div className="profile-navbar-inner">
          <div className="profile-brand" onClick={() => navigate("/home")}>
            <div className="profile-brand-logo">PG</div>
            <div className="profile-brand-text">
              <span className="profile-brand-title">PrepGo</span>
              <span className="profile-brand-tagline">Where Practice Meets Opportunity</span>
            </div>
          </div>

          <div className="profile-nav-actions">
            <button
              type="button"
              className="profile-nav-back-btn"
              onClick={() => navigate("/progress")}
            >
              📊 Progress
            </button>
            <button
              type="button"
              className="profile-nav-back-btn"
              onClick={() => navigate("/reports")}
            >
              📑 Reports
            </button>
            <button
              type="button"
              className="profile-nav-back-btn"
              onClick={() => navigate("/achievements")}
            >
              🏆 Achievements
            </button>
            <button
              type="button"
              className="profile-nav-back-btn"
              onClick={() => navigate("/home")}
            >
              ← Dashboard
            </button>

            <button
              type="button"
              className="profile-nav-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="profile-main-content">
        {/* Page Title & Subtitle */}
        <div className="profile-header-section">
          <span className="profile-page-tag">PREPGO CANDIDATE</span>
          <h1 className="profile-page-title">PROFILE &amp; SETTINGS</h1>
          <p className="profile-page-subtitle">
            Manage your personal information and interview preparation preferences.
          </p>
        </div>

        {/* Global Feedback Notifications */}
        {successMsg && (
          <div className="profile-alert profile-alert-success">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="profile-alert profile-alert-error">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} ref={formRef}>
          {/* Top Row: Section 1 Summary & Section 2 Personal Info */}
          <div className="profile-top-grid">
            {/* ================= SECTION 1: PROFILE SUMMARY ================= */}
            <div className="profile-card profile-summary-card">
              <div className="summary-avatar-wrap">
                {userProfile?.profileImage ? (
                  <img
                    src={userProfile.profileImage}
                    alt={displayName}
                    className="summary-avatar-img"
                  />
                ) : (
                  <div className="summary-avatar-initials">
                    {getInitials(displayName)}
                  </div>
                )}
              </div>

              <h2 className="summary-user-name">{displayName}</h2>
              <p className="summary-user-email">{displayEmail}</p>

              <div className="summary-role-badge">
                <span className="role-badge-dot"></span>
                Interview Candidate
              </div>

              <button
                type="button"
                className="summary-edit-btn"
                onClick={scrollToForm}
              >
                Edit Profile
              </button>
            </div>

            {/* ================= SECTION 2: PERSONAL INFORMATION ================= */}
            <div className="profile-card profile-form-card">
              <div className="card-header-row">
                <div className="card-header-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="card-section-title">Personal Information</h3>
                  <p className="card-section-desc">Update your core identity details for recruitment assessments.</p>
                </div>
              </div>

              <div className="profile-input-group">
                <label htmlFor="profile-name-input">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  id="profile-name-input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. K Srinivas"
                  className="profile-input-field"
                  required
                />
              </div>

              <div className="profile-input-group">
                <div className="label-with-badge">
                  <label htmlFor="profile-email-input">Email Address</label>
                  <span className="readonly-badge">✓ Verified (Read-only)</span>
                </div>
                <input
                  id="profile-email-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="profile-input-field readonly"
                  title="Email cannot be changed directly to protect your authentication security."
                />
                <span className="field-hint">
                  Your email is linked to your verified PrepGo login and cannot be altered.
                </span>
              </div>

              <div className="profile-input-group">
                <label htmlFor="profile-phone-input">Phone Number</label>
                <input
                  id="profile-phone-input"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="profile-input-field"
                />
              </div>
            </div>
          </div>

          {/* ================= SECTION 3: INTERVIEW PROFILE ================= */}
          <div className="profile-card profile-interview-card">
            <div className="card-header-row">
              <div className="card-header-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
              </div>
              <div>
                <h3 className="card-section-title">Interview Profile</h3>
                <p className="card-section-desc">Tailor your interview preparation and programming preferences.</p>
              </div>
            </div>

            <div className="interview-fields-grid">
              <div className="profile-input-group">
                <label htmlFor="profile-education-input">Education / Degree</label>
                <input
                  id="profile-education-input"
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech Computer Science"
                  className="profile-input-field"
                />
              </div>

              <div className="profile-input-group">
                <label htmlFor="profile-role-input">Target Role</label>
                <input
                  id="profile-role-input"
                  type="text"
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  placeholder="e.g. Software Developer"
                  className="profile-input-field"
                />
              </div>

              <div className="profile-input-group">
                <label htmlFor="profile-skill-select">Skill Level</label>
                <select
                  id="profile-skill-select"
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleChange}
                  className="profile-select-field"
                >
                  <option value="Beginner">Beginner (Foundational)</option>
                  <option value="Intermediate">Intermediate (Practicing)</option>
                  <option value="Advanced">Advanced (Placement-Ready)</option>
                </select>
              </div>

              <div className="profile-input-group">
                <label htmlFor="profile-lang-select">Preferred Programming Language</label>
                <select
                  id="profile-lang-select"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="profile-select-field"
                >
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                  <option value="C">C</option>
                  <option value="JavaScript">JavaScript</option>
                </select>
              </div>
            </div>

            {/* Form Save Button */}
            <div className="form-action-row">
              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>

        {/* Bottom Row: Section 4 Account Info & Section 5 Account Actions */}
        <div className="profile-bottom-grid">
          {/* ================= SECTION 4: ACCOUNT INFORMATION ================= */}
          <div className="profile-card">
            <div className="card-header-row">
              <div className="card-header-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div>
                <h3 className="card-section-title">Account Information</h3>
                <p className="card-section-desc">Active security &amp; login credentials overview.</p>
              </div>
            </div>

            <div className="account-info-list">
              <div className="account-info-item">
                <span className="account-info-label">Email Verification:</span>
                <span className="account-info-badge verified">
                  ✓ Verified
                </span>
              </div>

              <div className="account-info-item">
                <span className="account-info-label">Authentication Method:</span>
                <span className="account-info-badge provider">
                  {authProvider === "Google" ? "Google Account" : "Email & Password"}
                </span>
              </div>

              <div className="account-info-item">
                <span className="account-info-label">Member Since:</span>
                <span className="account-info-value">{memberSince}</span>
              </div>
            </div>
          </div>

          {/* ================= SECTION 5: ACCOUNT ACTIONS ================= */}
          <div className="profile-card">
            <div className="card-header-row">
              <div className="card-header-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              <div>
                <h3 className="card-section-title">Account Security</h3>
                <p className="card-section-desc">Manage your password and active session.</p>
              </div>
            </div>

            <div className="account-actions-list">
              {authProvider !== "Google" ? (
                <div className="action-item-box">
                  <div className="action-item-info">
                    <h4>Change Password</h4>
                    <p>Receive a verification code to safely update your account password.</p>
                  </div>
                  <button
                    type="button"
                    className="action-btn-secondary"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Reset Password
                  </button>
                </div>
              ) : (
                <div className="action-item-box">
                  <div className="action-item-info">
                    <h4>Google Managed Account</h4>
                    <p>Your password is secure and managed through your linked Google profile.</p>
                  </div>
                </div>
              )}

              <div className="action-item-box logout-item">
                <div className="action-item-info">
                  <h4>Session Logout</h4>
                  <p>Log out of your current device session on PrepGo.</p>
                </div>
                <button
                  type="button"
                  className="action-btn-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="profile-footer">
        <span>© {new Date().getFullYear()} PrepGo. All rights reserved. Where Practice Meets Opportunity.</span>
      </footer>
    </div>
  );
}

export default Profile;
