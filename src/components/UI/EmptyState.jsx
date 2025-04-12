import React from "react";

const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  imageUrl,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-48 h-48 object-contain mb-4"
        />
      ) : icon ? (
        <div className="text-gray-400 mb-4">{icon}</div>
      ) : (
        <svg
          className="h-16 w-16 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      )}
      <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500 max-w-md">{description}</p>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
