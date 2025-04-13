// src/utils/helpers.js

/**
 * Collection of utility functions for the job application tracker
 */

// Format date to readable format
export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString);
  const defaultOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const mergedOptions = { ...defaultOptions, ...options };
  return date.toLocaleDateString("en-US", mergedOptions);
};

// Format time only
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Group dates as Today, Yesterday, or date
export const groupDateByRecency = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
};

// Get category badge styles based on category name
export const getCategoryBadgeStyles = (category) => {
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

// Safely get text from email by handling HTML content
export const getEmailText = (email) => {
  if (!email) return "";

  // Try to use body, fall back to snippet
  const content = email.body || email.snippet || "";

  // If it looks like HTML, do some basic cleaning
  if (content.includes("<") && content.includes(">")) {
    return content
      .replace(/<[^>]*>/g, " ") // Remove HTML tags
      .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .trim();
  }

  return content;
};

// Generate a color from a string (for company avatars)
export const stringToColor = (str) => {
  if (!str) return "#4F46E5"; // Default color

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const mainColors = [
    "#4F46E5", // Indigo
    "#7C3AED", // Violet
    "#059669", // Emerald
    "#0891B2", // Cyan
    "#D97706", // Amber
    "#DC2626", // Red
    "#2563EB", // Blue
    "#4338CA", // Indigo
    "#6D28D9", // Purple
    "#0D9488", // Teal
  ];

  // Use the hash to select a color
  const index = Math.abs(hash) % mainColors.length;
  return mainColors[index];
};

// Check if a date is within the last N days
export const isWithinDays = (dateString, days) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  return diff <= days;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// Calculate statistics from emails
export const calculateEmailStats = (emails) => {
  if (!emails || emails.length === 0) {
    return {
      total: 0,
      applications: 0,
      interviews: 0,
      rejections: 0,
      offers: 0,
      responseRate: "0%",
    };
  }

  // Count by category
  const counts = emails.reduce((acc, email) => {
    const category = email.category || "Other";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Calculate response rate (interviews + offers / applications)
  const applications = counts["Application Submitted"] || 0;
  const interviews = counts["Interview Request"] || 0;
  const offers = counts["Offer"] || 0;

  let responseRate = "0%";
  if (applications > 0) {
    responseRate =
      Math.round(((interviews + offers) / applications) * 100) + "%";
  }

  return {
    total: emails.length,
    applications,
    interviews,
    rejections: counts["Rejection"] || 0,
    offers,
    responseRate,
  };
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Handle network errors with useful messages
export const getNetworkErrorMessage = (error) => {
  if (!error) return "An unknown error occurred";

  if (error.response) {
    // Server responded with an error status code
    const status = error.response.status;

    if (status === 401) {
      return "Authentication failed. Please sign in again.";
    } else if (status === 403) {
      return "You do not have permission to access this resource.";
    } else if (status === 404) {
      return "The requested resource was not found.";
    } else if (status === 429) {
      return "Too many requests. Please try again later.";
    } else if (status >= 500) {
      return "Server error. Please try again later.";
    }

    return `Error: ${status} - ${error.response.statusText || "Unknown error"}`;
  } else if (error.request) {
    // Request was made but no response received
    return "No response from server. Please check your internet connection and try again.";
  } else {
    // Error in setting up the request
    return error.message || "An unknown error occurred";
  }
};
