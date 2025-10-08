"use client";

import {useProjectStore } from "@/zustand/useProjectStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Clock, Calendar, ArrowRight, TrendingUp } from "lucide-react";
import { useProfileStore } from "@/zustand/userProfileStore";
import { projects } from "@/types/bonhive-types";

const Page = () => {
  const { projects} = useProjectStore();
  const{user} = useProfileStore()
  const router = useRouter();
  const [highPriority, setHighPriority] = useState<projects[]>([]);
  const [mediumPriority, setMediumPriority] = useState<projects[]>([]);
  const [lowPriority, setLowPriority] = useState<projects[]>([]);
  const [veryLowPriority, setVeryLowPriority] = useState<projects[]>([]);
  const [fullProject, setFullProject] = useState<projects[]>([]);
  const [totalProjectLen, setTotalProjectLen] = useState(0);

  useEffect(() => {
    const organizeProjects = () => {
      if (!projects || !Array.isArray(projects)) {
        setHighPriority([]);
        setMediumPriority([]);
        setLowPriority([]);
        setVeryLowPriority([]);
        setFullProject([]);
        setTotalProjectLen(0);
        return;
      }

      const divide = Math.max(1, Math.round((projects.length * 25) / 100));

      const sortedArray = projects
        .filter((project) => project.status === "progress")
        .sort(
          (a, b) =>
            new Date(a.duration).getTime() - new Date(b.duration).getTime()
        );

      setTotalProjectLen(sortedArray.length);

      if (sortedArray.length < 4) {
        setFullProject(sortedArray);
        setHighPriority([]);
        setMediumPriority([]);
        setLowPriority([]);
        setVeryLowPriority([]);
      } else {
        setHighPriority(sortedArray.slice(0, divide));
        setMediumPriority(sortedArray.slice(divide, divide * 2));
        setLowPriority(sortedArray.slice(divide * 2, divide * 3));
        setVeryLowPriority(sortedArray.slice(divide * 3));
        setFullProject([]);
      }
    };

    organizeProjects();
  }, [projects]);

  const requestToProjectId = (projectId: string) => {
    if (!projectId) return;
    router.push(`/dashboard/projects/${projectId}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const PrioritySection = ({ 
    projects, 
    title, 
    color, 
    delay = 0,
    gradient 
  }: { 
    projects: projects[];
    title: string;
    color: string;
    delay?: number;
    gradient: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className={`${gradient} px-6 py-5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          <span className="text-sm bg-white/20 px-4 py-2 rounded-full text-white font-medium">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            onClick={() => requestToProjectId(project._id)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`border-2 ${color} bg-white rounded-xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 group border-l-4`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {project.projectName}
                </h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {project.desc || "No description available"}
                </p>
                <div className="flex items-center mt-4 space-x-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span>{formatDate(project.duration)}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    <span>{project.clientName}</span>
                  </div>
                </div>
                {project?.bidAmount > 0 && (
                  <div className="mt-3 text-sm font-medium text-gray-700">
                    Budget: {user.userLanguage} {project?.bidAmount.toLocaleString()}
                  </div>
                )}
              </div>
              <ArrowRight 
                size={18} 
                className="text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all flex-shrink-0 ml-3" 
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 p-4 md:p-8">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center space-x-4 mb-2">
          <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
            <TrendingUp size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Task Management Dashboard
            </h1>
            <p className="text-gray-600 text-lg mt-1">Manage your projects efficiently with priority-based allocation</p>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Wheel Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Clock size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Time Allocation</h2>
            </div>

            {/* Priority Wheel */}
            <div className="relative w-72 h-72 mx-auto mb-8">
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white">
                {fullProject.length > 0 ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white p-3 group hover:scale-105 transition-transform duration-300">
                    <div className="bg-white/20 rounded-full p-3 mb-2">
                      <TrendingUp size={20} />
                    </div>
                    <span className="font-bold text-sm">All Projects</span>
                    <span className="text-xs opacity-90">
                      {fullProject.length} project{fullProject.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-red-500 to-pink-600 flex flex-col items-center justify-center text-white p-3 group hover:scale-105 transition-transform duration-300">
                      <div className="bg-white/20 rounded-full p-3 mb-2">
                        <TrendingUp size={20} />
                      </div>
                      <span className="font-bold text-sm">High</span>
                      <span className="text-xs opacity-90">
                        {highPriority.length} project{highPriority.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-amber-500 to-orange-600 flex flex-col items-center justify-center text-white p-3 group hover:scale-105 transition-transform duration-300">
                      <div className="bg-white/20 rounded-full p-3 mb-2">
                        <TrendingUp size={20} />
                      </div>
                      <span className="font-bold text-sm">Medium</span>
                      <span className="text-xs opacity-90">
                        {mediumPriority.length} project{mediumPriority.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-emerald-500 to-green-600 flex flex-col items-center justify-center text-white p-3 group hover:scale-105 transition-transform duration-300">
                      <div className="bg-white/20 rounded-full p-3 mb-2">
                        <TrendingUp size={20} />
                      </div>
                      <span className="font-bold text-sm">Low</span>
                      <span className="text-xs opacity-90">
                        {lowPriority.length} project{lowPriority.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-slate-500 to-slate-700 flex flex-col items-center justify-center text-white p-3 group hover:scale-105 transition-transform duration-300">
                      <div className="bg-white/20 rounded-full p-3 mb-2">
                        <TrendingUp size={20} />
                      </div>
                      <span className="font-bold text-sm">Very Low</span>
                      <span className="text-xs opacity-90">
                        {veryLowPriority.length} project{veryLowPriority.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </>
                )}

                {/* Center Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center text-gray-900 border border-gray-200">
                    <span className="text-sm font-semibold opacity-90">Total</span>
                    <span className="text-xl font-bold">{totalProjectLen}</span>
                    <span className="text-xs opacity-75">projects</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {fullProject.length > 0 ? (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 mr-3 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      All Projects
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full border">
                    {fullProject.length}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 mr-3 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">
                        High Priority
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full border">
                      {highPriority.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-amber-500 mr-3 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">
                        Medium Priority
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full border">
                      {mediumPriority.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 mr-3 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">
                        Low Priority
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full border">
                      {lowPriority.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-slate-500 mr-3 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">
                        Very Low Priority
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full border">
                      {veryLowPriority.length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Projects List */}
        <div className="lg:col-span-2 space-y-6">
          {fullProject.length > 0 ? (
            <PrioritySection
              projects={fullProject}
              title="All Projects"
              color="border-l-blue-500 border-blue-200"
              gradient="bg-gradient-to-r from-blue-500 to-purple-600"
            />
          ) : (
            <>
              {highPriority.length > 0 && (
                <PrioritySection
                  projects={highPriority}
                  title="High Priority Projects"
                  color="border-l-red-500 border-red-200"
                  gradient="bg-gradient-to-r from-red-500 to-pink-600"
                />
              )}
              {mediumPriority.length > 0 && (
                <PrioritySection
                  projects={mediumPriority}
                  title="Medium Priority Projects"
                  color="border-l-amber-500 border-amber-200"
                  delay={0.1}
                  gradient="bg-gradient-to-r from-amber-500 to-orange-600"
                />
              )}
              {lowPriority.length > 0 && (
                <PrioritySection
                  projects={lowPriority}
                  title="Low Priority Projects"
                  color="border-l-emerald-500 border-emerald-200"
                  delay={0.2}
                  gradient="bg-gradient-to-r from-emerald-500 to-green-600"
                />
              )}
              {veryLowPriority.length > 0 && (
                <PrioritySection
                  projects={veryLowPriority}
                  title="Very Low Priority Projects"
                  color="border-l-slate-500 border-slate-200"
                  delay={0.3}
                  gradient="bg-gradient-to-r from-slate-500 to-slate-700"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;