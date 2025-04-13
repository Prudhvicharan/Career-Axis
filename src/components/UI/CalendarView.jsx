import React, { useState } from "react";

const CalendarView = ({ events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper functions to compute calendar values.
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const formatDateDisplay = (date) =>
    new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
      date
    );

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  // Create an array for the calendar grid (null for empty leading cells)
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  // Get events for a given day.
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

  const today = new Date();
  const isToday = (date) =>
    date &&
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  // Use custom palette for event colors.
  const getEventColor = (type) => {
    switch (type) {
      case "interview":
        return "bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]";
      case "deadline":
        return "bg-[#FEF2F2] text-[#DC2626] border-[#FEE2E2]";
      case "followup":
        return "bg-[#E0F2FE] text-[#2563EB] border-[#BAE6FD]";
      case "assessment":
        return "bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7]";
      case "applied":
        return "bg-[#EEF2FF] text-[#4F46E5] border-[#BFDBFE]";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Calendar Header */}
      <div className="px-4 py-3 border-b border-[#A4AC86]/60 flex items-center justify-between bg-white">
        <h2 className="text-lg font-semibold text-[#111827]">
          {formatDateDisplay(currentMonth)}
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-md text-[#656D4A] hover:text-[#414833] hover:bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="p-1.5 rounded-md text-[#656D4A] hover:text-[#414833] hover:bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

      {/* Day Names */}
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

      {/* Calendar Grid */}
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
                        )} border-solid`}
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
