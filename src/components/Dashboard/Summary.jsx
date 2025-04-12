// src/components/Dashboard/Summary.jsx
import React from "react";
import { EMAIL_CATEGORIES } from "../Classification/Categories";

const Summary = ({ emails, setFilter }) => {
  // Count emails by category
  const categoryCounts = Object.values(EMAIL_CATEGORIES).reduce(
    (acc, category) => {
      acc[category] = 0;
      return acc;
    },
    {}
  );

  emails.forEach((email) => {
    categoryCounts[email.category] = (categoryCounts[email.category] || 0) + 1;
  });

  // Colors for categories
  const categoryColors = {
    "Application Submitted": "#4F46E5",
    "Interview Request": "#059669",
    Rejection: "#DC2626",
    "Assessment Request": "#D97706",
    Offer: "#7C3AED",
    "Follow Up": "#2563EB",
    "Job Alert": "#0891B2",
    Other: "#6B7280",
  };

  // Group categories by status
  const categoryGroups = [
    {
      title: "Active Applications",
      categories: [
        EMAIL_CATEGORIES.APPLICATION_SUBMITTED,
        EMAIL_CATEGORIES.INTERVIEW_REQUEST,
        EMAIL_CATEGORIES.ASSESSMENT,
        EMAIL_CATEGORIES.FOLLOW_UP,
      ],
    },
    {
      title: "Completed Applications",
      categories: [EMAIL_CATEGORIES.REJECTION, EMAIL_CATEGORIES.OFFER],
    },
    {
      title: "Job Opportunities",
      categories: [EMAIL_CATEGORIES.JOB_ALERT, EMAIL_CATEGORIES.OTHER],
    },
  ];

  // Format date range for title
  const formatDateRange = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const formatDate = (date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };

    return `${formatDate(thirtyDaysAgo)} - ${formatDate(today)}`;
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "1.5rem",
          borderBottom: "1px solid #E5E7EB",
          flexShrink: 0,
        }}
      >
        <h2
          style={{ fontSize: "1.125rem", fontWeight: "500", color: "#111827" }}
        >
          Applications Summary
        </h2>
        <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
          {formatDateRange()}
        </p>

        <div style={{ marginTop: "0.5rem" }}>
          <div
            style={{
              fontSize: "1.875rem",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            {emails.length}
          </div>
          <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            Total job-related emails
          </div>
        </div>
      </div>

      <div style={{ padding: "1.5rem", flexShrink: 0 }}>
        {Object.keys(categoryCounts).some((key) => categoryCounts[key] > 0) ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {Object.entries(categoryCounts)
              .filter(([_, count]) => count > 0)
              .map(([category, count]) => (
                <div
                  key={category}
                  style={{
                    padding: "0.5rem 0.75rem",
                    backgroundColor: `${categoryColors[category]}20`,
                    color: categoryColors[category],
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  {category}: {count}
                </div>
              ))}
          </div>
        ) : (
          <div
            style={{ textAlign: "center", padding: "2rem 0", color: "#6B7280" }}
          >
            <svg
              style={{
                width: "3rem",
                height: "3rem",
                margin: "0 auto",
                color: "#9CA3AF",
              }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p style={{ marginTop: "0.5rem" }}>
              No job application emails found
            </p>
          </div>
        )}
      </div>

      {/* Filter by category */}
      <div
        style={{
          padding: "1rem 1.5rem",
          flexShrink: 0,
          borderTop: "1px solid #E5E7EB",
        }}
      >
        <h3
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#111827",
            marginBottom: "0.75rem",
          }}
        >
          Filter by Status
        </h3>

        <div>
          <button
            onClick={() => setFilter("all")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "0.5rem 1rem",
              textAlign: "left",
              borderRadius: "0.375rem",
              marginBottom: "0.25rem",
              border: "none",
              backgroundColor: "#F3F4F6",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "0.75rem",
                  height: "0.75rem",
                  borderRadius: "9999px",
                  backgroundColor: "#4F46E5",
                  marginRight: "0.75rem",
                }}
              ></div>
              <span style={{ fontWeight: "500" }}>All Emails</span>
            </div>
            <span
              style={{
                backgroundColor: "#EEF2FF",
                color: "#4F46E5",
                fontSize: "0.75rem",
                fontWeight: "500",
                padding: "0.125rem 0.625rem",
                borderRadius: "9999px",
              }}
            >
              {emails.length}
            </span>
          </button>
        </div>
      </div>

      <div style={{ padding: "0 1.5rem", flexGrow: 1, overflowY: "auto" }}>
        {categoryGroups.map((group) => (
          <div key={group.title} style={{ marginBottom: "1rem" }}>
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#6B7280",
                marginBottom: "0.5rem",
              }}
            >
              {group.title}
            </h4>
            <div>
              {group.categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "0.5rem 1rem",
                    textAlign: "left",
                    borderRadius: "0.375rem",
                    marginBottom: "0.25rem",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    fontSize: "0.875rem",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#F3F4F6")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "0.75rem",
                        height: "0.75rem",
                        borderRadius: "9999px",
                        backgroundColor: categoryColors[category] || "#6B7280",
                        marginRight: "0.75rem",
                      }}
                    ></div>
                    <span>{category}</span>
                  </div>
                  <span
                    style={{
                      backgroundColor: "#F3F4F6",
                      color:
                        categoryCounts[category] > 0 ? "#111827" : "#9CA3AF",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      padding: "0.125rem 0.625rem",
                      borderRadius: "9999px",
                    }}
                  >
                    {categoryCounts[category] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
