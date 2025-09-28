"use client";
import Button from "@/components/UI/button";
import { useProjectStore } from "@/zustand/useProjectStore";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeDollarSign, Languages, Target, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { FcServices } from "react-icons/fc";
import {
  FiBarChart2,
  FiCalendar,
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

  const generateInvoice = async () => {
    await fetch("/api/invoice", {
      method: "POST",
      body: JSON.stringify({
        projectId: showprojectDetails,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

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
    const todayDate = new Date();
    const setDate = new Date(som);

    const firstDateInMs = todayDate.getTime();
    const secondDateInMs = setDate.getTime();

    const differenceBtwDates = secondDateInMs - firstDateInMs;
    const aDayInMs = 24 * 60 * 60 * 1000;

    const daysDiff = Math.round(differenceBtwDates / aDayInMs);

    setReminderDays(daysDiff);
  },[]);

  const [inputValue, setInputValue] = useState({
    instructions: "",
    proposal: "",
    logs: "",
    logType: "",
    statusUpdate: "",
    service_name: "",
    service_type: "",
    service_price: "",
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
  const [openfolder, setOpenFolder] = useState<boolean>(false);

  const openDetailsFolder = () => {
    setOpenFolder(true);
  };

  const [opentime, setOpenTimer] = useState(false);

  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);
  const [second, setSecond] = useState(0);
  const [stop, setStop] = useState<NodeJS.Timeout>();

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

  const [openMarkDown, setOpenMarkDown] = useState<boolean>(false);
  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
      case "in progress":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "pending":
        return "bg-amber-500/10 text-amber-700 border-amber-200";
      case "lead":
        return "bg-purple-500/10 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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

  const [statusFolder, setStatusFolder] = useState<boolean>(false);

  const openStatusFolder = () => {
    setStatusFolder(true);
  };

  return (
    <div className="min-h-screen lg:w-[82vw] text-white  p-4 md:p-6">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Project Details</h1>
            <p className="mt-1">Track progress and manage deliverables</p>
          </div>

          <div className="">
            <div className="flex text-orange-600 gap-2 font-semibold">
              {reminderDays > 0 ? (
                <h1>{reminderDays} days left</h1>
              ) : (
                <h1 className="text-red-700">Duration is passed</h1>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {opentime ? (
              <Button
                onclick={() => StopTimer()}
                className="px-4 py-2.5 text-sm flex items-center gap-2"
                varient="bgBlank"
              >
                <FiPause size={16} />
                Stop Timer
              </Button>
            ) : (
              <Button
                onclick={() => StartTimer()}
                className="px-4 py-2.5 text-sm flex items-center gap-2"
                varient="bgFill"
              >
                <FiPlay size={16} />
                Start Timer
              </Button>
            )}
            <Button
              onclick={() => setOpenMarkDown(true)}
              className="px-4 py-2.5 text-sm flex items-center gap-2"
              varient="bgFill"
            >
              <FiEdit size={16} />
              Add Log
            </Button>

            <Button
              onclick={() => setEditON(true)}
              varient="bgFill"
              className=""
            >
              Add Services
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Project Card */}
            {projects
              .filter((fil) => fil._id == showprojectDetails)
              .map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-100 rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                            {project.projectName}
                          </h2>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              project.status
                            )}`}
                          >
                            {project.status}
                          </span>
                        </div>
                        {project.desc && (
                          <p className="text-gray-600 text-sm">
                            {project.desc}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onclick={openStatusFolder}
                          className="flex items-center gap-2"
                          varient="bgBlank"
                        >
                          <FiEdit size={14} />
                          Edit Status
                        </Button>
                      </div>
                      {!project.instructions?.length &&
                        (!project.proposal?.length && (
                          <div className="flex gap-2">
                            <Button
                              onclick={openDetailsFolder}
                              className="flex items-center gap-2"
                              varient="bgBlank"
                            >
                              <FiEdit size={14} />
                              Edit
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-4 bg-gray-200 rounded-lg">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                        <FiUser className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Client</p>
                        <p className="font-semibold text-gray-900">
                          {project.clientName}
                        </p>
                        <p className="text-xs text-gray-500">{project.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-200 rounded-lg">
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                        <FiDollarSign className="text-green-600" size={20} />
                      </div>
                      <div>
                        {project.IshourBillable ? (
                          <>
                            <p className="text-sm text-gray-500">
                              Hourly Project
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500">Bid Amount</p>
                            <p className="font-semibold text-gray-900">
                              ₹{project.bidAmount}
                            </p>
                          </>
                        )}
                        <p className="text-xs text-gray-500">
                          Budget: ₹{project.clientBudget}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-200 rounded-lg">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                        <FiTag className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Reference</p>
                        <p className="font-semibold text-gray-900">
                          {project.leadSource}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-200 rounded-lg">
                      <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mr-4">
                        <FiClock className="text-amber-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Time</p>
                        <p className="font-semibold text-gray-900">
                          {totalHour}h {totalMin}m {totalSec}s
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-200 rounded-lg">
                      <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mr-4">
                        <BadgeDollarSign className="text-amber-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Payment</p>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900">
                            ₹{project.totalBill?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-200 rounded-lg">
                      <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mr-4">
                        <TiMediaRecord className="text-amber-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Hourly Rate</p>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900">
                            ₹{project.hourlyRate}/hour
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-200 rounded-lg">
                      <div className="w-12 h-12 rounded-lg bg-[#f8ad9d] flex items-center justify-center mr-4">
                        <Target className="text-[#ee765b]" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Deadline</p>
                        <p className="font-semibold text-gray-900">
                          {project.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-200 rounded-lg">
                      <div className="w-12 h-12 rounded-lg bg-[#f0f0f0] flex items-center justify-center mr-4">
                        <Languages className="text-[#ee765b]" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Client Language Prefrence
                        </p>
                        <p className="font-semibold text-gray-900">
                          {project.clientLanguage}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* for domain and hosting services if available */}

                  {/* Instructions & Proposal */}
                  <div className="p-6 border-t border-gray-100">
                    {project.instructions && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FiList className="text-blue-600" />
                          Client Instructions
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                          {project.instructions.split(",").map((ins, index) => (
                            <div
                              key={index}
                              className="flex items-start bg-blue-50/50 p-3 rounded-lg border border-blue-100"
                            >
                              <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-1 mr-3 mt-0.5">
                                <FiCheckCircle size={12} />
                              </span>
                              <span className="text-gray-700 text-sm">
                                {ins}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {project.proposal && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FiFileText className="text-blue-600" />
                          Proposal
                        </h3>
                        <div className="bg-gray-200 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-700 text-sm">
                            {project.proposal}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 border-t border-gray-100">
                    {project.notes && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FiList className="text-blue-600" />
                          Notes
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                          {project.notes.split(",").map((ins, index) => (
                            <div
                              key={index}
                              className="flex items-start bg-blue-50/50 p-3 rounded-lg border border-blue-100"
                            >
                              <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-1 mr-3 mt-0.5">
                                <FiCheckCircle size={12} />
                              </span>
                              <span className="text-gray-700 text-sm">
                                {ins}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {project.proposal && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FiFileText className="text-blue-600" />
                          Proposal
                        </h3>
                        <div className="bg-gray-200 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-700 text-sm">
                            {project.proposal}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

            {/* services like domain and hosting */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FcServices className="text-blue-600" />
                  Services
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {projects
                    .filter((fil) => fil._id == showprojectDetails)
                    .map((project) =>
                      project?.services?.map((service, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4 relative"
                        >
                          <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-gray-500">
                                {service.service_name}
                              </span>
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-gray-700">
                                  {/* {logs.hour}h:{logs.minute}m:{logs.second}s */}
                                  {service.service_duration}
                                </span>
                                <span className="text-sm font-semibold text-gray-600">
                                  ₹{service.service_price}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">
                              {service.service_type}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiClock className="text-blue-600" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {projects ? (
                  projects
                    .filter((fil) => fil._id == showprojectDetails)
                    .map((mark) =>
                      mark.projectLogs.map((logs, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4 relative"
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center z-10">
                              <FiClipboard
                                className="text-blue-600"
                                size={16}
                              />
                            </div>
                            {index !== mark.projectLogs.length - 1 && (
                              <div className="w-0.5 h-16 bg-gray-200 absolute top-10 left-5"></div>
                            )}
                          </div>
                          <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-gray-500">
                                {new Date().toLocaleDateString()}
                              </span>
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-gray-700">
                                  {logs.hour}h:{logs.minute}m:{logs.second}s
                                </span>
                                <span className="text-sm font-semibold text-gray-600">
                                  ₹{logs.rate.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">
                              {logs.markdown}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )
                ) : (
                  <div className="text-center py-8 text-gray-400 bg-gray-200 rounded-xl border border-dashed border-gray-300">
                    <FiClipboard
                      className="mx-auto mb-3 text-gray-300"
                      size={28}
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
            <div className="bg-gray-200 rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiClock className="text-blue-600" />
                Current Session
              </h2>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {hour.toString().padStart(2, "0")}:
                  {min.toString().padStart(2, "0")}:
                  {second.toString().padStart(2, "0")}
                </div>
                <p className="text-sm text-gray-500">
                  Time spent on this session
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiTarget className="text-blue-600" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button
                  onclick={generateInvoice}
                  varient="bgBlank"
                  className="w-full justify-start text-sm py-3"
                >
                  <FiFileText className="mr-2" />
                  Generate Invoice
                </Button>
                <Button
                  varient="bgBlank"
                  className="w-full justify-start text-sm py-3"
                >
                  <FiClipboard className="mr-2" />
                  View Contract
                </Button>
                <Button
                  varient="bgBlank"
                  className="w-full justify-start text-sm py-3"
                >
                  <FiUser className="mr-2" />
                  Contact Client
                </Button>
                <Button
                  varient="bgBlank"
                  className="w-full justify-start text-sm py-3"
                >
                  <FiCalendar className="mr-2" />
                  Set Deadline
                </Button>
              </div>
            </div>

            {/* Project Stats */}
            <div className="bg-gray-100 rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiBarChart2 className="text-blue-600" />
                Project Stats
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Total Time Invested
                  </p>
                  <p className="font-semibold text-gray-900">
                    {totalHour}h {totalMin}m {totalSec}s
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Activity Logs</p>
                  <p className="font-semibold text-gray-900">
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

        {/* Add details modal */}
        <AnimatePresence>
          {openfolder && (
            <div className="fixed inset-0 bg-black text-black  bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Edit Project Details
                  </h2>
                  <button
                    onClick={() => setOpenFolder(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form className="p-6 space-y-5" onSubmit={registerAccount}>
                  {status == "lead" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proposal*
                      </label>
                      <textarea
                        required
                        name="proposal"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={inputValue.proposal}
                        onChange={handleChange}
                        placeholder="Enter your project proposal details..."
                      ></textarea>
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client instructions*
                    </label>
                    <textarea
                      required
                      name="instructions"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={inputValue.instructions}
                      onChange={handleChange}
                      placeholder="Example: Website should be minimalist and accessible to everyone..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end pt-4 gap-3">
                    <button
                      type="button"
                      onClick={() => setOpenFolder(false)}
                      className="px-5 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isRoaming}
                      className={`px-6 py-2.5 rounded-lg font-medium ${
                        isRoaming
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 transition-colors"
                      } text-white flex items-center gap-2`}
                    >
                      {isRoaming ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
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
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Markdown Modal */}
        <AnimatePresence>
          {openMarkDown && (
            <div className="fixed inset-0 bg-black text-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Add Project Log
                  </h2>
                  <button
                    onClick={() => setOpenMarkDown(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form className="p-6 space-y-5" onSubmit={registerAccount}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Log Details*
                    </label>
                    <textarea
                      required
                      name="logs"
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={inputValue.logs}
                      onChange={handleChange}
                      placeholder="Describe what you worked on in this session..."
                    ></textarea>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Current session: {hour}h {min}m {second}s
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setOpenMarkDown(false)}
                        className="px-5 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isRoaming}
                        className={`px-6 py-2.5 rounded-lg font-medium ${
                          isRoaming
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 transition-colors"
                        } text-white flex items-center gap-2`}
                      >
                        {isRoaming ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
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
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/*Status folder*/}
        <AnimatePresence>
          {statusFolder && (
            <div className="fixed inset-0 bg-black text-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    update project status
                  </h2>
                  <button
                    onClick={() => setStatusFolder(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form className="p-6 space-y-5" onSubmit={registerAccount}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project is
                    </label>

                    <select
                      value={inputValue.statusUpdate}
                      onChange={handleChange}
                      name="statusUpdate"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                        <option value={status} key={index}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStatusFolder(false)}
                        className="px-5 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isRoaming}
                        className={`px-6 py-2.5 rounded-lg font-medium ${
                          isRoaming
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 transition-colors"
                        } text-white flex items-center gap-2`}
                      >
                        {isRoaming ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            updating...
                          </>
                        ) : (
                          <>
                            <FiSave size={16} />
                            update Status
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {EditON && (
            <div className="fixed inset-0 bg-black text-black  bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Add Services
                  </h2>
                  <button
                    onClick={() => setEditON(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form className="p-6 space-y-5" onSubmit={registerAccount}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Name*
                    </label>
                    <input
                      required
                      name="service_name"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={inputValue.service_name}
                      onChange={handleChange}
                      placeholder="Enter Service name."
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service type*
                    </label>
                    <input
                      required
                      name="service_type"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={inputValue.service_type}
                      onChange={handleChange}
                      placeholder="Enter Service type."
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service price*
                    </label>
                    <input
                      required
                      name="service_price"
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={inputValue.service_price}
                      onChange={handleChange}
                      placeholder="Enter Service price."
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Duration*
                    </label>

                    <input
                      required
                      name="service_duration"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={inputValue.service_duration}
                      onChange={handleChange}
                      placeholder="Enter Service duration. ex:1 year| 6 month"
                    />
                  </motion.div>

                  <div className="flex justify-end pt-4 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditON(false)}
                      className="px-5 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-6 py-2.5 rounded-lg font-medium  "bg-blue-600 hover:bg-blue-700 transition-colors"`}
                    >
                      <FiSave size={16} />
                      Save Details
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Page;
