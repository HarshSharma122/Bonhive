import React from "react";

const Roaming = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center transform transition-all duration-300 scale-100 animate-fade-in">
        {/* Modern animated spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <div className="absolute inset-3 rounded-full border-4 border-blue-300 border-b-transparent animate-spin-reverse"></div>
        </div>

        {/* Pulsing text with gradient */}
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-lg mt-4 animate-pulse">
          Bonhive: A freelancer CRM
        </p>

        {/* Animated progress bar */}
        <div className="w-48 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progress"></div>
        </div>

        {/* Optional status message */}
        <p className="text-gray-500 text-sm mt-3">Please wait....</p>
      </div>
    </div>
  );
};

export default Roaming;
