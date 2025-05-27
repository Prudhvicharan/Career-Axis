// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { fetchEmails } from "../../services/gmailApi";
import {
  classifyEmail,
  extractCompanyName,
} from "../Classification/EmailClassifier";
import {
  saveProcessedEmails,
  getProcessedEmails,
} from "../../services/storageService";
import Summary from "./Summary";
import EmailList from "./EmailList";
import EmailDetail from "./EmailDetail";
import { processEmailForDisplay } from "../../utils/emailTextExtractor";

// --- Icons --- (Using Heroicons Outline style for consistency)
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-12 h-12 text-[#A4AC86]"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    />
  </svg>
);

const Dashboard = ({ accessToken, onLogout, onAuthError }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on larger screens
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const emailListRef = useRef(null);

  useEffect(() => {
    const loadEmails = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        // Load from storage first
        const storedEmails = getProcessedEmails();
        if (storedEmails.length > 0) {
          setEmails(storedEmails);
          console.log("Loaded emails from localStorage:", storedEmails.length);
        }

        try {
          // Fetch fresh emails
          const fetchedEmails = await fetchEmails(accessToken);
          console.log("Fetched emails from API:", fetchedEmails.length);

          if (fetchedEmails && fetchedEmails.length > 0) {
            // Process emails with clean text extraction
            const processedEmails = processEmails(fetchedEmails);

            // Save processed emails
            saveProcessedEmails(processedEmails);
            setEmails(processedEmails);

            console.log("Processed emails:", processedEmails.length);
          }
        } catch (apiError) {
          console.error("Error fetching from API:", apiError);
          if (
            (apiError.message && apiError.message.includes("authentication")) ||
            apiError.response?.status === 401
          ) {
            onAuthError(apiError);
          } else {
            setLoadError(
              "Couldn't fetch new emails. Using previously stored data."
            );
          }
        }
      } catch (error) {
        console.error("Error in loadEmails:", error);
        setLoadError("An error occurred while loading your emails.");
      } finally {
        setLoading(false);
      }
    };
    loadEmails();
  }, [accessToken, onAuthError]);

  const processEmails = (fetchedEmails) => {
    return fetchedEmails.map((email) => {
      // Process email for clean display
      const { cleanBody, summary, hasContent } = processEmailForDisplay(email);

      // Create the processed email object
      const processedEmail = {
        ...email,
        body: cleanBody, // Clean body text
        summary: summary, // Smart summary
        hasContent: hasContent,
        category: classifyEmail({ ...email, body: cleanBody }), // Classify using clean text
        company: extractCompanyName(email),
      };

      return processedEmail;
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoadError(null);

    try {
      const fetchedEmails = await fetchEmails(accessToken);
      if (fetchedEmails && fetchedEmails.length > 0) {
        // Process emails with clean text extraction
        const processedEmails = processEmails(fetchedEmails);

        saveProcessedEmails(processedEmails);
        setEmails(processedEmails);
      }
    } catch (error) {
      console.error("Error refreshing emails:", error);
      if (
        (error.message && error.message.includes("authentication")) ||
        error.response?.status === 401
      ) {
        onAuthError(error);
      } else {
        setLoadError("Couldn't refresh emails. Please try again later.");
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Filtering and Sorting
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentEmails = emails.filter(
    (email) => new Date(email.date) >= thirtyDaysAgo
  );
  const filteredEmails =
    filter === "all"
      ? recentEmails
      : recentEmails.filter((email) => email.category === filter);
  const sortedEmails = [...filteredEmails].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Pagination Logic
  const totalPages = Math.ceil(sortedEmails.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedEmails = sortedEmails.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      if (emailListRef.current) {
        emailListRef.current.scrollTop = 0;
      }
    }
  };

  useEffect(() => {
    setSelectedEmail(null);
  }, [filter]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F4]">
      {/* Dashboard Header */}
      <header className="flex items-center justify-between p-4 border-b border-[#A4AC86]/60 bg-white shadow-sm z-20 flex-shrink-0">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-[#656D4A] hover:text-[#414833] p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#A4AC86]"
            aria-label="Toggle sidebar"
          >
            <MenuIcon />
          </button>
          {/* Updated branding: "Career Axis" */}
          <h1 className="text-xl font-semibold text-[#7F4F24]">Career Axis</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
              refreshing
                ? "bg-[#A4AC86]/50 text-[#333D29]/70 cursor-not-allowed"
                : "bg-[#7F4F24] text-white hover:bg-[#582F0E]"
            }`}
          >
            {refreshing ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                Refreshing...
              </>
            ) : (
              <>
                <RefreshIcon />
                <span className="ml-2">Refresh</span>
              </>
            )}
          </button>
          <button
            onClick={onLogout}
            className="text-sm text-[#656D4A] hover:text-[#414833] focus:outline-none"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Error Message */}
      {loadError && (
        <div className="p-3 mx-4 my-2 rounded-md text-sm bg-[#C2C5AA]/30 text-[#582F0E] border border-[#A4AC86]/50">
          {loadError}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`w-[280px] bg-white border-r border-[#A4AC86]/60 shadow-md transform transition-transform duration-300 ease-in-out flex-shrink-0 absolute inset-y-0 left-0 z-10 md:relative md:translate-x-0 overflow-y-auto ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ height: "calc(100vh - 65px)" }}
        >
          <Summary
            emails={recentEmails}
            setFilter={setFilter}
            currentFilter={filter}
          />
        </div>

        {/* Email List & Detail View */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center flex-1 p-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto border-4 border-[#A4AC86]/40 border-t-[#656D4A] rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-medium text-[#414833]">
                  Loading your job application emails...
                </p>
                <p className="text-sm text-[#656D4A]">
                  This might take a moment
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 overflow-hidden">
              {/* Email List */}
              <div
                ref={emailListRef}
                id="email-list-container"
                className={`w-full lg:w-1/2 xl:w-2/5 border-r border-[#A4AC86]/60 bg-white overflow-y-auto flex flex-col h-full flex-shrink-0 ${
                  selectedEmail ? "hidden lg:flex" : "flex"
                }`}
              >
                <EmailList
                  emails={paginatedEmails}
                  selectedEmail={selectedEmail}
                  setSelectedEmail={setSelectedEmail}
                  setSidebarOpen={setSidebarOpen}
                />
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 flex justify-center items-center border-t border-[#A4AC86]/60 bg-white mt-auto flex-shrink-0">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1 text-sm border border-[#A4AC86]/60 rounded-l-md disabled:bg-[#C2C5AA]/30 disabled:text-[#656D4A]/50 disabled:cursor-not-allowed hover:bg-[#B6AD90]/20 enabled:text-[#414833]"
                    >
                      Previous
                    </button>
                    <div className="px-3 py-1 text-sm border-t border-b border-[#A4AC86]/60 text-[#414833]">
                      Page {page} of {totalPages}
                    </div>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-3 py-1 text-sm border border-[#A4AC86]/60 rounded-r-md disabled:bg-[#C2C5AA]/30 disabled:text-[#656D4A]/50 disabled:cursor-not-allowed hover:bg-[#B6AD90]/20 enabled:text-[#414833]"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
              {/* Email Detail */}
              <div
                className={`flex-1 overflow-y-auto bg-[#F8F7F4] h-full ${
                  selectedEmail ? "block" : "hidden lg:block"
                }`}
              >
                {selectedEmail ? (
                  <EmailDetail email={selectedEmail} />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#656D4A]">
                    <div className="text-center">
                      <MailIcon />
                      <p className="mt-2">Select an email to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
