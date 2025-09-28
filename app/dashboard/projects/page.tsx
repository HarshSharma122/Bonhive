"use client";

import Roaming from "@/components/Roaming";
import { useCurrencyPrefStore } from "@/zustand/useCurrencyprefStore";
import { projects, useProjectStore } from "@/zustand/useProjectStore";
import { AnimatePresence, motion } from "framer-motion";
import { Funnel, MoreVertical, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useEffect, useState } from "react";

const FilterPill = ({
  label,
  active = false,
  onclick,
}: {
  label: string;
  active?: boolean;
  onclick?: MouseEventHandler;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onclick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-[#0096c7] text-white shadow-md"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
      }`}
    >
      {label
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}
    </motion.button>
  );
};


type color = {
  "proposal-sent": string;
  negotiation: string;
  accepted: string;
  rejected: string;
  "on-hold":string;
  paid: string;
  lead: string;
  pending: string;
  completed: string;
  progress: string;
  review: string;
  "payment pending": string;
};

type Status = keyof color;

const StatusBadge = ({ status }: { status: Status}) => {
  const statusColors: color = {
    "proposal-sent":
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    negotiation:
      "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
    accepted:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    "on-hold":
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    paid: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
    lead: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    review:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "payment pending":
      "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-medium ${
        statusColors[status] || "bg-gray-700"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
    </span>
  );
};

const ProjectCard = ({
  project,
  onClick,
}: {
  project: projects;

  onClick: () => void;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-white truncate group-hover:text-blue-400 transition-colors">
              {project.projectName}
            </h3>
            <p className="text-sm text-gray-400 mt-1 truncate">
              {project.clientName}
            </p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={project.status} />
          <div className="flex items-center text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-md px-2 py-1">
            <span className="mr-1">Hourly:</span>
            <span>{project.IshourBillable ? "Yes" : "No"}</span>
          </div>
        </div>

        {project.leadSource && (
          <div className="mb-4">
            <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
              {project.leadSource}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Client Budget
            </p>
            <p className="font-medium text-white">
              ₹{project.clientBudget?.toLocaleString() || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Your Bid</p>
            <p className="font-medium text-white">
              ₹{project.bidAmount?.toLocaleString() || "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Timeline</p>
            <p className="font-medium text-white text-sm">
              {project.duration || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Location</p>
            <p className="font-medium text-white text-sm truncate">
              {project.location || "Remote"}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
          <div className="flex flex-col  space-x-2 space-y-2">
            {project.contact && (
              <h3 className="text-xs p-1.5 rounded  bg-gray-600">
                📞 Call : {project.contact}
              </h3>
            )}
            {project.email && (
              <h3 className="text-xs p-1.5 rounded bg-gray-700 hover:bg-gray-600">
                ✉️ Email : {project.email}
              </h3>
            )}
          </div>
          <button className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Page = () => {
  const { projects } = useProjectStore();
  const router = useRouter();
  const { currencyPref } = useCurrencyPrefStore();
  const [isRoaming, setIsRoaming] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [filterQuery, setFilterQuery] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const filters = [
    "all",
    "lead",
    "proposal-sent",
    "negotiation",
    "accepted",
    "rejected",
    "progress",
    "on-hold",
    "review",
    "completed",
    "paid",
    "payment pending",
  ];

  useEffect(() => {
    let result = projects;

    // Apply status filter
    if (filterQuery !== "all") {
      result = result.filter((project) => project.status === filterQuery);
    }
    setFilteredProjects(result);
  }, [projects, filterQuery, search]);

  const navigateToProject = (id: string) => {
    router.push(`/dashboard/projects/${id}`);
    setIsRoaming(true);
  };

  return (
    <>
      {isRoaming && <Roaming />}

      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Projects</h1>
              <p className="text-gray-400">
                Manage your projects and track their status
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0096c7] hover:scale-105  text-white rounded-lg transition-all duration-300"
              >
                <span>Filters</span>
                <Funnel size={16} />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-white">Filter by Status</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {filters.map((filter) => (
                      <FilterPill
                        key={filter}
                        onclick={() => {
                          setFilterQuery(filter);
                          if (window.innerWidth < 768) setShowFilters(false);
                        }}
                        label={filter}
                        active={filterQuery === filter}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400">
              {filteredProjects?.length}{" "}
              {filteredProjects?.length === 1 ? "project" : "projects"} found
            </p>
            {filterQuery !== "all" && (
              <button
                onClick={() => setFilterQuery("all")}
                className="text-sm text-[#0096c7]  hover:text-blue-800  flex items-center gap-1"
              >
                Clear filter
                <X size={16} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-xl shadow-sm">
              <h3 className="text-gray-400 text-sm">Total Projects</h3>
              <p className="text-2xl font-bold text-white mt-1">
                {projects?.length}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl shadow-sm">
              <h3 className="text-gray-400 text-sm">Total Budget</h3>
              <p className="text-2xl font-bold text-white mt-1">
                {currencyPref}{" "}
                {filteredProjects
                  .reduce((acc, client) => acc + client.clientBudget, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl shadow-sm">
              <h3 className="text-gray-400 text-sm">total Hour</h3>
              <div className="flex items-center mt-1">
                <span className="ml-2 text-white">
                  {(
                    filteredProjects.reduce(
                      (acc, client) => acc + client.totalHour,
                      0
                    ) || 0
                  ).toFixed(1)}
                </span>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl shadow-sm">
              <h3 className="text-gray-400 text-sm">Total Min</h3>
              <p className="text-2xl font-bold text-white mt-1">
                {(
                  filteredProjects.reduce(
                    (acc, client) => acc + client.totalMin,
                    0
                  ) || 0
                ).toFixed(1)}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl shadow-sm">
              <h3 className="text-gray-400 text-sm">Total Sec</h3>
              <p className="text-2xl font-bold text-white mt-1">
                {(
                  filteredProjects.reduce(
                    (acc, client) => acc + client.totalSec,
                    0
                  ) || 0
                ).toFixed(1)}
              </p>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects?.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project._id || index}
                  project={project}
                  onClick={() => navigateToProject(project._id)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <Funnel className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No projects found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search or filter criteria to find what you
                  are looking for.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setFilterQuery("all");
                  }}
                  className="px-4 py-2 bg-[#0096c7] hover:scale-105 text-white rounded-lg transition-all duration-300"
                >
                  Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
