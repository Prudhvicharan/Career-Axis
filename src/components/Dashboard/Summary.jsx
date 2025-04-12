// src/components/Dashboard/Summary.jsx
import React from "react";
import { EMAIL_CATEGORIES } from "../Classification/Categories";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const Summary = ({ emails, setFilter }) => {
  // Count emails by category
  const categoryCounts = Object.values(EMAIL_CATEGORIES).reduce(
    (acc, category) => {
      acc[category] = 0;
      return acc;
    },
    {}
  );

  emails.forEach((email) => {
    categoryCounts[email.category] = (categoryCounts[email.category] || 0) + 1;
  });

  // Convert to array for chart
  const chartData = Object.entries(categoryCounts)
    .filter(([_, count]) => count > 0)
    .map(([name, value]) => ({ name, value }));

  // Colors for chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#FF3333",
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Today's Summary</h2>

      <div className="mb-4">
        <p className="text-lg font-semibold">Total Emails: {emails.length}</p>
      </div>

      {chartData.length > 0 ? (
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>No emails received today.</p>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Filter by Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => setFilter("all")}
            className="w-full px-3 py-2 text-left rounded hover:bg-gray-100"
          >
            All Emails
          </button>

          {Object.values(EMAIL_CATEGORIES).map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className="w-full px-3 py-2 text-left rounded hover:bg-gray-100 flex justify-between"
            >
              <span>{category}</span>
              <span className="bg-blue-100 text-blue-800 px-2 rounded-full">
                {categoryCounts[category] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Summary;
