// src/components/Dashboard/EmailDetail.jsx
import React from "react";

// --- Icons --- (Using Heroicons Outline/Solid style)
const ExternalLinkIcon = () => (
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
      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
);

const InformationCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
      clipRule="evenodd"
    />
  </svg>
);

const EllipsisHorizontalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
  </svg>
);

// Re-using MailIcon for empty state (assuming it might be imported from a shared file eventually)
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

// Helper to get badge classes based on category using the palette
const getCategoryBadgeClasses = (category) => {
  // Base classes for all badges
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";

  switch (category) {
    case "Application Submitted": // Use neutral/info tones
      return `${baseClasses} bg-[#DBEAFE]/40 text-[#2563EB] border-[#BFDBFE]/60`; // Example: Light blue from palette
    case "Interview Request": // Use positive/success tones
      return `${baseClasses} bg-[#D1FAE5]/40 text-[#059669] border-[#A7F3D0]/60`; // Example: Light green from palette
    case "Rejection": // Use muted/error tones
      return `${baseClasses} bg-[#FEF2F2]/40 text-[#DC2626] border-[#FEE2E2]/60`; // Example: Light red from palette
    case "Assessment Request": // Use warning/action tones
      return `${baseClasses} bg-[#FFFBEB]/40 text-[#D97706] border-[#FEF3C7]/60`; // Example: Light yellow/orange from palette
    case "Offer": // Use distinct positive tone (e.g., purple/violet)
      return `${baseClasses} bg-[#EDE9FE]/40 text-[#7C3AED] border-[#DDD6FE]/60`; // Example: Light purple from palette
    case "Follow Up": // Use secondary info tone
      return `${baseClasses} bg-[#E0F2FE]/40 text-[#0284C7] border-[#BAE6FD]/60`; // Example: Light sky blue from palette
    case "Job Alert": // Use distinct info tone
      return `${baseClasses} bg-[#ECFEFF]/40 text-[#0891B2] border-[#CFFAFE]/60`; // Example: Light cyan from palette
    default: // Default/Unclassified
      return `${baseClasses} bg-[#E5E7EB]/40 text-[#6B7280] border-[#D1D5DB]/60`; // Example: Light gray from palette
  }
};

// Helper to get action button component based on category
const getActionButton = (category) => {
  // Base classes for all action buttons
  const baseButtonClasses =
    "px-3.5 py-1.5 rounded-md text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors duration-150 ease-in-out";

  let buttonText = "View Email";
  let specificClasses =
    "bg-[#A68A64] hover:bg-[#936639] focus-visible:outline-[#A68A64]"; // Default: Mid-beige/gray

  switch (category) {
    case "Application Submitted":
      buttonText = "Track Application";
      specificClasses =
        "bg-[#656D4A] hover:bg-[#414833] focus-visible:outline-[#656D4A]"; // Mid-green
      break;
    case "Interview Request":
      buttonText = "Schedule Interview";
      specificClasses =
        "bg-[#059669] hover:bg-[#047857] focus-visible:outline-[#059669]"; // Keep Tailwind green
      break;
    case "Rejection":
      buttonText = "Archive";
      specificClasses =
        "bg-[#9CA3AF] hover:bg-[#6B7280] focus-visible:outline-[#9CA3AF]"; // Use gray for archive
      break;
    case "Assessment Request":
      buttonText = "Start Assessment";
      specificClasses =
        "bg-[#D97706] hover:bg-[#B45309] focus-visible:outline-[#D97706]"; // Keep Tailwind amber
      break;
    case "Offer":
      buttonText = "Review Offer";
      specificClasses =
        "bg-[#7C3AED] hover:bg-[#6D28D9] focus-visible:outline-[#7C3AED]"; // Keep Tailwind violet
      break;
    case "Follow Up":
      buttonText = "Send Response";
      specificClasses =
        "bg-[#2563EB] hover:bg-[#1D4ED8] focus-visible:outline-[#2563EB]"; // Keep Tailwind blue
      break;
    case "Job Alert":
      buttonText = "Apply Now";
      specificClasses =
        "bg-[#0891B2] hover:bg-[#0E7490] focus-visible:outline-[#0891B2]"; // Keep Tailwind cyan
      break;
    default:
      buttonText = "View Email";
      specificClasses =
        "bg-[#A68A64] hover:bg-[#936639] focus-visible:outline-[#A68A64]"; // Default: Mid-beige/gray
      break;
  }

  return (
    <button type="button" className={`${baseButtonClasses} ${specificClasses}`}>
      {buttonText}
    </button>
  );
};

const EmailDetail = ({ email }) => {
  // Format date (function remains the same)
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

  if (!email) {
    // Empty state - using Tailwind and palette colors
    return (
      <div className="flex h-full items-center justify-center text-[#656D4A] p-6 bg-[#F8F7F4]">
        {" "}
        {/* Use light bg */}
        <div className="text-center">
          <MailIcon />
          <p className="mt-2 text-sm">Select an email to view details</p>
        </div>
      </div>
    );
  }

  // Get badge classes for the current email
  const badgeClasses = getCategoryBadgeClasses(email.category);

  return (
    // Main container - flex column, full height, overflow hidden
    <div className="flex flex-col h-full overflow-hidden bg-[#F8F7F4]">
      {" "}
      {/* Lightest background */}
      {/* Email header - sticky top */}
      <div className="p-6 border-b border-[#A4AC86]/60 bg-white flex-shrink-0 sticky top-0 z-10 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          {/* Left side: Subject, Badges, Company */}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-[#414833] mb-1.5 break-words">
              {" "}
              {/* Dark text */}
              {email.subject}
            </h1>
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm">
              {/* Category Badge */}
              <span className={badgeClasses}>{email.category}</span>
              {/* Separator + Company Name */}
              {email.company && (
                <>
                  <span className="text-[#A68A64]"> • </span>{" "}
                  {/* Palette separator color */}
                  <span className="text-[#656D4A] font-medium">
                    {email.company}
                  </span>{" "}
                  {/* Palette secondary text */}
                </>
              )}
            </div>
          </div>

          {/* Right side: Open in Gmail Link */}
          <div className="flex-shrink-0">
            <a
              href={email.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#7F4F24] hover:text-[#582F0E] inline-flex items-center gap-1" /* Palette link color */
            >
              <ExternalLinkIcon />
              <span>Open in Gmail</span>
            </a>
          </div>
        </div>

        {/* Sender Info Row */}
        <div className="mt-4 flex items-center gap-3">
          {/* Initials Circle */}
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#A68A64] flex items-center justify-center text-white font-medium text-lg">
            {" "}
            {/* Palette background */}
            {email.company
              ? email.company.substring(0, 1).toUpperCase()
              : email.from.substring(0, 1).toUpperCase()}
          </div>
          {/* From Name & Email */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#414833] truncate">
              {" "}
              {/* Dark text */}
              {email.from.split("<")[0].trim()}
            </p>
            <p className="text-sm text-[#656D4A] truncate">
              {" "}
              {/* Secondary text */}
              {email.from.includes("<")
                ? email.from.split("<")[1].replace(">", "")
                : ""}
            </p>
          </div>
          {/* Date */}
          <div className="text-xs text-[#656D4A] text-right flex-shrink-0">
            {" "}
            {/* Secondary text */}
            <p>{formatDate(email.date)}</p>
          </div>
        </div>
      </div>
      {/* Email content - scrollable middle */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Email summary */}
        {email.summary && email.hasContent && (
          <div className="bg-[#C2C5AA]/20 border border-[#A4AC86]/50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-[#582F0E] mb-2 flex items-center gap-1.5">
              <InformationCircleIcon />
              Email Summary
            </h3>
            <p className="text-sm text-[#582F0E]/90 leading-relaxed">
              {email.summary}
            </p>
          </div>
        )}

        {/* Email body */}
        <div className="bg-white rounded-lg border border-[#A4AC86]/30 p-4">
          <h3 className="text-sm font-semibold text-[#582F0E] mb-3 flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.586.293h-3.414a1 1 0 01-.586-.293l-2.414-2.414A1 1 0 006.586 13H1"
              />
            </svg>
            Email Content
          </h3>

          {email.hasContent ? (
            <div className="text-sm leading-relaxed text-[#333D29] whitespace-pre-wrap">
              {email.body}
            </div>
          ) : (
            <div className="text-sm text-[#656D4A] italic">
              No readable content available for this email.
            </div>
          )}
        </div>

        {/* Show snippet as fallback if no clean content */}
        {!email.hasContent && email.snippet && (
          <div className="mt-4 bg-[#F8F7F4] rounded-lg border border-[#A4AC86]/30 p-4">
            <h3 className="text-sm font-semibold text-[#582F0E] mb-2">
              Email Preview (Gmail Snippet)
            </h3>
            <p className="text-sm text-[#656D4A] italic">{email.snippet}</p>
          </div>
        )}
      </div>
      {/* Email actions - sticky bottom */}
      <div className="p-6 border-t border-[#A4AC86]/60 flex-shrink-0 sticky bottom-0 bg-[#F8F7F4]/95 backdrop-blur-sm">
        {" "}
        {/* Use light bg, slight blur */}
        <div className="flex justify-between items-center">
          {/* Left Actions: Main action + Reply */}
          <div className="flex gap-3">
            {getActionButton(email.category)}

            <button
              type="button"
              className="px-3.5 py-1.5 rounded-md text-sm font-semibold bg-white text-[#414833] border border-[#A4AC86]/80 shadow-sm hover:bg-[#B6AD90]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A68A64]" /* Palette reply button */
            >
              Reply
            </button>
          </div>

          {/* Right Actions: More Options */}
          <div>
            <button className="p-1 text-[#656D4A] hover:text-[#414833]">
              {" "}
              {/* Palette secondary text */}
              <span className="sr-only">More options</span>
              <EllipsisHorizontalIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
