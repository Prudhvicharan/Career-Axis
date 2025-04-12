// src/services/gmailApi.js
import axios from "axios";

export const fetchEmails = async (accessToken, maxResults = 100) => {
  try {
    // First, get email IDs
    const listResponse = await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages`,
      {
        params: {
          maxResults,
          q: "from:(jobs OR careers OR recruitment OR hiring OR talent OR apply OR glassdoor OR linkedin OR indeed OR ziprecruiter OR workday) OR subject:(application OR interview OR position OR opportunity OR job OR thank OR software OR engineer OR developer)",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Get full email details for each ID
    const emails = await Promise.all(
      listResponse.data.messages.map(async (message) => {
        const emailResponse = await axios.get(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        return emailResponse.data;
      })
    );

    return processEmails(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
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
