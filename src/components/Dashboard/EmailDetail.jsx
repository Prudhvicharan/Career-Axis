// src/components/Dashboard/EmailDetail.jsx
import React from "react";

const EmailDetail = ({ email }) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{email.subject}</h2>
        <p className="text-gray-600">{email.from}</p>
        <p className="text-gray-500 text-sm">
          {new Date(email.date).toLocaleString()}
        </p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Summary</h3>
        <p>{email.summary}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Full Content</h3>
        <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
          {email.body}
        </div>
      </div>

      <div className="mt-4">
        <a
          href={email.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View in Gmail
        </a>
      </div>
    </div>
  );
};

export default EmailDetail;
