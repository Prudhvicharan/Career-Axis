import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

// --- Helper Components ---

// Logo Icon: You can replace the path with a custom logo that reflects the 'axis' concept.
const LogoIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Abstract logo resembling an axis or compass */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2ZM12 4a8 8 0 110 16 8 8 0 010-16ZM11 7h2v6h-2V7Zm0 8h2v2h-2v-2Z"
    />
  </svg>
);

// Component to display a feature item.
const FeatureItem = ({ icon, text }) => (
  <div className="flex items-center text-sm text-[#414833] mb-2 last:mb-0">
    {icon}
    <span className="ml-2">{text}</span>
  </div>
);

// Icons for features using Heroicons outline style
const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-[#656D4A]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);
const ChartIcon = () => (
  <svg
    className="w-5 h-5 text-[#656D4A]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);
const FolderIcon = () => (
  <svg
    className="w-5 h-5 text-[#656D4A]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);

// Subtle Animated Vector Background Layer
const BackgroundVectors = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <svg width="100%" height="100%" className="absolute inset-0">
      <circle
        cx="10%"
        cy="20%"
        r="50"
        fill="#A4AC86"
        className="opacity-10 animate-pulseSlow"
      />
      <circle
        cx="85%"
        cy="35%"
        r="70"
        fill="#B6AD90"
        className="opacity-10 animate-pulseSlow animation-delay-[-2s]"
      />
      <circle
        cx="30%"
        cy="80%"
        r="40"
        fill="#A4AC86"
        className="opacity-[.08] animate-pulseSlow animation-delay-[-4s]"
      />
      <circle
        cx="60%"
        cy="90%"
        r="60"
        fill="#B6AD90"
        className="opacity-15 animate-pulseSlow animation-delay-[-6s]"
      />
    </svg>
    <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-[#A4AC86]/20 rounded-full animate-spinSlow opacity-50"></div>
    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-[#B6AD90]/20 animate-pulseSlow opacity-60 animation-delay-[-3s]"></div>
  </div>
);

// --- Main Login Component ---

const Login = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login successful, token received");
      setIsLoading(false);
      setErrorMsg(null);
      onLoginSuccess(tokenResponse);
    },
    onError: (error) => {
      console.error("Login failed:", error);
      let friendlyError = "Login failed. Please try again.";
      if (error?.error === "popup_closed_by_user") {
        friendlyError = "Login cancelled.";
      } else if (error?.error === "access_denied") {
        friendlyError = "Access denied. Please grant permission.";
      }
      setErrorMsg(friendlyError);
      setIsLoading(false);
    },
    scope: "https://www.googleapis.com/auth/gmail.readonly",
    flow: "implicit",
    prompt: "consent",
    access_type: "online",
  });

  const handleLoginClick = () => {
    setIsLoading(true);
    setErrorMsg(null);
    login();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#C2C5AA]">
      <BackgroundVectors />
      <div className="relative z-10 bg-white/60 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-full p-8 m-4 animate-fadeIn">
        <div className="flex flex-col items-center mb-6">
          <LogoIcon className="w-16 h-16 mb-4 text-[#656D4A]" />
          <h1 className="text-3xl font-bold text-[#7F4F24] text-center drop-shadow-sm">
            Career Axis
          </h1>
          <p className="text-lg text-[#414833] text-center mt-2">
            Navigate Your Career with Precision
          </p>
          <p className="text-sm text-[#582F0E] text-center mt-1">
            Discover, organize, and accelerate your job search journey.
          </p>
        </div>
        <div className="mb-6 border-t border-b border-[#A4AC86]/50 py-4">
          <FeatureItem
            icon={<FolderIcon />}
            text="Automatically track applications via Gmail."
          />
          <FeatureItem
            icon={<CheckIcon />}
            text="Never miss follow-up deadlines."
          />
          <FeatureItem
            icon={<ChartIcon />}
            text="Visualize your job search progress."
          />
        </div>
        {errorMsg && (
          <p className="text-red-600 text-sm text-center mb-3 animate-pulse">
            {errorMsg}
          </p>
        )}
        <button
          onClick={handleLoginClick}
          disabled={isLoading}
          className={`flex items-center justify-center w-full py-3 px-4 bg-[#7F4F24] hover:bg-[#582F0E] text-white font-semibold rounded-md mb-4 shadow-md transition-all duration-200 ease-in-out ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"
          } group`}
        >
          {isLoading ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5 mr-3 transition-transform duration-200 ease-in-out"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C34.7 36.3 30.4 40 24 40c-8.8 0-16-7.2-16-16S15.2 8 24 8c4.2 0 8 1.6 10.9 4.2l6.4-6.4C35.4 3.3 29.9 1 24 1 11.3 1 1 11.3 1 24s10.3 23 23 23 23-10.3 23-23c0-1.6-.2-3.1-.4-4.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.1 16.2 18 13 23 13c3.9 0 7.3 1.4 10 3.7l7.3-7.1C35.3 5 29.4 3 23 3 13.1 3 4.6 8.7 1.9 16.3l4.4 4.4z"
              />
              <path
                fill="#4CAF50"
                d="M23 46c6.4 0 11.8-2.2 15.8-6.1l-7.4-6.1C29.8 37.1 27 38 23 38c-4.9 0-9.1-3.3-10.6-7.8L4 39.4C7.8 44.9 14.3 46 23 46z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3C34.5 33.6 30 36 23 36c-6.1 0-11.2-3.7-13-8.9l-6.4 5C8.5 41.7 15.7 46 23 46c8.7 0 16-7 16-16 0-1.1-.1-2.1-.4-3.5z"
              />
            </svg>
          )}
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </button>
        <p className="text-xs text-[#414833]/80 text-center drop-shadow-sm">
          We only request read-only access to your Gmail to help track job
          applications. Your data stays private.
        </p>
      </div>
    </div>
  );
};

export default Login;
