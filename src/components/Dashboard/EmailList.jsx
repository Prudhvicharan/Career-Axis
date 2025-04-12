// src/components/Dashboard/EmailList.jsx
import React, { useState } from "react";

const EmailList = ({ emails, selectedEmail, setSelectedEmail }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter emails by search term
  const filteredEmails = emails.filter(
    (email) =>
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group emails by date
  const groupedEmails = filteredEmails.reduce((groups, email) => {
    const date = new Date(email.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateGroup;

    if (date.toDateString() === today.toDateString()) {
      dateGroup = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateGroup = "Yesterday";
    } else {
      dateGroup = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }

    groups[dateGroup].push(email);
    return groups;
  }, {});

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get category badge styles
  const getCategoryBadgeStyles = (category) => {
    switch (category) {
      case "Application Submitted":
        return { backgroundColor: "#EEF2FF", color: "#4F46E5" };
      case "Interview Request":
        return { backgroundColor: "#ECFDF5", color: "#059669" };
      case "Rejection":
        return { backgroundColor: "#FEF2F2", color: "#DC2626" };
      case "Assessment Request":
        return { backgroundColor: "#FFFBEB", color: "#D97706" };
      case "Offer":
        return { backgroundColor: "#F5F3FF", color: "#7C3AED" };
      case "Follow Up":
        return { backgroundColor: "#DBEAFE", color: "#2563EB" };
      case "Job Alert":
        return { backgroundColor: "#ECFEFF", color: "#0891B2" };
      default:
        return { backgroundColor: "#F3F4F6", color: "#6B7280" };
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid #E5E7EB",
          flexShrink: 0,
        }}
      >
        <div style={{ position: "relative", borderRadius: "0.375rem" }}>
          <div
            style={{
              position: "absolute",
              inset: "0 auto 0 0",
              paddingLeft: "0.75rem",
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <svg
              style={{ height: "1.25rem", width: "1.25rem", color: "#9CA3AF" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search emails..."
            style={{
              width: "100%",
              paddingLeft: "2.5rem",
              paddingRight: "0.75rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              borderRadius: "0.375rem",
              border: "1px solid #D1D5DB",
              backgroundColor: "white",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              outline: "none",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "0.75rem",
          }}
        >
          <h2
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            {filteredEmails.length}{" "}
            {filteredEmails.length === 1 ? "email" : "emails"}
          </h2>
        </div>
      </div>

      <div
        style={{ flex: 1, overflowY: "auto", borderTop: "1px solid #E5E7EB" }}
      >
        {filteredEmails.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              padding: "3rem 1rem",
            }}
          >
            <svg
              style={{ height: "3rem", width: "3rem", color: "#9CA3AF" }}
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
            <h3
              style={{
                marginTop: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#111827",
              }}
            >
              No emails found
            </h3>
            <p
              style={{
                marginTop: "0.25rem",
                fontSize: "0.875rem",
                color: "#6B7280",
              }}
            >
              {searchTerm
                ? "Try adjusting your search terms."
                : "No job application emails in this category."}
            </p>
          </div>
        ) : (
          Object.entries(groupedEmails).map(([date, dateEmails]) => (
            <div key={date}>
              <div
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#F9FAFB",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {date}
                </h3>
              </div>

              <div>
                {dateEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    style={{
                      padding: "0.75rem 1rem",
                      cursor: "pointer",
                      transition: "background-color 0.15s",
                      backgroundColor:
                        selectedEmail?.id === email.id ? "#EEF2FF" : "white",
                      borderLeft:
                        selectedEmail?.id === email.id
                          ? "4px solid #4F46E5"
                          : "4px solid transparent",
                      borderBottom: "1px solid #E5E7EB",
                    }}
                    onMouseOver={(e) => {
                      if (selectedEmail?.id !== email.id) {
                        e.currentTarget.style.backgroundColor = "#F9FAFB";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedEmail?.id !== email.id) {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            flexShrink: 0,
                            height: "2.5rem",
                            width: "2.5rem",
                            borderRadius: "9999px",
                            background:
                              "linear-gradient(135deg, #4F46E5, #7C3AED)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "500",
                          }}
                        >
                          {email.company.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <h4
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: "500",
                              color: "#111827",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "16rem",
                            }}
                          >
                            {email.company}
                          </h4>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "#6B7280",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "16rem",
                            }}
                          >
                            {email.from.split("<")[0].trim()}
                          </p>
                        </div>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                        {formatTime(email.date)}
                      </span>
                    </div>

                    <h3
                      style={{
                        marginTop: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#111827",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {email.subject}
                    </h3>

                    <p
                      style={{
                        marginTop: "0.25rem",
                        fontSize: "0.75rem",
                        color: "#6B7280",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {email.snippet}
                    </p>

                    <div style={{ marginTop: "0.5rem" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0.125rem 0.625rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          ...getCategoryBadgeStyles(email.category),
                        }}
                      >
                        {email.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmailList;
