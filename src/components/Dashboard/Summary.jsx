// src/components/Dashboard/Summary.jsx
import React from "react";
import { EMAIL_CATEGORIES } from "../Classification/Categories";
import { calculateEmailStats } from "../../utils/helpers";

const Summary = ({ emails, setFilter }) => {
  // Calculate statistics from emails
  const stats = calculateEmailStats(emails);

  // Count emails by category
  const categoryCounts = Object.values(EMAIL_CATEGORIES).reduce(
    (acc, category) => {
      acc[category] = 0;
      return acc;
    },
    {}
  );
  emails.forEach((email) => {
    if (email.category) {
      categoryCounts[email.category] =
        (categoryCounts[email.category] || 0) + 1;
    }
  });

  // Define category colors from your palette
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

  // Format date range for header
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const formatRange = (date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const dateRange = `${formatRange(thirtyDaysAgo)} - ${formatRange(today)}`;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Section */}
      <header className="p-6 border-b border-[#A4AC86]/60 bg-white">
        <h2 className="text-xl font-medium text-[#111827]">
          Applications Summary
        </h2>
        <p className="text-sm text-[#6B7280]">{dateRange}</p>
        <div className="mt-3">
          <div className="text-4xl font-bold text-[#111827]">{stats.total}</div>
          <div className="text-sm text-[#6B7280]">Total job-related emails</div>
        </div>
      </header>

      {/* Category Badges */}
      {/* <div className="p-6 flex-shrink-0">
        {Object.keys(categoryCounts).some((key) => categoryCounts[key] > 0) ? (
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryCounts)
              .filter(([_, count]) => count > 0)
              .map(([category, count]) => (
                <div
                  key={category}
                  onClick={() => setFilter(category)}
                  className="px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-transform duration-100 ease-in-out"
                  style={{
                    backgroundColor: categoryColors[category] + "20",
                    color: categoryColors[category],
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {category}: {count}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#6B7280]">
            <svg
              className="w-12 h-12 mx-auto text-[#9CA3AF]"
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
            <p className="mt-2">No job application emails found</p>
          </div>
        )}
      </div> */}

      {/* Filter Section */}
      <div className="p-6 flex-shrink-0 border-t border-b border-[#E5E7EB] bg-white">
        <h3 className="text-sm font-medium text-[#111827] mb-3">
          Filter by Status
        </h3>
        <button
          onClick={() => setFilter("all")}
          className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded-md mb-1 focus:outline-none"
        >
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#4F46E5] mr-3"></div>
            <span className="font-medium">All Emails</span>
          </div>
          <span className="bg-[#EEF2FF] text-[#4F46E5] text-xs font-medium px-2 py-0.5 rounded-full">
            {emails.length}
          </span>
        </button>
      </div>

      {/* Main Scrollable Area */}
      <div className="p-6 flex-1 overflow-y-auto bg-white">
        {categoryGroups.map((group, groupIndex) => (
          <section key={group.title} className="mb-4">
            <h4
              className={`text-xs font-medium uppercase tracking-wide text-[#6B7280] mb-2 ${
                groupIndex > 0 ? "pt-2" : ""
              }`}
            >
              {group.title}
            </h4>
            <div className="space-y-1">
              {group.categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm rounded-md transition-colors duration-200 hover:bg-gray-100 focus:outline-none"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{
                        backgroundColor: categoryColors[category] || "#6B7280",
                      }}
                    ></div>
                    <span>{category}</span>
                  </div>
                  <span className="bg-gray-100 text-[#111827] text-xs font-medium px-2 py-0.5 rounded-full">
                    {categoryCounts[category] || 0}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}

        {/* Stats Section */}
        {/* <div className="mt-6 mb-8 p-4 bg-[#F9FAFB] rounded-md">
          <h4 className="text-sm font-medium text-[#111827] mb-2">
            Application Stats
          </h4>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-[#6B7280]">Applications</span>
            <span className="text-xs font-medium text-[#111827]">
              {stats.applications}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-[#6B7280]">Interviews</span>
            <span className="text-xs font-medium text-[#111827]">
              {stats.interviews}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-[#6B7280]">Offers</span>
            <span className="text-xs font-medium text-[#111827]">
              {stats.offers}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-[#6B7280]">Rejections</span>
            <span className="text-xs font-medium text-[#111827]">
              {stats.rejections}
            </span>
          </div>
          <div className="flex justify-between mt-3 border-t border-gray-300 pt-2">
            <span className="text-xs text-[#6B7280]">Response Rate</span>
            <span className="text-xs font-medium text-[#059669]">
              {stats.responseRate}
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Summary;
