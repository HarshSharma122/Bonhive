"use client";
import { status } from "@/types/bonhive-types";
import { formatPrice } from "@/utilis/formatPrice";
import { useProjectStore } from "@/zustand/useProjectStore";
import { useProfileStore } from "@/zustand/userProfileStore";
import { BadgeDollarSign, Languages, SquareSigma, Target, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { FcServices } from "react-icons/fc";
import {
  FiBarChart2,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiDollarSign,
  FiEdit,
  FiFileText,
  FiList,
  FiPause,
  FiPlay,
  FiSave,
  FiTag,
  FiTarget,
  FiUser,
} from "react-icons/fi";
import { TiMediaRecord } from "react-icons/ti";

const Page = ({
  params,
}: {
  params: Promise<{ showprojectDetails: string }>;
}) => {
  const router = useRouter();
  const { showprojectDetails } = use(params);
  const { projects, addProjects } = useProjectStore();
  const [isRoaming, setIsRoaming] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [reminderDays, setReminderDays] = useState(0);
  const { user } = useProfileStore();

  const generateInvoice = async () => {
    router.push(`/invoice?invoiceid=${showprojectDetails}`);
  };

  useEffect(() => {
    const result = projects
      .filter((fil) => fil._id == showprojectDetails)
      .map((d) => d.status);
    setStatus(result[0]);
  }, [projects, addProjects]);

  useEffect(() => {
    const result = projects
      .filter((fil) => fil._id == showprojectDetails)
      .map((d) => d.duration);
    const som = result[0];
    if(!som) return;
    const todayDate = new Date();
    const setDate = new Date(som);

    todayDate.setHours(0, 0, 0, 0);
    setDate.setHours(0, 0, 0, 0);

    const firstDateInMs = todayDate.getTime();
    const secondDateInMs = setDate.getTime();

    console.log(firstDateInMs);
    console.log(secondDateInMs);

    const differenceBtwDates = secondDateInMs - firstDateInMs;
    const aDayInMs = 24 * 60 * 60 * 1000;

    const daysDiff = Math.round(differenceBtwDates / aDayInMs);

    setReminderDays(daysDiff);
  }, [projects]);

  const [inputValue, setInputValue] = useState({
    instructions: "",
    proposal: "",
    logs: "",
    logType: "",
    statusUpdate: "",
    service_name: "",
    service_type: "",
    service_price: "",
    tax_rate:"",
    service_duration: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const registerAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRoaming(true);
    try {
      const reponse = await fetch("/api/updateProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instructions: inputValue.instructions,
          proposal: inputValue.proposal,
          projectId: showprojectDetails,
          hour: hour,
          second: second,
          minute: min,
          markdown: inputValue.logs,
          statusUpdate: inputValue.statusUpdate,
          service_name: inputValue.service_name,
          service_type: inputValue.service_type,
          service_price: inputValue.service_price,
          service_duration: inputValue.service_duration,
          tax_rate:inputValue.tax_rate,
        }),
      });

      if (reponse.ok) {
        setTimeout(() => {
          setIsRoaming(false);
          setOpenMarkDown(false);
          router.push("/dashboard/");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [EditON, setEditON] = useState<boolean>(false);
  const [isTaxRate, setIsTaxRate] = useState<boolean>(false);
  const [openfolder, setOpenFolder] = useState<boolean>(false);
  const [opentime, setOpenTimer] = useState(false);
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);
  const [second, setSecond] = useState(0);
  const [stop, setStop] = useState<NodeJS.Timeout>();
  const [openMarkDown, setOpenMarkDown] = useState<boolean>(false);
  const [statusFolder, setStatusFolder] = useState<boolean>(false);

  const openDetailsFolder = () => {
    setOpenFolder(true);
  };

  const openStatusFolder = () => {
    setStatusFolder(true);
  };

  const StartTimer = () => {
    setOpenTimer(true);
    const interval = setInterval(() => {
      setSecond((prev) => prev + 1);
    }, 1000);
    setStop(interval);
  };

  const StopTimer = () => {
    setOpenTimer(false);
    clearInterval(stop);
  };

  useEffect(() => {
    if (openMarkDown) {
      clearInterval(stop);
    }
    if (second == 60) {
      setMin((prev) => prev + 1);
      setSecond(0);
    }
    if (min == 60) {
      setHour((prev) => prev + 1);
      setMin(0);
    }
  }, [second, min]);

  const getStatusColor = (status: string) => {
    const statusColors: Record<status, string> = {
      completed:
        "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm shadow-emerald-100",
      "in progress":
        "bg-blue-100 text-blue-800 border-blue-200 shadow-sm shadow-blue-100",
      pending:
        "bg-amber-100 text-amber-800 border-amber-200 shadow-sm shadow-amber-100",
      lead: "bg-purple-100 text-purple-800 border-purple-200 shadow-sm shadow-purple-100",
      "proposal-sent":
        "bg-indigo-100 text-indigo-800 border-indigo-200 shadow-sm shadow-indigo-100",
      negotiation:
        "bg-cyan-100 text-cyan-800 border-cyan-200 shadow-sm shadow-cyan-100",
      accepted:
        "bg-green-100 text-green-800 border-green-200 shadow-sm shadow-green-100",
      rejected:
        "bg-red-100 text-red-800 border-red-200 shadow-sm shadow-red-100",
      "on-hold":
        "bg-orange-100 text-orange-800 border-orange-200 shadow-sm shadow-orange-100",
      paid: "bg-lime-100 text-lime-800 border-lime-200 shadow-sm shadow-lime-100",
      progress:
        "bg-teal-100 text-teal-800 border-teal-200 shadow-sm shadow-teal-100",
      review:
        "bg-violet-100 text-violet-800 border-violet-200 shadow-sm shadow-violet-100",
      "payment pending":
        "bg-rose-100 text-rose-800 border-rose-200 shadow-sm shadow-rose-100",
    };

    return (
      statusColors[status?.toLowerCase() as status] ||
      "bg-gray-100 text-gray-800 border-gray-200 shadow-sm shadow-gray-100"
    );
  };

  // totalTime spend
  const totalTime = () => {
    let totalHour = hour;
    let totalMin = min;
    let totalSec = second;

    totalSec = projects
      .filter((filter) => filter._id == showprojectDetails)[0]
      ?.projectLogs?.map((n) => n.second)
      ?.reduce((callFn, inital) => callFn + inital, 0);
    totalMin = projects
      .filter((filter) => filter._id == showprojectDetails)[0]
      ?.projectLogs?.map((n) => n.minute)
      ?.reduce((callFn, inital) => callFn + inital, 0);
    totalHour = projects
      .filter((filter) => filter._id == showprojectDetails)[0]
      ?.projectLogs?.map((n) => n.hour)
      ?.reduce((callFn, inital) => callFn + inital, 0);

    totalMin += Math.floor(totalSec / 60);
    totalSec = totalSec % 60;
    totalHour += Math.floor(totalMin / 60);
    totalMin = totalMin % 60;

    return { totalHour, totalMin, totalSec };
  };

  const { totalHour, totalMin, totalSec } = totalTime();

  // Info cards data
  const infoCards = [
    {
      icon: FiUser,
      label: "Client",
      value: projects.find((p) => p._id === showprojectDetails)?.clientName,
      subvalue: projects.find((p) => p._id === showprojectDetails)?.email,
      color: "blue",
    },
    {
      icon: FiDollarSign,
      label: projects.find((p) => p._id === showprojectDetails)?.IshourBillable
        ? "Hourly Project"
        : "Bid Amount",
      value: projects.find((p) => p._id === showprojectDetails)?.IshourBillable
        ? `${user?.userLanguage} ${formatPrice(
            projects.find((p) => p._id === showprojectDetails)?.hourlyRate || 0
          ).toString()}/hour`
        : `${user?.userLanguage} ${formatPrice(
            projects.find((p) => p._id === showprojectDetails)?.bidAmount || 0
          ).toString()}`,
      subvalue: `Budget: ${user?.userLanguage} ${formatPrice(
        projects.find((p) => p._id === showprojectDetails)?.clientBudget || 0
      ).toString()}`,
      color: "green",
    },
    {
      icon: FiTag,
      label: "Reference",
      value: projects.find((p) => p._id === showprojectDetails)?.leadSource,
      color: "purple",
    },
    {
      icon: FiClock,
      label: "Total Time",
      value: `${totalHour}h ${totalMin}m ${totalSec}s`,
      color: "amber",
    },
    {
      icon: BadgeDollarSign,
      label: "Total Payment",
      value: `${user?.userLanguage} ${
        projects
          .find((p) => p._id === showprojectDetails)
          ?.totalBill?.toFixed(2) || "0.00"
      }`,
      color: "emerald",
    },
    {
      icon: TiMediaRecord,
      label: "Hourly Rate",
      value: `${user?.userLanguage} ${formatPrice(
        projects.find((p) => p._id === showprojectDetails)?.hourlyRate || 0
      ).toString()}`,
      color: "cyan",
    },
    {
      icon: Target,
      label: "Deadline",
      value: projects.find((p) => p._id === showprojectDetails)?.duration,
      color: "rose",
    },
    {
      icon: Languages,
      label: "Client Language",
      value: user?.userLanguage || "NA",
      color: "indigo",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white text-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
              Project Details
            </h1>
            <p className="mt-1 text-gray-600">
              Track progress and manage deliverables
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                reminderDays > 0
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm shadow-emerald-100"
                  : "bg-red-100 text-red-800 border border-red-200 shadow-sm shadow-red-100"
              }`}
            >
              {reminderDays > 0 ? (
                <span>⏳ {reminderDays} days left</span>
              ) : (
                <span>⚠️ Duration passed</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {opentime ? (
              <button
                onClick={StopTimer}
                className="px-4 py-2.5 text-sm flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-800 border border-red-200 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm shadow-red-100"
              >
                <FiPause size={16} />
                Stop Timer
              </button>
            ) : (
              <button
                onClick={StartTimer}
                className="px-4 py-2.5 text-sm flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm shadow-emerald-100"
              >
                <FiPlay size={16} />
                Start Timer
              </button>
            )}
            <button
              onClick={() => setOpenMarkDown(true)}
              className="px-4 py-2.5 text-sm flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-200 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm shadow-blue-100"
            >
              <FiEdit size={16} />
              Add Log
            </button>
            <button
              onClick={() => setEditON(true)}
              className="px-4 py-2.5 text-sm flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-200 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm shadow-purple-100"
            >
              <FcServices size={16} />
              Add Services
            </button>
            <button
              onClick={() => setIsTaxRate(true)}
              className="px-4 py-2.5 text-sm flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-200 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm shadow-purple-100"
            >
              <SquareSigma size={16} />
              Tax Rate {projects.find((p) => p._id === showprojectDetails)?.tax_rate}%
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Project Card */}
            {projects
              .filter((fil) => fil._id == showprojectDetails)
              .map((project, index) => (
                <div
                  key={index}
                  className="bg-white backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                            {project.projectName}
                          </h2>
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                              project.status
                            )}`}
                          >
                            {project.status.charAt(0).toUpperCase() +
                              project.status.slice(1)}
                          </span>
                          {project?.projectPriority && (
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                                project.status
                              )}`}
                            >
                              {project.projectPriority} Priority
                            </span>
                          )}
                        </div>
                        {project.desc && (
                          <p className="text-gray-600 text-sm mt-2">
                            {project.desc}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={openStatusFolder}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl border border-gray-300 transition-all duration-200 hover:scale-105"
                        >
                          <FiEdit size={14} />
                          Edit Status
                        </button>
                        {!project.instructions?.length &&
                          !project.proposal?.length && (
                            <button
                              onClick={openDetailsFolder}
                              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl border border-gray-300 transition-all duration-200 hover:scale-105"
                            >
                              <FiEdit size={14} />
                              Edit Details
                            </button>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {infoCards.map(
                      (item, idx) =>
                        item.value && (
                          <div
                            key={idx}
                            className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                          >
                            <div
                              className={`w-12 h-12 rounded-xl bg-${item.color}-100 flex items-center justify-center mr-4 border border-${item.color}-200`}
                            >
                              <item.icon
                                className={`text-${item.color}-600`}
                                size={20}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600">
                                {item.label}
                              </p>
                              <p className="font-semibold text-gray-900 text-lg">
                                {item.value}
                              </p>
                              {item.subvalue && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {item.subvalue}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                    )}
                  </div>

                  {/* Instructions & Proposal */}
                  {(project.instructions || project.proposal) && (
                    <div className="p-6 border-t border-gray-200">
                      {project.instructions && (
                        <div className="mb-6">
                          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                            <FiList className="text-blue-600" />
                            Client Instructions
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            {project.instructions
                              .split(",")
                              .map((ins, index) => (
                                <div
                                  key={index}
                                  className="flex items-start bg-blue-50 p-4 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200"
                                >
                                  <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-1 mr-3 mt-0.5">
                                    <FiCheckCircle size={14} />
                                  </span>
                                  <span className="text-gray-700 text-sm flex-1">
                                    {ins}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {project.proposal && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                            <FiFileText className="text-blue-600" />
                            Proposal
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {project.proposal}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

            {/* Services Section */}
            <div className="bg-white backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                  <FcServices className="text-2xl" />
                  Services
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {projects
                    .filter((fil) => fil._id == showprojectDetails)
                    .map((project, index) =>
                      project?.services?.length > 0 ? (
                        project.services.map((service, index) => (
                          <div
                            key={index}
                            className="flex gap-4 relative bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                          >
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-3">
                                <span className="text-sm font-semibold text-gray-900">
                                  {service.service_name}
                                </span>
                                <div className="flex flex-col items-end">
                                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                    {service.service_duration}
                                  </span>
                                  <span className="text-sm font-bold text-emerald-600 mt-1">
                                    {user?.userLanguage}{" "}
                                    {formatPrice(
                                      service.service_price
                                    ).toString()}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">
                                {service.service_type}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          key={index}
                          className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300"
                        >
                          <FcServices
                            className="mx-auto mb-3 text-gray-400"
                            size={32}
                          />
                          <p className="text-sm">No services added yet</p>
                          <p className="text-xs mt-1">
                            Add services like domain, hosting, etc.
                          </p>
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiClock className="text-blue-600" />
                Recent Activity
              </h2>
              <div className="space-y-6">
                {projects ? (
                  projects
                    .filter((fil) => fil._id == showprojectDetails)
                    .map((mark) =>
                      mark.projectLogs.map((logs, index) => (
                        <div key={index} className="flex gap-4 relative group">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center z-10 border border-blue-200 group-hover:bg-blue-200 transition-all duration-200">
                              <FiClipboard
                                className="text-blue-600"
                                size={18}
                              />
                            </div>
                            {index !== mark.projectLogs.length - 1 && (
                              <div className="w-0.5 h-16 bg-gray-300 absolute top-12 left-6"></div>
                            )}
                          </div>
                          <div className="flex-1 bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 group-hover:shadow-md">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                {new Date().toLocaleDateString()}
                              </span>
                              <div className="flex flex-col items-end">
                                <span className="text-xs font-medium text-gray-700">
                                  {logs.hour}h:{logs.minute}m:{logs.second}s
                                </span>
                                <span className="text-sm font-bold text-emerald-600 mt-1">
                                  {user.userLanguage} {logs.rate.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {logs.markdown}
                            </p>
                          </div>
                        </div>
                      ))
                    )
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <FiClipboard
                      className="mx-auto mb-4 text-gray-400"
                      size={32}
                    />
                    <p className="text-sm">No activity yet</p>
                    <p className="text-xs mt-1">
                      Start the timer and add logs to track your work
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Timer Card */}
            <div className="bg-white backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiClock className="text-blue-600" />
                Current Session
              </h2>
              <div className="text-center py-6">
                <div className="text-4xl font-bold text-gray-900 mb-3 font-mono bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {hour.toString().padStart(2, "0")}:
                  {min.toString().padStart(2, "0")}:
                  {second.toString().padStart(2, "0")}
                </div>
                <p className="text-sm text-gray-600">
                  Time spent on this session
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiTarget className="text-blue-600" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={generateInvoice}
                  className="w-full justify-start text-sm py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl border border-gray-300 transition-all duration-200 hover:scale-105 flex items-center gap-2"
                >
                  <FiFileText className="mr-2" />
                  Generate Invoice
                </button>
              </div>
            </div>

            {/* Project Stats */}
            <div className="bg-white backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiBarChart2 className="text-blue-600" />
                Project Stats
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    Total Time Invested
                  </p>
                  <p className="font-bold text-gray-900 text-xl">
                    {totalHour}h {totalMin}m {totalSec}s
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Activity Logs</p>
                  <p className="font-bold text-gray-900 text-xl">
                    {projects
                      .filter((fil) => fil._id == showprojectDetails)
                      .reduce(
                        (total, project) => total + project.projectLogs.length,
                        0
                      )}{" "}
                    entries
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {openfolder && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-300">
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit Project Details
                </h2>
                <button
                  onClick={() => setOpenFolder(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors rounded-xl p-2 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="p-6 space-y-6" onSubmit={registerAccount}>
                {status == "lead" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Proposal*
                    </label>
                    <textarea
                      required
                      name="proposal"
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                      value={inputValue.proposal}
                      onChange={handleChange}
                      placeholder="Enter your project proposal details..."
                    ></textarea>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Client instructions*
                  </label>
                  <textarea
                    required
                    name="instructions"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                    value={inputValue.instructions}
                    onChange={handleChange}
                    placeholder="Example: Website should be minimalist and accessible to everyone..."
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenFolder(false)}
                    className="px-5 py-2.5 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRoaming}
                    className={`px-6 py-2.5 rounded-xl font-medium ${
                      isRoaming
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 transition-colors"
                    } text-white flex items-center gap-2`}
                  >
                    {isRoaming ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave size={16} />
                        Save Details
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Markdown Modal */}
        {openMarkDown && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-300">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Project Log
                </h2>
                <button
                  onClick={() => setOpenMarkDown(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors rounded-xl p-2 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="p-6 space-y-6" onSubmit={registerAccount}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Log Details*
                  </label>
                  <textarea
                    required
                    name="logs"
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                    value={inputValue.logs}
                    onChange={handleChange}
                    placeholder="Describe what you worked on in this session..."
                  ></textarea>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Current session: {hour}h {min}m {second}s
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setOpenMarkDown(false)}
                      className="px-5 py-2.5 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isRoaming}
                      className={`px-6 py-2.5 rounded-xl font-medium ${
                        isRoaming
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 transition-colors"
                      } text-white flex items-center gap-2`}
                    >
                      {isRoaming ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <FiSave size={16} />
                          Add Log
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Status Modal */}
        {statusFolder && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-300">
                <h2 className="text-xl font-semibold text-gray-900">
                  Update Project Status
                </h2>
                <button
                  onClick={() => setStatusFolder(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors rounded-xl p-2 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="p-6 space-y-6" onSubmit={registerAccount}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Project Status
                  </label>
                  <select
                    value={inputValue.statusUpdate}
                    onChange={handleChange}
                    name="statusUpdate"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                  >
                    {[
                      "proposal-sent",
                      "negotiation",
                      "accepted",
                      "rejected",
                      "on-hold",
                      "paid",
                      "lead",
                      "pending",
                      "completed",
                      "progress",
                      "review",
                      "payment pending",
                    ].map((status, index) => (
                      <option value={status} key={index} className="bg-white">
                        {status.charAt(0).toUpperCase() +
                          status.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setStatusFolder(false)}
                    className="px-5 py-2.5 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRoaming}
                    className={`px-6 py-2.5 rounded-xl font-medium ${
                      isRoaming
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 transition-colors"
                    } text-white flex items-center gap-2`}
                  >
                    {isRoaming ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiSave size={16} />
                        Update Status
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Services Modal */}
        {EditON && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-300">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Services
                </h2>
                <button
                  onClick={() => setEditON(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors rounded-xl p-2 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="p-6 space-y-6" onSubmit={registerAccount}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Service Name*
                  </label>
                  <input
                    required
                    name="service_name"
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                    value={inputValue.service_name}
                    onChange={handleChange}
                    placeholder="Enter Service name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Service Type*
                  </label>
                  <input
                    required
                    name="service_type"
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                    value={inputValue.service_type}
                    onChange={handleChange}
                    placeholder="Enter Service type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Service Price*
                  </label>
                  <input
                    required
                    name="service_price"
                    type="number"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                    value={inputValue.service_price}
                    onChange={handleChange}
                    placeholder="Enter Service price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Service Duration*
                  </label>
                  <input
                    required
                    name="service_duration"
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                    value={inputValue.service_duration}
                    onChange={handleChange}
                    placeholder="Enter Service duration. ex: 1 year | 6 months"
                  />
                </div>

                <div className="flex justify-end pt-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditON(false)}
                    className="px-5 py-2.5 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRoaming}
                    className={`px-6 py-2.5 rounded-xl font-medium ${
                      isRoaming
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 transition-colors"
                    } text-white flex items-center gap-2`}
                  >
                    {isRoaming ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <FiSave size={16} />
                        Add service
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* for adding tax rate */}
        {isTaxRate && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-300">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Tax Rate for Invoice
                </h2>
                <button
                  onClick={() => setIsTaxRate(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors rounded-xl p-2 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="p-6 space-y-6" onSubmit={registerAccount}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tax Rate (in %)*
                  </label>
                  <input
                    required
                    name="tax_rate"
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                    value={inputValue.tax_rate}
                    onChange={handleChange}
                    placeholder="Enter tax rate"
                  />
                </div>
                <div className="flex justify-end pt-4 gap-3">
                
                  <button
                    type="submit"
                    disabled={isRoaming}
                    className={`px-6 py-2.5 rounded-xl font-medium ${
                      isRoaming
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 transition-colors"
                    } text-white flex items-center gap-2`}
                  >
                    {isRoaming ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <FiSave size={16} />
                        Add Tax Rate
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
