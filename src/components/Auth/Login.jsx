// src/components/Auth/Login.jsx
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

const Login = ({ onLoginSuccess }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login successful, token received");
      onLoginSuccess(tokenResponse);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
    scope: "https://www.googleapis.com/auth/gmail.readonly",
    flow: "implicit", // Try this if you're having issues
  });

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      <div className="card p-8" style={{ maxWidth: "400px" }}>
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#111827",
            }}
          >
            Job Application Tracker
          </h1>
          <p style={{ color: "#6B7280", marginBottom: "2rem" }}>
            Organize your job search and never miss an opportunity
          </p>
        </div>

        <button
          onClick={() => login()}
          className="btn-primary"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0.75rem",
          }}
        >
          Sign in with Google
        </button>

        <p
          style={{
            fontSize: "0.75rem",
            color: "#6B7280",
            marginTop: "1.5rem",
            textAlign: "center",
          }}
        >
          We only access your emails to help you track job applications.
          <br />
          Your data remains private and is stored only on your device.
        </p>
      </div>
    </div>
  );
};

export default Login;
