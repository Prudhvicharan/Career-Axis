import React from "react";

const CompanyCard = ({ company }) => {
  // Function to get badge styles based on status
  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "interview":
        return "bg-emerald-100 text-emerald-800";
      case "offer":
        return "bg-violet-100 text-violet-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="p-5">
        <div className="flex items-center">
          {company.logo ? (
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="h-12 w-12 flex-shrink-0 rounded-md"
            />
          ) : (
            <div className="h-12 w-12 flex-shrink-0 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-medium">
              {company.name.substring(0, 1).toUpperCase()}
            </div>
          )}

          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {company.name}
            </h3>
            <p className="text-sm text-gray-500">{company.position}</p>
          </div>

          <div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                company.status
              )}`}
            >
              {company.status}
            </span>
          </div>
        </div>

        {company.description && (
          <p className="mt-4 text-sm text-gray-600 line-clamp-2">
            {company.description}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {company.technologies?.map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span className="font-medium text-gray-900">Applied:</span>{" "}
            {new Date(company.appliedDate).toLocaleDateString()}
          </div>

          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none">
            View details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
