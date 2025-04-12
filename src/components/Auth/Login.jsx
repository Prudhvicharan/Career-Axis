// src/components/Auth/Login.jsx
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

const Login = ({ onLoginSuccess }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      onLoginSuccess(tokenResponse);
    },
    scope: "https://www.googleapis.com/auth/gmail.readonly",
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">
          Job Application Email Tracker
        </h1>
        <button
          onClick={() => login()}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
