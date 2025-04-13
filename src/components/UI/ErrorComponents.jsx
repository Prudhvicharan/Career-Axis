// src/components/UI/ErrorComponents.jsx
import React from "react";

export const ApiErrorMessage = ({ error, onRetry }) => {
  return (
    <div
      style={{
        backgroundColor: "#FEF2F2",
        borderRadius: "0.5rem",
        padding: "1.5rem",
        margin: "1rem",
        border: "1px solid #FCA5A5",
        color: "#7F1D1D",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            marginRight: "1rem",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            Error connecting to Gmail
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              marginBottom: "1rem",
            }}
          >
            {error ||
              "We're having trouble accessing your emails. This might be due to connectivity issues or Gmail API limitations."}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                backgroundColor: "#DC2626",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const EmptyStateView = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "3rem 1rem",
        maxWidth: "32rem",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        {icon || (
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: "600",
          color: "#111827",
          marginBottom: "0.5rem",
        }}
      >
        {title || "No emails found"}
      </h3>
      <p
        style={{
          fontSize: "0.875rem",
          color: "#6B7280",
          marginBottom: "1.5rem",
        }}
      >
        {description ||
          "We couldn't find any job-related emails in your inbox."}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          style={{
            backgroundColor: "#4F46E5",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
