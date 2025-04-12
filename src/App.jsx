// src/App.jsx
import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";

// Your Google Client ID from Google Cloud Console
const CLIENT_ID =
  "332215621326-5ej0dluv1gm680lvt7perc1daubb6slj.apps.googleusercontent.com";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Check for stored token on load
  useEffect(() => {
    // Try to load token from storage if it exists
    const storedToken = localStorage.getItem("gmailAccessToken");
    if (storedToken) {
      try {
        const tokenData = JSON.parse(storedToken);
        // Check if token is expired
        if (tokenData.expiresAt && new Date(tokenData.expiresAt) > new Date()) {
          setAccessToken(tokenData.token);
        } else {
          // Token expired
          localStorage.removeItem("gmailAccessToken");
        }
      } catch (e) {
        // Invalid token format
        localStorage.removeItem("gmailAccessToken");
      }
    }
  }, []);

  const handleLoginSuccess = (response) => {
    console.log("Login successful, saving token");
    const token = response.access_token;

    // Save token with expiration
    const expiresIn = response.expires_in || 3600; // Default to 1 hour
    const expiresAt = new Date(new Date().getTime() + expiresIn * 1000);

    localStorage.setItem(
      "gmailAccessToken",
      JSON.stringify({
        token,
        expiresAt: expiresAt.toISOString(),
      })
    );

    setAccessToken(token);
    setAuthError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("gmailAccessToken");
    setAccessToken(null);
  };

  const handleAuthError = (error) => {
    console.error("Authentication error:", error);
    setAuthError(error.message || "Authentication failed");
    handleLogout();
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="min-h-screen bg-gray-50">
        {!accessToken ? (
          <>
            {authError && (
              <div
                style={{
                  backgroundColor: "#FEE2E2",
                  color: "#B91C1C",
                  padding: "0.75rem",
                  margin: "1rem",
                  borderRadius: "0.375rem",
                  textAlign: "center",
                }}
              >
                {authError}
              </div>
            )}
            <Login onLoginSuccess={handleLoginSuccess} />
          </>
        ) : (
          <Dashboard
            accessToken={accessToken}
            onAuthError={handleAuthError}
            onLogout={handleLogout}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
