import React from "react";

const Roaming = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        className="bg-gradient-to-r from-blue-500 to-indigo-500 p-8 rounded-2xl shadow-2xl flex flex-col items-center border border-blue-300 backdrop-blur-md"
      >
        {/* Modern animated spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-blue-300"></div>
          <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
          <div className="absolute inset-3 rounded-full border-4 border-blue-200 border-b-transparent animate-spin-reverse"></div>
        </div>

        {/* Pulsing text with gradient */}
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 font-semibold text-lg mt-4 animate-pulse">
          Processing...
        </p>

        {/* Animated progress bar */}
        <div className="w-48 h-2 bg-blue-300 rounded-full mt-4 overflow-hidden backdrop-blur-sm">
          <div className="h-full bg-gradient-to-r from-white to-blue-200 rounded-full animate-progress"></div>
        </div>

        {/* Optional status message */}
        <p className="text-blue-100 text-sm mt-3">
          Please wait..
        </p>
      </div>
    </div>
  );
};

export default Roaming;