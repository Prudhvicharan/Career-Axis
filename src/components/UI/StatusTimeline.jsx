import React from "react";

const StatusTimeline = ({ steps, currentStep }) => {
  return (
    <div className="py-4">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <div
              className={`flex flex-col items-center ${
                index < currentStep
                  ? "text-indigo-600"
                  : index === currentStep
                  ? "text-indigo-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  index < currentStep
                    ? "bg-indigo-600 border-indigo-600"
                    : index === currentStep
                    ? "bg-white border-indigo-600"
                    : "bg-white border-gray-300"
                }`}
              >
                {index < currentStep ? (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      index === currentStep
                        ? "text-indigo-600"
                        : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span className="mt-2 text-xs whitespace-nowrap">
                {step.name}
              </span>
              {step.date && (
                <span className="mt-1 text-xs text-gray-500">{step.date}</span>
              )}
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div
                  className={`h-0.5 ${
                    index < currentStep ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StatusTimeline;
