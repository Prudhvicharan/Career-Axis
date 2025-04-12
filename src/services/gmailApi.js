// src/services/gmailApi.js - Updated version
import axios from "axios";

export const fetchEmails = async (accessToken, maxResults = 100) => {
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

    // First, get email IDs
    const listResponse = await api.get(`/users/me/messages`, {
      params: {
        maxResults,
        q: "from:(jobs OR careers OR recruitment OR hiring OR talent OR apply OR glassdoor OR linkedin OR indeed OR ziprecruiter OR workday) OR subject:(application OR interview OR position OR opportunity OR job OR thank OR software OR engineer OR developer)",
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

    // Get full email details for each ID
    const emails = await Promise.all(
      listResponse.data.messages.map(async (message) => {
        const emailResponse = await api.get(`/users/me/messages/${message.id}`);
        return emailResponse.data;
      })
    );

    return processEmails(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);

      // Handle token expiration
      if (error.response.status === 401) {
        throw new Error("Your session has expired. Please sign in again.");
      }
    }
    throw error;
  }
};

const processEmails = (emails) => {
  return emails.map((email) => {
    // Extract headers
    const headers = email.payload.headers;
    const subject = headers.find((h) => h.name === "Subject")?.value || "";
    const from = headers.find((h) => h.name === "From")?.value || "";
    const date = headers.find((h) => h.name === "Date")?.value || "";

    // Extract body
    let body = "";
    if (email.payload.parts) {
      const textPart = email.payload.parts.find(
        (part) => part.mimeType === "text/plain"
      );
      if (textPart && textPart.body.data) {
        body = atob(textPart.body.data.replace(/-/g, "+").replace(/_/g, "/"));
      }
    } else if (email.payload.body && email.payload.body.data) {
      body = atob(
        email.payload.body.data.replace(/-/g, "+").replace(/_/g, "/")
      );
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
