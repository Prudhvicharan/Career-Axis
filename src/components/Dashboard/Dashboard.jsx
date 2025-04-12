import React, { useState, useEffect } from "react";
import { fetchEmails } from "../../services/gmailApi";
// import { fetchEmails } from "../../services/gmailApiTest";

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

const Dashboard = ({ accessToken }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filter, setFilter] = useState("all");

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
        // After fetching
        console.log("Fetched Emails:", fetchedEmails);
        console.log("Processed Emails:", processedEmails);
      } catch (error) {
        console.error("Error loading emails:", error);
        setLoading(false);
      }
    };

    loadEmails();
  }, [accessToken]);

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
  console.log("Filtered Emails:", filteredEmails);

  return (
    <div className="flex flex-col h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl">Loading your emails...</p>
        </div>
      ) : (
        <>
          <div className="p-4 bg-white shadow">
            <h1 className="text-2xl font-bold">Job Application Tracker</h1>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-1/4 p-4 overflow-auto bg-gray-100">
              <Summary emails={recentEmails} setFilter={setFilter} />
            </div>

            <div className="w-3/4 flex overflow-hidden">
              <div className="w-1/2 p-4 overflow-auto border-r">
                <EmailList
                  emails={filteredEmails}
                  selectedEmail={selectedEmail}
                  setSelectedEmail={setSelectedEmail}
                />
              </div>

              <div className="w-1/2 p-4 overflow-auto">
                {selectedEmail && <EmailDetail email={selectedEmail} />}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
