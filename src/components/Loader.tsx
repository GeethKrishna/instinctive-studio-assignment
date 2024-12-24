import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-4 border-gray-300 border-t-blue-500 animate-spin"></div>
      </div>
      <p className="mt-4 text-lg font-medium text-gray-600">Loading...</p>
    </div>
  );
};

export default Loader;
