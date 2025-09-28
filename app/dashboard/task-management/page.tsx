"use client";

import { projects, useProjectStore } from "@/zustand/useProjectStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { projects, addProjects } = useProjectStore();
  const router = useRouter();
  const [highPriority, setHighPriority] = useState<projects[]>([]);
  const [mediumPriority, setMediumPriority] = useState<projects[]>([]);
  const [lowPriority, setLowPriority] = useState<projects[]>([]);
  const [veryLowPriority, setVeryLowPriority] = useState<projects[]>([]);
  const [fullProject, setFullProject] = useState<projects[]>([]);
  const [totalProjectLen, setTotalProjectLen] = useState(0);
  useEffect(() => {
    const fn = () => {
      const divide = Math.round((projects?.length * 25) / 100);

      const sortedArray = projects
        .filter((fil) => fil.status == "progress")
        .sort(
          (a,b) =>
            (new Date(a.duration).getTime()) - (new Date(b.duration).getTime())
        );
      setTotalProjectLen(sortedArray.length);

      if (sortedArray.length < 4) {
        setFullProject(sortedArray);
      } else {
        setHighPriority(sortedArray.slice(0, divide));
        setMediumPriority(sortedArray.slice(divide, divide * 2));
        setLowPriority(sortedArray.slice(divide * 2, divide * 3));
        setVeryLowPriority(sortedArray.slice(divide * 3));
      }
    };

    fn();
  }, [projects, addProjects]);

  const requestToProjectId = (params: string) => {
    router.push(`/dashboard/projects/${params}`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-50">
          Task Management Dashboard
        </h1>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Wheel Card */}
        <div className="lg:col-span-1">
          <div className="bg-gray-100 rounded-xl shadow-sm border border-slate-200 p-6 h-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Time Allocation
            </h2>

            <div className="relative w-64 h-64 mx-auto mb-6">
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg">
                {fullProject.length ? (
                  <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-red-600 to-red-700 flex flex-col items-center justify-center text-white p-2">
                    <span className="font-bold text-sm">In One Go</span>
                    <span className="text-xs">
                      {fullProject.length} project
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-red-600 to-red-700 flex flex-col items-center justify-center text-white p-2">
                      <span className="font-bold text-sm">High</span>
                      <span className="text-xs">
                        {highPriority.length} project
                      </span>
                    </div>

                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-amber-500 to-amber-600 flex flex-col items-center justify-center text-white p-2">
                      <span className="font-bold text-sm">Medium</span>
                      <span className="text-xs">
                        {mediumPriority.length} project
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-emerald-500 to-emerald-600 flex flex-col items-center justify-center text-white p-2">
                      <span className="font-bold text-sm">Low</span>
                      <span className="text-xs">
                        {lowPriority.length} project
                      </span>
                    </div>

                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-slate-500 to-slate-600 flex flex-col items-center justify-center text-white p-2">
                      <span className="font-bold text-sm">Very Low</span>
                      <span className="text-xs">
                        {veryLowPriority.length} project
                      </span>
                    </div>
                  </>
                )}

                {/* Center Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white shadow-lg flex flex-col items-center justify-center text-slate-800 border border-slate-200">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="text-lg font-bold">
                      {totalProjectLen} project
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {fullProject.length ? (
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-600 mr-2 rounded"></div>
                    <span className="text-sm font-medium text-slate-700">
                      In One Go
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {fullProject.length} project
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-600 mr-2 rounded"></div>
                      <span className="text-sm font-medium text-slate-700">
                        High Priority
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {highPriority.length} project
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-amber-500 mr-2 rounded"></div>
                      <span className="text-sm font-medium text-slate-700">
                        Medium Priority
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {mediumPriority.length} project
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 mr-2 rounded"></div>
                      <span className="text-sm font-medium text-slate-700">
                        Low Priority
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {lowPriority.length} project
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-slate-500 mr-2 rounded"></div>
                      <span className="text-sm font-medium text-slate-700">
                        Very Low Priority
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {veryLowPriority.length} project
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="lg:col-span-2 space-y-6">
          {fullProject.length ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-5 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Projects</h2>
                  <span className="text-sm bg-red-800/90 px-3 py-1 rounded-full text-white">
                    {fullProject.length} projects · {fullProject.length} Project
                  </span>
                </div>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {fullProject.map((project, index) => (
                  <motion.div
                    key={index}
                    onClick={() => requestToProjectId(project._id)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-red-200 bg-red-50 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 flex justify-between"
                  >
                    <div className="">
                      <h3 className="font-medium text-red-900">
                        {project.projectName}
                      </h3>
                      <div className="flex items-center mt-2 text-xs text-red-700/80">
                        <span>Duration: {project.duration}</span>
                      </div>
                      
                     

                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                      High Priority Projects
                    </h2>
                    <span className="text-sm bg-red-800/90 px-3 py-1 rounded-full text-white">
                      {highPriority.length} projects ·{" "}
                    </span>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highPriority.map((project, index) => (
                    <motion.div
                      key={index}
                      onClick={() => requestToProjectId(project._id)}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-red-200 bg-red-50 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 flex justify-between"
                    >
                      <div className="">
                        <h3 className="font-medium text-red-900">
                          {project.projectName}
                        </h3>
                        <div className="flex items-center mt-2 text-xs text-red-700/80">
                          <span>Duration: {project.duration}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                      Medium Priority Projects
                    </h2>
                    <span className="text-sm bg-amber-600 px-3 py-1 rounded-full text-white">
                      {mediumPriority.length} projects ·{" "}
                    </span>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mediumPriority.map((project, index) => (
                    <motion.div
                      key={index}
                      onClick={() => requestToProjectId(project._id)}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-amber-200 bg-amber-50 rounded-lg p-4 hover:shadow-md flex transition-all duration-300 cursor-pointer hover:-translate-y-1 justify-between"
                    >
                      <div className="">
                        <h3 className="font-medium text-red-900">
                          {project.projectName}
                        </h3>
                        <div className="flex items-center mt-2 text-xs text-red-700/80">
                          <span>Duration: {project.duration}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                      Low Priority Projects
                    </h2>
                    <span className="text-sm bg-emerald-600 px-3 py-1 rounded-full text-white">
                      {lowPriority.length} projects ·{" "}
                    </span>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lowPriority.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      onClick={() => requestToProjectId(project._id)}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-emerald-200 bg-emerald-50 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 flex justify-between"
                    >
                      <div className="">
                        <h3 className="font-medium text-red-900">
                          {project.projectName}
                        </h3>
                        <div className="flex items-center mt-2 text-xs text-red-700/80">
                          <span>Duration: {project.duration}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-slate-500 to-slate-600 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                      Very Low Priority Projects
                    </h2>
                    <span className="text-sm bg-slate-600 px-3 py-1 rounded-full text-white">
                      {veryLowPriority.length} projects ·{" "}
                    </span>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {veryLowPriority.map((project, index) => (
                    <motion.div
                      key={index}
                      onClick={() => requestToProjectId(project._id)}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-slate-200 bg-slate-50 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 flex justify-between"
                    >
                      <div className="">
                        <h3 className="font-medium text-red-900">
                          {project.projectName}
                        </h3>
                        <div className="flex items-center mt-2 text-xs text-red-700/80">
                          <span>Duration: {project.duration}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
