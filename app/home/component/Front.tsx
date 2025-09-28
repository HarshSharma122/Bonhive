import React from "react";
import Image from "next/image";
import img from '../../../public/bonhive_Dash_first.png'




const Front = () => {
  return (
    <div className="flex items-center mt-16 flex-col gap-10 py-8 px-4">
      <div className="flex items-center justify-center flex-col text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">Bonhive</h1>

        <h2 className="text-lg text-gray-600 mt-2">(CRM for Freelancers)</h2>

        <h2 className="text-xl font-semibold mt-4 border-b border-gray-400 pb-2">
          We follow this line:{" "}
          <span className="font-bold text-blue-700">
            Spend more time creating, less time managing
          </span>
        </h2>
      </div>

      {/* four boxes */}
      <div className="flex flex-col md:flex-row items-center gap-5 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border w-24 h-24 flex items-center justify-center border-gray-200 shadow-md font-semibold text-gray-600 rounded-lg transition-all hover:shadow-lg hover:border-blue-300">
            Time
          </div>
          <div className="border w-24 h-24 flex items-center justify-center border-gray-200 shadow-md font-semibold text-gray-600 rounded-lg transition-all hover:shadow-lg hover:border-blue-300">
            Stress
          </div>
          <div className="border w-24 h-24 flex items-center justify-center border-gray-200 shadow-md font-semibold text-gray-600 rounded-lg transition-all hover:shadow-lg hover:border-blue-300">
            Efficiency
          </div>
          <div className="border w-24 h-24 flex items-center justify-center border-gray-200 shadow-md font-semibold text-gray-600 rounded-lg transition-all hover:shadow-lg hover:border-blue-300">
            Memory
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-6 h-11 bg-blue-600 rounded-sm"></div>
            <div className="w-4 h-10 bg-blue-600 rounded-sm self-end"></div>
          </div>
          <h1 className="text-gray-900 text-xl font-bold">Management</h1>
        </div>
      </div>

      {/* for images */}
      <div className="mt-8 mx-4 md:mx-10 lg:flex hidden  border-l-4 pl-2 border-blue-500 max-w-4xl">
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
          <Image 
            src={img} 
            alt="Bonhive dashboard interface" 
            // fill
            style={{objectFit: "contain"}}
          />
        </div>
      </div>
    </div>
  );
};

export default Front;