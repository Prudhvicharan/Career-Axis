// src/utils/emailTextExtractor.js

/**
 * Enhanced email text extraction utility
 * Handles HTML emails, removes styling, and extracts clean text
 */

// Main function to extract clean text from email
export const extractCleanEmailText = (email) => {
  if (!email) return "";

  let rawContent = "";

  // Try to get the best content source
  if (email.body) {
    rawContent = email.body;
  } else if (email.snippet) {
    rawContent = email.snippet;
  } else {
    return "No content available";
  }

  // Clean the content
  return cleanEmailContent(rawContent);
};

// Comprehensive HTML and content cleaning
const cleanEmailContent = (content) => {
  if (!content || typeof content !== "string") {
    return "No content available";
  }

  let cleanedContent = content;

  // Remove common email header patterns
  cleanedContent = removeEmailHeaders(cleanedContent);

  // Remove HTML tags and extract text
  cleanedContent = stripHtmlTags(cleanedContent);

  // Remove CSS and JavaScript
  cleanedContent = removeStylesAndScripts(cleanedContent);

  // Clean up special characters and entities
  cleanedContent = cleanSpecialCharacters(cleanedContent);

  // Remove excessive whitespace and formatting
  cleanedContent = cleanWhitespace(cleanedContent);

  // Remove email signatures and footers
  cleanedContent = removeEmailFooters(cleanedContent);

  // Truncate if too long
  cleanedContent = truncateContent(cleanedContent);

  return cleanedContent || "No readable content available";
};

// Remove common email headers and metadata
const removeEmailHeaders = (content) => {
  const headerPatterns = [
    /From:.*?\n/gi,
    /To:.*?\n/gi,
    /Subject:.*?\n/gi,
    /Date:.*?\n/gi,
    /Reply-To:.*?\n/gi,
    /Message-ID:.*?\n/gi,
    /Content-Type:.*?\n/gi,
    /MIME-Version:.*?\n/gi,
    /X-.*?:.*?\n/gi,
    /Received:.*?\n/gi,
  ];

  let cleaned = content;
  headerPatterns.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, "");
  });

  return cleaned;
};

// Remove HTML tags while preserving some structure
const stripHtmlTags = (content) => {
  let cleaned = content;

  // Remove script and style tags completely with their content
  cleaned = cleaned.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
  cleaned = cleaned.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    ""
  );

  // Convert common block elements to line breaks
  cleaned = cleaned.replace(/<\/?(div|p|br|hr|h[1-6]|li|tr)\b[^>]*>/gi, "\n");

  // Convert list items to bullet points
  cleaned = cleaned.replace(/<li\b[^>]*>/gi, "\n• ");

  // Remove all other HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, " ");

  return cleaned;
};

// Remove CSS styles and JavaScript
const removeStylesAndScripts = (content) => {
  let cleaned = content;

  // Remove CSS declarations
  cleaned = cleaned.replace(/\{[^}]*\}/g, "");
  cleaned = cleaned.replace(/style\s*=\s*["'][^"']*["']/gi, "");

  // Remove JavaScript-like patterns
  cleaned = cleaned.replace(/javascript:[^"']*/gi, "");
  cleaned = cleaned.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");

  return cleaned;
};

// Clean special characters and HTML entities
// Clean special characters and HTML entities
const cleanSpecialCharacters = (content) => {
  let cleaned = content;

  // Decode common HTML entities
  const entities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&hellip;": "...",
    "&mdash;": "—",
    "&ndash;": "–",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
  };

  Object.entries(entities).forEach(([entity, replacement]) => {
    cleaned = cleaned.replace(new RegExp(entity, "gi"), replacement);
  });

  // Remove other HTML entities
  cleaned = cleaned.replace(/&#?\w+;/g, "");

  // Remove excessive special characters (clean version)
  cleaned = cleaned.replace(/[^\w\s.,!?()[\]{}'":;@-]/g, "");

  return cleaned;
};

// Clean up whitespace and formatting
const cleanWhitespace = (content) => {
  let cleaned = content;

  // Replace multiple spaces with single space
  cleaned = cleaned.replace(/\s+/g, " ");

  // Replace multiple line breaks with maximum of 2
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, "\n\n");

  // Remove leading/trailing whitespace from each line
  cleaned = cleaned
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  // Remove empty lines
  cleaned = cleaned.replace(/^\s*\n/gm, "");

  return cleaned.trim();
};

// Remove email signatures and footers
const removeEmailFooters = (content) => {
  const footerPatterns = [
    /unsubscribe.*$/im,
    /this email was sent.*$/im,
    /if you no longer wish.*$/im,
    /to stop receiving.*$/im,
    /click here to unsubscribe.*$/im,
    /privacy policy.*$/im,
    /terms of service.*$/im,
    /confidential.*$/im,
    /disclaimer.*$/im,
    /virus.*free.*$/im,
    /best regards.*$/im,
    /sincerely.*$/im,
    /kind regards.*$/im,
    /^--.*$/gm, // Common signature delimiter
  ];

  let cleaned = content;
  footerPatterns.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, "");
  });

  return cleaned.trim();
};

// Truncate content to reasonable length
const truncateContent = (content, maxLength = 2000) => {
  if (content.length <= maxLength) return content;

  // Find the last sentence boundary within the limit
  const truncated = content.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf(".");

  if (lastSentence > maxLength * 0.7) {
    return truncated.substring(0, lastSentence + 1);
  }

  return truncated + "...";
};

// Main function to process email for display (no summary)
export const processEmailForDisplay = (email) => {
  const cleanText = extractCleanEmailText(email);

  return {
    cleanBody: cleanText,
    hasContent: cleanText.length > 0 && cleanText !== "No content available",
  };
};
