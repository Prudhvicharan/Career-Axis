// src/services/gmailApi.js
import axios from "axios";

// Use a more efficient approach to fetch emails
export const fetchEmails = async (accessToken, maxResults = 50) => {
  // For debugging
  console.log("Using access token:", accessToken ? "Token exists" : "No token");

  if (!accessToken) {
    console.error("No access token provided");
    throw new Error("Authentication required. Please sign in again.");
  }

  try {
    // Set up axios with proper authentication
    const api = axios.create({
      baseURL: "https://gmail.googleapis.com/gmail/v1",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // First, get email IDs with a better search query and fewer results to avoid rate limits
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

    // Get batch details instead of one-by-one to avoid rate limiting
    // Process in smaller batches to avoid 429 errors
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

      // Add a small delay between batches to avoid rate limiting
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

      // Handle token expiration
      if (error.response.status === 401) {
        throw new Error("Your session has expired. Please sign in again.");
      }
      // Handle rate limiting
      else if (error.response.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }
    }

    // Fallback to test data if we can't access the API
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

    // Extract body with improved decoding
    let body = "";
    if (email.payload.parts) {
      // Try to find text/plain part first
      const textPart = email.payload.parts.find(
        (part) => part.mimeType === "text/plain"
      );

      if (textPart && textPart.body.data) {
        try {
          body = decodeBase64Url(textPart.body.data);
        } catch (e) {
          console.error("Error decoding email body:", e);
        }
      } else {
        // Try to find HTML part if no plain text
        const htmlPart = email.payload.parts.find(
          (part) => part.mimeType === "text/html"
        );

        if (htmlPart && htmlPart.body.data) {
          try {
            // Convert HTML to plain text by removing tags
            const html = decodeBase64Url(htmlPart.body.data);
            body = html
              .replace(/<[^>]*>?/gm, " ")
              .replace(/\s+/g, " ")
              .trim();
          } catch (e) {
            console.error("Error decoding email HTML body:", e);
          }
        }
      }
    } else if (email.payload.body && email.payload.body.data) {
      try {
        body = decodeBase64Url(email.payload.body.data);
      } catch (e) {
        console.error("Error decoding email body:", e);
      }
    }

    return {
      id: email.id,
      threadId: email.threadId,
      subject,
      from,
      date: new Date(date),
      body,
      snippet: email.snippet,
      url: `https://mail.google.com/mail/u/0/#inbox/${email.id}`,
    };
  });
};

// Helper function to safely decode base64url encoded strings
function decodeBase64Url(base64url) {
  // Convert base64url to base64
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  // Decode base64
  return atob(base64);
}

// Fallback test data in case the API fails
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
      body: "Thank you for submitting your application for the Software Engineer position at TechCorp. We have received your application and will review it shortly.",
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
      body: "We have reviewed your application and would like to schedule an interview with you for the Software Developer position. Please let us know your availability for next week.",
      snippet:
        "We have reviewed your application and would like to schedule an interview with you for the Software Developer position.",
      url: "https://mail.google.com/mail/u/0/#inbox/email2",
    },
    {
      id: "email3",
      threadId: "thread3",
      subject: "Coding Assessment for Full Stack Developer Role",
      from: "WebSolutions <careers@websolutions.com>",
      date: yesterday,
      body: "As part of our interview process, we would like you to complete a coding assessment. Please find the details attached and submit your solution within 3 days.",
      snippet:
        "As part of our interview process, we would like you to complete a coding assessment.",
      url: "https://mail.google.com/mail/u/0/#inbox/email3",
    },
    {
      id: "email4",
      threadId: "thread4",
      subject: "Thank you for your interest in DataTech",
      from: "DataTech Careers <no-reply@datatech.com>",
      date: now,
      body: "Thank you for your interest in DataTech. We have received your application for the Data Engineer position and will review it shortly.",
      snippet:
        "Thank you for your interest in DataTech. We have received your application for the Data Engineer position.",
      url: "https://mail.google.com/mail/u/0/#inbox/email4",
    },
    {
      id: "email5",
      threadId: "thread5",
      subject: "Application Status: Frontend Developer",
      from: "UI Experts <careers@uiexperts.com>",
      date: yesterday,
      body: "Unfortunately, we have decided to move forward with other candidates for the Frontend Developer position. We appreciate your interest in our company and wish you the best in your job search.",
      snippet:
        "Unfortunately, we have decided to move forward with other candidates for the Frontend Developer position.",
      url: "https://mail.google.com/mail/u/0/#inbox/email5",
    },
  ];
}
