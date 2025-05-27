// src/services/summarizationService.js - Updated version
import {
  extractCleanEmailText,
  generateEmailSummary,
} from "../utils/emailTextExtractor";

export const summarizeEmail = (emailBody) => {
  if (!emailBody || typeof emailBody !== "string") {
    return "No content available for this email.";
  }

  try {
    // Use the enhanced text extraction
    const cleanText = extractCleanEmailText({ body: emailBody });

    // Generate smart summary
    const summary = generateEmailSummary(cleanText, 2);

    return summary;
  } catch (error) {
    console.error("Error summarizing email:", error);
    // Fallback to simple truncation
    const cleanFallback = emailBody
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return cleanFallback.length > 150
      ? cleanFallback.substring(0, 150) + "..."
      : cleanFallback;
  }
};
