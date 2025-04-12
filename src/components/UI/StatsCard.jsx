import React from "react";

const StatsCard = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700">
        <h3 className="text-lg font-medium text-white">
          Application Statistics
        </h3>
        <p className="text-indigo-100 text-sm">Last 30 days</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
        {stats.map((stat) => (
          <div key={stat.name} className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-50 text-indigo-700 mx-auto">
              {stat.icon}
            </div>
            <div className="mt-3 text-2xl font-semibold text-gray-900">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-gray-500">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
        <div className="text-sm">
          <span className="font-medium text-indigo-600">
            {stats.find((s) => s.name === "Response Rate")?.value || "0%"}
          </span>
          <span className="text-gray-500"> response rate</span>
          {stats.find((s) => s.trend) && (
            <span
              className={`ml-2 ${
                stats.find((s) => s.trend)?.trend === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stats.find((s) => s.trend)?.trend === "up" ? "↑" : "↓"}{" "}
              {stats.find((s) => s.trend)?.trendValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
