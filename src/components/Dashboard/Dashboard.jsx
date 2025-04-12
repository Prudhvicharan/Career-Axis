// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { fetchEmails } from "../../services/gmailApi";
import {
  classifyEmail,
  extractCompanyName,
} from "../Classification/EmailClassifier";
import {
  saveProcessedEmails,
  getProcessedEmails,
} from "../../services/storageService";
import { summarizeEmail } from "../../services/summarizationService";
import Summary from "./Summary";
import EmailList from "./EmailList";
import EmailDetail from "./EmailDetail";

const Dashboard = ({ accessToken, onLogout }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const loadEmails = async () => {
      try {
        // Try to load from localStorage first
        const storedEmails = getProcessedEmails();

        if (storedEmails.length > 0) {
          setEmails(storedEmails);
          setLoading(false);
        }

        // Fetch fresh data from Gmail API
        const fetchedEmails = await fetchEmails(accessToken);

        // Process and classify each email
        const processedEmails = fetchedEmails.map((email) => ({
          ...email,
          category: classifyEmail(email),
          company: extractCompanyName(email),
          summary: summarizeEmail(email.body),
        }));

        // Save to localStorage and update state
        saveProcessedEmails(processedEmails);
        setEmails(processedEmails);
        setLoading(false);
      } catch (error) {
        console.error("Error loading emails:", error);
        setLoading(false);
      }
    };

    loadEmails();
  }, [accessToken]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const fetchedEmails = await fetchEmails(accessToken);
      const processedEmails = fetchedEmails.map((email) => ({
        ...email,
        category: classifyEmail(email),
        company: extractCompanyName(email),
        summary: summarizeEmail(email.body),
      }));
      saveProcessedEmails(processedEmails);
      setEmails(processedEmails);
    } catch (error) {
      console.error("Error refreshing emails:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Get emails from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentEmails = emails.filter((email) => {
    const emailDate = new Date(email.date);
    return emailDate >= thirtyDaysAgo;
  });

  // Filter emails based on selected category
  const filteredEmails =
    filter === "all"
      ? recentEmails
      : recentEmails.filter((email) => email.category === filter);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={toggleSidebar}
            style={{
              marginRight: "1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
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
                d="M4 6H20M4 12H20M4 18H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1
            style={{
              color: "#4F46E5",
              fontSize: "1.25rem",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Job Application Tracker
          </h1>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-primary"
          style={{ display: "flex", alignItems: "center" }}
        >
          {refreshing ? (
            <>
              <div
                className="spinner"
                style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }}
              ></div>
              Refreshing...
            </>
          ) : (
            <>
              <svg
                style={{ marginRight: "0.5rem" }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Refresh
            </>
          )}
        </button>
        <button
          onClick={onLogout}
          className="text-gray-500 hover:text-gray-700"
          style={{ marginLeft: "1rem" }}
        >
          Sign Out
        </button>
      </header>

      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="spinner"
              style={{ margin: "0 auto", width: "3rem", height: "3rem" }}
            ></div>
            <p
              style={{
                marginTop: "1rem",
                fontSize: "1.125rem",
                color: "#374151",
              }}
            >
              Loading your job application emails...
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
              This might take a moment
            </p>
          </div>
        </div>
      ) : (
        <div className="main-content">
          {/* Sidebar */}
          <div
            className="sidebar"
            style={{
              transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
              position: window.innerWidth < 768 ? "absolute" : "relative",
              zIndex: 10,
              height: "calc(100vh - 4rem)",
              transition: "transform 0.3s ease-in-out",
              overflowY: "auto",
            }}
          >
            <Summary emails={recentEmails} setFilter={setFilter} />
          </div>

          {/* Main content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", flex: 1 }}>
              {/* Email list */}
              <div
                style={{
                  width: "100%",
                  borderRight: "1px solid #E5E7EB",
                  background: "white",
                  overflowY: "auto",
                }}
              >
                <EmailList
                  emails={filteredEmails}
                  selectedEmail={selectedEmail}
                  setSelectedEmail={setSelectedEmail}
                />
              </div>

              {/* Email detail - hidden on small screens */}
              <div
                style={{
                  display: window.innerWidth < 1024 ? "none" : "block",
                  width: "50%",
                  overflowY: "auto",
                }}
              >
                {selectedEmail ? (
                  <EmailDetail email={selectedEmail} />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6B7280",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <svg
                        style={{
                          margin: "0 auto",
                          width: "3rem",
                          height: "3rem",
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
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <p style={{ marginTop: "0.5rem" }}>
                        Select an email to view details
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile email detail (shown when an email is selected) */}
            <div
              style={{
                display:
                  window.innerWidth < 1024 && selectedEmail ? "block" : "none",
                flex: 1,
                overflowY: "auto",
                background: "white",
                borderTop: "1px solid #E5E7EB",
              }}
            >
              {selectedEmail && <EmailDetail email={selectedEmail} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
