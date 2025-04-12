// src/components/Dashboard/EmailList.jsx
import React from "react";

const EmailList = ({ emails, selectedEmail, setSelectedEmail }) => {
  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Emails {emails.length > 0 ? `(${emails.length})` : ""}
      </h2>

      {emails.length === 0 ? (
        <p className="text-gray-500">
          No emails found for this category today.
        </p>
      ) : (
        <div className="space-y-2">
          {emails.map((email) => (
            <div
              key={email.id}
              className={`p-3 rounded border cursor-pointer hover:bg-gray-50 ${
                selectedEmail?.id === email.id
                  ? "bg-blue-50 border-blue-300"
                  : ""
              }`}
              onClick={() => setSelectedEmail(email)}
            >
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{email.company}</span>
                <span className="text-sm text-gray-500">
                  {formatDate(email.date)}
                </span>
              </div>
              <div className="font-medium truncate">{email.subject}</div>
              <div className="text-sm text-gray-600 truncate">
                {email.snippet}
              </div>
              <div className="mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    email.category === "Interview Request"
                      ? "bg-green-100 text-green-800"
                      : email.category === "Rejection"
                      ? "bg-red-100 text-red-800"
                      : email.category === "Application Submitted"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {email.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailList;
