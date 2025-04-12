// src/App.jsx
import React, { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";

// Your Google Client ID from Google Cloud Console
const CLIENT_ID =
  "332215621326-5ej0dluv1gm680lvt7perc1daubb6slj.apps.googleusercontent.com";

function App() {
  const [accessToken, setAccessToken] = useState(null);

  const handleLoginSuccess = (response) => {
    setAccessToken(response.access_token);
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="min-h-screen bg-gray-50">
        {!accessToken ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <Dashboard accessToken={accessToken} />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
