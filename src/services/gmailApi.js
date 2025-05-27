// src/services/gmailApi.js - Updated version
import axios from "axios";
import { extractCleanEmailText } from "../utils/emailTextExtractor";

export const fetchEmails = async (accessToken, maxResults = 50) => {
  console.log("Using access token:", accessToken ? "Token exists" : "No token");

  if (!accessToken) {
    console.error("No access token provided");
    throw new Error("Authentication required. Please sign in again.");
  }

  try {
    const api = axios.create({
      baseURL: "https://gmail.googleapis.com/gmail/v1",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Get email IDs with better search query
    const listResponse = await api.get(`/users/me/messages`, {
      params: {
        maxResults,
        q: "from:(jobs OR careers OR recruitment OR hiring OR talent OR apply OR glassdoor OR linkedin OR indeed OR ziprecruiter OR workday) OR subject:(application OR interview OR position OR opportunity OR job OR thank)",
      },
    });

    console.log("API Response:", listResponse.data);

    if (
      !listResponse.data.messages ||
      listResponse.data.messages.length === 0
    ) {
      console.log("No matching emails found");
      return [];
    }

    // Process in smaller batches to avoid rate limiting
    const batchSize = 10;
    const batches = [];

    for (let i = 0; i < listResponse.data.messages.length; i += batchSize) {
      batches.push(listResponse.data.messages.slice(i, i + batchSize));
    }

    let allEmails = [];

    for (const batch of batches) {
      const batchEmails = await Promise.all(
        batch.map(async (message) => {
          try {
            const emailResponse = await api.get(
              `/users/me/messages/${message.id}`,
              {
                params: {
                  format: "full",
                },
              }
            );
            return emailResponse.data;
          } catch (error) {
            console.error(`Error fetching email ${message.id}:`, error);
            return null;
          }
        })
      );

      // Add delay between batches
      if (batches.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      allEmails = [...allEmails, ...batchEmails.filter(Boolean)];
    }

    return processEmails(allEmails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);

      if (error.response.status === 401) {
        throw new Error("Your session has expired. Please sign in again.");
      } else if (error.response.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }
    }

    console.log("Falling back to test data due to API error");
    return getTestData();
  }
};

const processEmails = (emails) => {
  return emails.map((email) => {
    // Extract headers
    const headers = email.payload.headers;
    const subject = headers.find((h) => h.name === "Subject")?.value || "";
    const from = headers.find((h) => h.name === "From")?.value || "";
    const date = headers.find((h) => h.name === "Date")?.value || "";

    // Extract body with improved parsing
    let body = extractEmailBody(email.payload);

    // Clean the extracted body
    const cleanBody = extractCleanEmailText({ body });

    return {
      id: email.id,
      threadId: email.threadId,
      subject,
      from,
      date: new Date(date),
      body: cleanBody, // Use cleaned body
      rawBody: body, // Keep original for debugging
      snippet: email.snippet,
      url: `https://mail.google.com/mail/u/0/#inbox/${email.id}`,
    };
  });
};

// Enhanced email body extraction
const extractEmailBody = (payload) => {
  let body = "";

  try {
    if (payload.parts && payload.parts.length > 0) {
      // Handle multipart emails
      body = extractFromParts(payload.parts);
    } else if (payload.body && payload.body.data) {
      // Handle simple emails
      body = decodeBase64Url(payload.body.data);
    }
  } catch (error) {
    console.error("Error extracting email body:", error);
    return "";
  }

  return body;
};

// Recursively extract text from email parts
const extractFromParts = (parts) => {
  let bestContent = "";
  let textContent = "";
  let htmlContent = "";

  for (const part of parts) {
    if (part.parts) {
      // Recursive for nested parts
      const nestedContent = extractFromParts(part.parts);
      if (nestedContent) {
        bestContent = nestedContent;
      }
    } else if (part.body && part.body.data) {
      try {
        const decoded = decodeBase64Url(part.body.data);

        if (part.mimeType === "text/plain") {
          textContent = decoded;
        } else if (part.mimeType === "text/html") {
          htmlContent = decoded;
        }
      } catch (error) {
        console.error("Error decoding part:", error);
      }
    }
  }

  // Prefer plain text over HTML
  if (textContent) {
    return textContent;
  } else if (htmlContent) {
    return htmlContent;
  } else {
    return bestContent;
  }
};

// Helper function to safely decode base64url encoded strings
function decodeBase64Url(base64url) {
  try {
    // Convert base64url to base64
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if needed
    const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    // Decode base64
    return atob(paddedBase64);
  } catch (error) {
    console.error("Error decoding base64url:", error);
    return "";
  }
}

// Updated test data with more realistic content
function getTestData() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  return [
    {
      id: "email1",
      threadId: "thread1",
      subject: "Thank you for applying to Software Engineer position",
      from: "TechCorp Recruiting <recruiting@techcorp.com>",
      date: now,
      body: "Thank you for submitting your application for the Software Engineer position at TechCorp. We have received your application and will review it shortly. Our team will be in touch within the next 5-7 business days to discuss next steps.",
      snippet:
        "Thank you for submitting your application for the Software Engineer position at TechCorp.",
      url: "https://mail.google.com/mail/u/0/#inbox/email1",
    },
    {
      id: "email2",
      threadId: "thread2",
      subject: "Interview Request: Software Developer Position",
      from: "InnovateTech HR <hr@innovatetech.com>",
      date: yesterday,
      body: "We have reviewed your application and would like to schedule an interview with you for the Software Developer position. The interview will be conducted via video call and should take approximately 1 hour. Please let us know your availability for next week, preferably Tuesday through Thursday between 10 AM and 4 PM.",
      snippet:
        "We have reviewed your application and would like to schedule an interview with you for the Software Developer position.",
      url: "https://mail.google.com/mail/u/0/#inbox/email2",
    },
    {
      id: "email3",
      threadId: "thread3",
      subject: "Unfortunately, we won't be moving forward",
      from: "WebSolutions <careers@websolutions.com>",
      date: yesterday,
      body: "Thank you for your interest in the Full Stack Developer position at WebSolutions. After careful consideration of all candidates, we have decided to move forward with another candidate whose experience more closely matches our current needs. We appreciate the time you invested in the interview process and wish you the best of luck in your job search.",
      snippet:
        "Thank you for your interest in the Full Stack Developer position at WebSolutions.",
      url: "https://mail.google.com/mail/u/0/#inbox/email3",
    },
  ];
}
