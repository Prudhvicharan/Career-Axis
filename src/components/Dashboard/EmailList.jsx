// src/components/Dashboard/EmailList.jsx
import React, { useState } from "react";

// --- Icons --- (Using Heroicons Outline style)
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5 text-[#9CA3AF]"
  >
    {" "}
    {/* Muted icon color */}
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
      clipRule="evenodd"
    />
  </svg>
);

// Re-use MailIcon for empty state
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

// Assume this function is defined here or imported from a shared utility file
// Helper to get badge classes based on category using the palette
const getCategoryBadgeClasses = (category) => {
  const baseClasses =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border"; // Slightly less padding

  switch (category) {
    case "Application Submitted":
      return `${baseClasses} bg-[#DBEAFE]/40 text-[#2563EB] border-[#BFDBFE]/60`;
    case "Interview Request":
      return `${baseClasses} bg-[#D1FAE5]/40 text-[#059669] border-[#A7F3D0]/60`;
    case "Rejection":
      return `${baseClasses} bg-[#FEF2F2]/40 text-[#DC2626] border-[#FEE2E2]/60`;
    case "Assessment Request":
      return `${baseClasses} bg-[#FFFBEB]/40 text-[#D97706] border-[#FEF3C7]/60`;
    case "Offer":
      return `${baseClasses} bg-[#EDE9FE]/40 text-[#7C3AED] border-[#DDD6FE]/60`;
    case "Follow Up":
      return `${baseClasses} bg-[#E0F2FE]/40 text-[#0284C7] border-[#BAE6FD]/60`;
    case "Job Alert":
      return `${baseClasses} bg-[#ECFEFF]/40 text-[#0891B2] border-[#CFFAFE]/60`;
    default:
      return `${baseClasses} bg-[#E5E7EB]/40 text-[#6B7280] border-[#D1D5DB]/60`;
  }
};

// Props might include setSidebarOpen for mobile interaction
const EmailList = ({
  emails,
  selectedEmail,
  setSelectedEmail,
  setSidebarOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter emails by search term (remains the same)
  const filteredEmails = emails.filter(
    (email) =>
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (email.company &&
        email.company.toLowerCase().includes(searchTerm.toLowerCase())) // Added check for company existence
  );

  // Group emails by date (remains the same)
  const groupedEmails = filteredEmails.reduce((groups, email) => {
    const date = new Date(email.date);
    // Use UTC dates for comparison to avoid timezone issues if dates might cross midnight locally vs UTC
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const emailDateOnly = new Date(date);
    emailDateOnly.setHours(0, 0, 0, 0);

    let dateGroup;

    if (emailDateOnly.getTime() === today.getTime()) {
      dateGroup = "Today";
    } else if (emailDateOnly.getTime() === yesterday.getTime()) {
      dateGroup = "Yesterday";
    } else {
      // Show year only if it's not the current year
      const yearFormat =
        today.getFullYear() === date.getFullYear() ? undefined : "numeric";
      dateGroup = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: yearFormat,
      });
    }

    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }
    groups[dateGroup].push(email);
    return groups;
  }, {});

  // Format time (remains the same)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }); // Slightly shorter format
  };

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    // Close sidebar on mobile when an email is selected
    // Check window width or use a state passed down from a context/parent
    // This check is basic; a more robust solution might involve context or CSS media queries
    if (window.innerWidth < 768 && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    // Main container - flex column, full height, prevents vertical overflow
    <div className="flex flex-col h-full overflow-y-hidden bg-white">
      {/* Sticky Search Header */}
      <div className="p-4 border-b border-[#A4AC86]/60 flex-shrink-0 sticky top-0 z-10 bg-white">
        {/* Search Input */}
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="search" // Use type="search" for better semantics/potential browser features
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search emails..."
            className="block w-full pl-10 pr-3 py-2 rounded-md border border-[#A4AC86]/80 // Palette border
                       text-sm text-[#414833] placeholder:text-[#9CA3AF] // Palette text/placeholder
                       focus:outline-none focus:ring-1 focus:ring-[#A68A64] focus:border-[#A68A64]" // Palette focus ring
          />
        </div>

        {/* Email Count */}
        <div className="mt-3">
          <h2 className="text-xs font-medium text-[#656D4A]">
            {" "}
            {/* Palette secondary text */}
            {filteredEmails.length}{" "}
            {filteredEmails.length === 1 ? "Result" : "Results"}
          </h2>
        </div>
      </div>

      {/* Scrollable Email List Area */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmails.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full p-12 text-center">
            <MailIcon />
            <h3 className="mt-2 text-sm font-semibold text-[#414833]">
              {" "}
              {/* Palette primary text */}
              No emails found
            </h3>
            <p className="mt-1 text-sm text-[#656D4A]">
              {" "}
              {/* Palette secondary text */}
              {searchTerm
                ? "Try adjusting your search terms."
                : "No relevant job application emails found."}
            </p>
          </div>
        ) : (
          // List grouped by date
          Object.entries(groupedEmails).map(([date, dateEmails]) => (
            <div key={date}>
              {/* Sticky Date Header */}
              <div className="sticky top-0 z-[5] px-4 py-1.5 bg-[#F8F7F4]/95 backdrop-blur-sm border-b border-[#A4AC86]/60">
                {" "}
                {/* Light bg, slight blur */}
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[#656D4A]">
                  {" "}
                  {/* Palette secondary text */}
                  {date}
                </h3>
              </div>

              {/* Emails for this date */}
              <div>
                {dateEmails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  const badgeClasses = getCategoryBadgeClasses(email.category);

                  return (
                    <div
                      key={email.id}
                      onClick={() => handleSelectEmail(email)}
                      className={`
                                p-3 pl-4 cursor-pointer border-b border-[#A4AC86]/40 // Palette border
                                border-l-4 transition-colors duration-150 ease-in-out group // Added group for potential internal hover effects
                                ${
                                  isSelected
                                    ? "bg-[#C2C5AA]/20 border-l-[#7F4F24]" // Selected state: Light green bg, Brown border
                                    : "border-l-transparent hover:bg-[#B6AD90]/10" // Default state: Transparent border, Light beige hover
                                }
                            `}
                    >
                      {/* Top row: Avatar/Initials, Name/From, Time */}
                      <div className="flex justify-between items-start gap-3">
                        {/* Initials + Name/From */}
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Initials Circle */}
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#A68A64] flex items-center justify-center text-white font-medium text-base">
                            {" "}
                            {/* Palette background */}
                            {email.company
                              ? email.company.substring(0, 1).toUpperCase()
                              : email.from.substring(0, 1).toUpperCase()}
                          </div>
                          {/* Name & From */}
                          <div className="min-w-0">
                            <h4
                              className={`text-sm font-semibold truncate ${
                                isSelected ? "text-[#414833]" : "text-[#414833]"
                              }`}
                            >
                              {" "}
                              {/* Dark text */}
                              {email.company || email.from.split("<")[0].trim()}
                            </h4>
                            <p
                              className={`text-xs truncate ${
                                isSelected ? "text-[#656D4A]" : "text-[#656D4A]"
                              }`}
                            >
                              {" "}
                              {/* Secondary text */}
                              {email.company
                                ? email.from.split("<")[0].trim()
                                : email.from.includes("<")
                                ? email.from.split("<")[1].replace(">", "")
                                : ""}
                            </p>
                          </div>
                        </div>
                        {/* Time */}
                        <span className="text-xs text-[#656D4A] flex-shrink-0 pt-1">
                          {" "}
                          {/* Adjusted padding slightly */}
                          {formatTime(email.date)}
                        </span>
                      </div>

                      {/* Subject */}
                      <h3
                        className={`mt-2 text-sm font-medium truncate ${
                          isSelected ? "text-[#333D29]" : "text-[#333D29]"
                        }`}
                      >
                        {" "}
                        {/* Darkest text */}
                        {email.subject}
                      </h3>

                      {/* Snippet */}
                      <p
                        className={`mt-1 text-xs line-clamp-2 ${
                          isSelected ? "text-[#656D4A]" : "text-[#656D4A]"
                        }`}
                      >
                        {" "}
                        {/* Secondary text */}
                        {email.snippet}
                      </p>

                      {/* Category Badge */}
                      <div className="mt-2">
                        <span className={badgeClasses}>{email.category}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmailList;
