import React, { useState } from "react";

const CalendarView = ({ events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Function to get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to get day of week of first day in month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Go to previous month
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // Go to next month
  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Calendar data setup
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  // Generate dates for calendar
  const calendarDays = [];

  // Add empty cells for days before first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  // Find events for each day
  const getEventsForDay = (date) => {
    if (!date) return [];

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  // Get today
  const today = new Date();
  const isToday = (date) => {
    if (!date) return false;
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // Get event color based on type
  const getEventColor = (eventType) => {
    switch (eventType) {
      case "interview":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "deadline":
        return "bg-red-100 text-red-800 border-red-200";
      case "followup":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "assessment":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {formatDate(currentMonth)}
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date())}
            className="px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-900 focus:outline-none"
          >
            Today
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-px border-b border-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div
            key={dayName}
            className="px-2 py-2 text-center text-xs font-medium text-gray-500"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {calendarDays.map((date, index) => {
          const dayEvents = getEventsForDay(date);

          return (
            <div
              key={index}
              className={`min-h-[100px] bg-white ${date ? "p-2" : ""}`}
            >
              {date && (
                <>
                  <div
                    className={`text-right ${
                      isToday(date)
                        ? "bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto"
                        : "text-gray-700"
                    }`}
                  >
                    {date.getDate()}
                  </div>

                  <div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto">
                    {dayEvents.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`px-2 py-1 text-xs rounded truncate border ${getEventColor(
                          event.type
                        )}`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
