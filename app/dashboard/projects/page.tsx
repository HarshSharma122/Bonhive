"use client";

import Roaming from "@/components/Roaming";
import { color, projects, Status, user } from "@/types/bonhive-types";
import { fetchProjects } from "@/utilis/fetchData";
import { formatPrice } from "@/utilis/formatPrice";
import {useProjectStore } from "@/zustand/useProjectStore";
import { useProfileStore} from "@/zustand/userProfileStore";
import { useSonnerDetailsStore } from "@/zustand/useSonnerDetailsStore";
import { Funnel, MoreVertical, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useEffect, useState } from "react";
import useSWR from "swr";

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
    <button
    onClick={onclick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
      active
      ? "bg-gray-800 text-white border-gray-800 shadow-md"
      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
      }`}
    >
      {label
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}
    </button>
  );
};


const StatusBadge = ({ status }: { status: Status }) => {
  const statusColors: color = {
    "proposal-sent": "bg-gray-100 text-gray-800 border border-gray-300",
    negotiation: "bg-gray-100 text-gray-800 border border-gray-300",
    accepted: "bg-gray-800 text-white border border-gray-900",
    rejected: "bg-gray-100 text-gray-800 border border-gray-300",
    "on-hold": "bg-gray-100 text-gray-800 border border-gray-300",
    paid: "bg-gray-800 text-white border border-gray-900",
    lead: "bg-gray-100 text-gray-800 border border-gray-300",
    pending: "bg-gray-100 text-gray-800 border border-gray-300",
    completed: "bg-gray-800 text-white border border-gray-900",
    progress: "bg-gray-100 text-gray-800 border border-gray-300",
    review: "bg-gray-100 text-gray-800 border border-gray-300",
    "payment pending": "bg-gray-100 text-gray-800 border border-gray-300",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-medium ${
        statusColors[status] || "bg-gray-100 text-gray-800 border border-gray-300"
        }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
    </span>
  );
};

const ProjectCard = ({
  project,
  onClick,
  user,
}: {
  project: projects;
  onClick: () => void;
  user: user;
}) => {
  return (
    <div
    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer hover:border-gray-300 hover:shadow-md"
      onClick={onClick}
      >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate hover:text-gray-700 transition-colors">
              {project.projectName}
            </h3>
            <p className="text-sm text-gray-700 mt-1 truncate">
              {project.clientName}
            </p>
          </div>
          <button className="text-gray-600 hover:text-gray-800 p-1 rounded-lg hover:bg-gray-100">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={project.status} />
          <div className="flex items-center text-xs bg-gray-100 text-gray-800 border border-gray-300 rounded-md px-2 py-1">
            <span className="mr-1">Hourly:</span>
            <span>{project.IshourBillable ? "Yes" : "No"}</span>
          </div>
        </div>

        {project.leadSource && (
          <div className="mb-4">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-300">
              {project.leadSource}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-700 mb-1">Client Budget</p>
            <p className="font-medium text-gray-900">
              {user?.userLanguage}{" "}
              {formatPrice(project.clientBudget).toString() || "N/A"}
            </p>
          </div>

          {project.bidAmount > 0 ? (
            <div>
              <p className="text-xs text-gray-700 mb-1">Your Bid</p>
              <p className="font-medium text-gray-900">
                {user?.userLanguage}{" "}
                {formatPrice(project.bidAmount).toString() || "N/A"}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-700 mb-1">Hourly rate</p>
              <p className="font-medium text-gray-900">
                {user?.userLanguage}{" "}
                {formatPrice(project.hourlyRate)?.toString() || "N/A"}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-700 mb-1">Timeline</p>
            <p className="font-medium text-gray-900 text-sm">
              {project.duration || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-700 mb-1">Location</p>
            <p className="font-medium text-gray-900 text-sm truncate">
              {project.location || "Remote"}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <div className="flex flex-col space-y-2">
            {project.contact && (
              <h3 className="text-xs p-1.5 rounded bg-gray-100 text-gray-800 border border-gray-300">
                📞 Call : {project.contact}
              </h3>
            )}
            {project.email && (
              <h3 className="text-xs p-1.5 rounded bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200">
                ✉️ Email : {project.email}
              </h3>
            )}
          </div>
          <button className="text-xs font-medium text-gray-900 hover:text-gray-700 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const { projects, addProjects } = useProjectStore();
  const router = useRouter();
  const { user } = useProfileStore();
    const { sonnerDetails, addSonnerDetails } = useSonnerDetailsStore();
  
  
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
  

  const { data: session } = useSession();
  
  // Fetch user data
  const { data: projectData, error: projectError } = useSWR(
    session ? "/api/projects" : null,
    fetchProjects
  );
  
  useEffect(() => {
    if (projectData) addProjects(projectData);
    else if (projectError) addSonnerDetails("you are not authenticated");
  }, [projectData, addProjects, projectError]);

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

      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-700">
                Manage your projects and track their status
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-lg transition-all duration-300"
              >
                <span>Filters</span>
                <Funnel size={16} />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-8">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Filter by Status</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-600 hover:text-gray-800"
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
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-700">
              {filteredProjects?.length}{" "}
              {filteredProjects?.length === 1 ? "project" : "projects"} found
            </p>
            {filterQuery !== "all" && (
              <button
                onClick={() => setFilterQuery("all")}
                className="text-sm text-gray-900 hover:text-gray-700 flex items-center gap-1 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100"
              >
                Clear filter
                <X size={16} />
              </button>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-gray-700 text-sm">Total Projects</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {projects?.length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-gray-700 text-sm">Total Budget</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {user?.userLanguage}{" "}
                {formatPrice(
                  filteredProjects.reduce((acc, client) => acc + client.clientBudget, 0)
                ).toString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-gray-700 text-sm">Total Hours</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(
                  filteredProjects.reduce(
                    (acc, client) => acc + client.totalHour,
                    0
                  ) || 0
                ).toFixed(1)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-gray-700 text-sm">Total Minutes</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(
                  filteredProjects.reduce(
                    (acc, client) => acc + client.totalMin,
                    0
                  ) || 0
                ).toFixed(1)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-gray-700 text-sm">Total Seconds</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project._id || index}
                  project={project}
                  onClick={() => navigateToProject(project._id)}
                  user={user}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300">
                  <Funnel className="text-gray-700" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-700 mb-6">
                  Try adjusting your search or filter criteria to find what you
                  are looking for.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setFilterQuery("all");
                  }}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 border border-gray-800"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;