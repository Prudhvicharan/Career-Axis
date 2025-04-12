import React from "react";

const EmailDetail = ({ email }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Get category badge styles
  const getCategoryBadgeStyles = (category) => {
    switch (category) {
      case "Application Submitted":
        return {
          backgroundColor: "#EEF2FF",
          color: "#4F46E5",
          borderColor: "#E0E7FF",
        };
      case "Interview Request":
        return {
          backgroundColor: "#ECFDF5",
          color: "#059669",
          borderColor: "#D1FAE5",
        };
      case "Rejection":
        return {
          backgroundColor: "#FEF2F2",
          color: "#DC2626",
          borderColor: "#FEE2E2",
        };
      case "Assessment Request":
        return {
          backgroundColor: "#FFFBEB",
          color: "#D97706",
          borderColor: "#FEF3C7",
        };
      case "Offer":
        return {
          backgroundColor: "#F5F3FF",
          color: "#7C3AED",
          borderColor: "#EDE9FE",
        };
      case "Follow Up":
        return {
          backgroundColor: "#DBEAFE",
          color: "#2563EB",
          borderColor: "#BFDBFE",
        };
      case "Job Alert":
        return {
          backgroundColor: "#ECFEFF",
          color: "#0891B2",
          borderColor: "#CFFAFE",
        };
      default:
        return {
          backgroundColor: "#F3F4F6",
          color: "#6B7280",
          borderColor: "#E5E7EB",
        };
    }
  };

  // Get action button based on category
  const getActionButton = (category) => {
    let buttonStyle = {
      borderRadius: "0.375rem",
      padding: "0.5rem 0.875rem",
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "white",
      border: "none",
      cursor: "pointer",
    };

    switch (category) {
      case "Application Submitted":
        return (
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#4F46E5",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            Track Application
          </button>
        );
      case "Interview Request":
        return (
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#059669",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            Schedule Interview
          </button>
        );
      case "Rejection":
        return (
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#6B7280",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            Archive
          </button>
        );
      case "Assessment Request":
        return (
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#D97706",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            Start Assessment
          </button>
        );
      case "Offer":
        return (
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#7C3AED",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            Review Offer
          </button>
        );
      case "Follow Up":
        return (
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#2563EB",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            Send Response
          </button>
        );
      case "Job Alert":
        return (
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#0891B2",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            Apply Now
          </button>
        );
      default:
        return (
          <button
            style={{
              ...buttonStyle,
              backgroundColor: "#6B7280",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            View Email
          </button>
        );
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Email header */}
      <div
        style={{
          padding: "1.5rem",
          borderBottom: "1px solid #E5E7EB",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#111827",
                marginBottom: "0.25rem",
              }}
            >
              {email.subject}
            </h1>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.125rem 0.625rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  border: "1px solid",
                  ...getCategoryBadgeStyles(email.category),
                }}
              >
                {email.category}
              </span>
              <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>•</span>
              <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                {email.company}
              </span>
            </div>
          </div>

          <div>
            <a
              href={email.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#4F46E5",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                textDecoration: "none",
              }}
            >
              <svg
                style={{ height: "1rem", width: "1rem" }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span>Open in Gmail</span>
            </a>
          </div>
        </div>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              flexShrink: 0,
              height: "2.5rem",
              width: "2.5rem",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "500",
            }}
          >
            {email.company.substring(0, 1).toUpperCase()}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#111827",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {email.from.split("<")[0].trim()}
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6B7280",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {email.from.includes("<")
                ? email.from.split("<")[1].replace(">", "")
                : ""}
            </p>
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#6B7280",
              textAlign: "right",
            }}
          >
            <p>{formatDate(email.date)}</p>
          </div>
        </div>
      </div>

      {/* Email content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
        {/* Email summary */}
        <div
          style={{
            backgroundColor: "#FFFBEB",
            border: "1px solid #FEF3C7",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#92400E",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <svg
              style={{ height: "1rem", width: "1rem" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Summary
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#92400E" }}>
            {email.summary}
          </p>
        </div>

        {/* Email body */}
        <div
          style={{
            fontSize: "0.875rem",
            lineHeight: "1.5",
            color: "#374151",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div style={{ whiteSpace: "pre-wrap" }}>
            {email.body || email.snippet}
          </div>
        </div>
      </div>

      {/* Email actions */}
      <div
        style={{
          padding: "1.5rem",
          borderTop: "1px solid #E5E7EB",
          flexShrink: 0,
          backgroundColor: "#F9FAFB",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {getActionButton(email.category)}

            <button
              style={{
                borderRadius: "0.375rem",
                padding: "0.5rem 0.875rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#111827",
                backgroundColor: "white",
                border: "1px solid #D1D5DB",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                cursor: "pointer",
              }}
            >
              Reply
            </button>
          </div>

          <div>
            <button
              style={{
                color: "#6B7280",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.25rem",
              }}
            >
              <svg
                style={{ height: "1.25rem", width: "1.25rem" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
