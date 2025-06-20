// src/App.jsx
import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";

// Your Google Client ID from Google Cloud Console
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Check for stored token on load with improved token validation
  useEffect(() => {
    const validateToken = async (token) => {
      try {
        // Simple token validation by making a request to userinfo endpoint
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // If token is valid, we get a 200 response
        return response.ok;
      } catch (error) {
        console.error("Token validation error:", error);
        return false;
      }
    };

    const initializeAuth = async () => {
      // Try to load token from storage if it exists
      try {
        const storedToken = localStorage.getItem("gmailAccessToken");
        if (storedToken) {
          const tokenData = JSON.parse(storedToken);

          // Check if token is expired
          if (
            tokenData.expiresAt &&
            new Date(tokenData.expiresAt) > new Date()
          ) {
            // Validate the token
            const isValid = await validateToken(tokenData.token);

            if (isValid) {
              setAccessToken(tokenData.token);
            } else {
              // Token is invalid - clear it
              localStorage.removeItem("gmailAccessToken");
              setAuthError("Your session has expired. Please sign in again.");
            }
          } else {
            // Token expired
            localStorage.removeItem("gmailAccessToken");
            setAuthError("Your session has expired. Please sign in again.");
          }
        }
      } catch (e) {
        // Invalid token format or other error
        localStorage.removeItem("gmailAccessToken");
        setAuthError(
          "Error initializing authentication. Please sign in again."
        );
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
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
    setAuthError(null);
  };

  const handleAuthError = (error) => {
    console.error("Authentication error:", error);
    setAuthError(
      error.message || "Authentication failed. Please sign in again."
    );
    handleLogout();
  };

  if (initializing) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "50%",
            border: "4px solid rgba(79, 70, 229, 0.2)",
            borderTopColor: "#4F46E5",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p style={{ marginTop: "1rem", color: "#6B7280" }}>
          Initializing app...
        </p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#F9FAFB",
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
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
