"use client";

import { useCurrencyPrefStore } from "@/zustand/useCurrencyprefStore";
import { projects, useProjectStore } from "@/zustand/useProjectStore";
import { useProfileStore } from "@/zustand/userProfileStore";
import { useStatusStore } from "@/zustand/useshowStatusStore";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock, Projector, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MdPayment } from "react-icons/md";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ------------------ Reusable Stat Card ------------------
type CardProps = {
  title: string;
  value?: string | number;
  delay: number;
  icon: React.ReactNode;
};

const StatCard = ({ title, value, delay, icon }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-medium text-white/70">{title}</h3>
        <motion.p
          className="text-3xl font-bold mt-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: delay * 0.1 + 0.2 }}
        >
          {value || 0}
        </motion.p>
      </div>
      <div className="p-2 bg-white/10 rounded-lg">{icon}</div>
    </div>
  </motion.div>
);

type graphType = {
  completed?: number;
  name?: string;
  projects?: number;
  revenue?: number;
};

const Page = () => {
  const { currencyPref } = useCurrencyPrefStore();
  const { projects, addProjects } = useProjectStore();
  const [newArr, setNewArr] = useState<graphType[]>([]);
  const [totalProject, setTotalProject] = useState<number>(0);
  const [countLead, setCountLead] = useState(0);
  const [pendingProject, setPendingProject] = useState(0);
  const [completedProject, setCompletedProject] = useState(0);
  const [workingProject, setWorkingProject] = useState(0);
  const [paymentPendingProject, setPaymentPendingProject] = useState(0);
  const [totalEarning, setTotalEarning] = useState("");
  const { user, setUser } = useProfileStore();

  useEffect(() => {
    setTotalProject(projects?.length);
    setPendingProject(
      projects?.filter(
        (fil) =>
          fil.status == "negotiation" ||
          fil.status == "on-hold" ||
          fil.status == "pending"
      )?.length
    );
    setWorkingProject(
      projects?.filter((fil) => fil.status == "progress")?.length
    );
    setCountLead(projects?.filter((fil) => fil.status == "lead")?.length);
    setCompletedProject(
      projects?.filter((fil) => fil.status == "completed")?.length
    );
    setPaymentPendingProject(
      projects?.filter((fil) => fil.status == "payment pending")?.length
    );
    let t = 0;
    projects
      ?.filter((pro) => pro.totalBill)
      .map((a) => {
        t += a.totalBill;
      });
    setTotalEarning(t.toFixed(2));
  }, [projects]);

  // Fetch projects from server only once on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        addProjects(data.data);
      } catch (err) {
        alert(err);
      }
    };
    fetchProjects();
  }, [addProjects]);
  type MonthStats = {
    name: string;
    projects: number;
    revenue: number;
    completed: number;
  };

  useEffect(() => {
    const s = projects?.reduce(
      (prev: Record<string, MonthStats>, initial: projects) => {
        console.log("previous is", prev);
        // console.log(initial);

        if (!initial.completedMonth) return prev;
        const month = initial.completedMonth;

        const income = initial.totalBill || 0;
        if (!prev[month]) {
          prev[month] = {
            name: month,
            projects: projects?.length,
            revenue: 0,
            completed: 0,
          };
        }

        prev[month].completed++;
        prev[month].revenue += income;

        return prev;
      },
      {}
    );
    const arr: graphType[] = Object.values(s || {});
    setNewArr(arr);
  }, [projects]);

  useEffect(() => {
    const fn = async () => {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (data) {
          setUser(data.msg);
        } else {
          alert("error");
        }
      } catch (error) {
        alert(error);
      }
    };

    fn();
  }, [addProjects]);
  // Example stats (replace values with real data when available)
  const stats = [
    {
      id: 1,
      title: "Total Project",
      value: totalProject,
      icon: <Projector size={20} />,
    },
    {
      id: 2,
      title: "Project Lead",
      value: countLead,
      icon: <Projector size={20} />,
    },

    {
      id: 3,
      title: "Completed",
      value: completedProject,
      icon: <CheckCircle size={20} />,
    },

    {
      id: 4,
      title: "Pending",
      value: pendingProject,
      icon: <Clock size={20} />,
    },

    {
      id: 5,
      title: "Payment Pending",
      value: paymentPendingProject,
      icon: <MdPayment size={20} />,
    },

    {
      id: 6,
      title: "Working",
      value: workingProject,
      icon: <Circle size={20} />,
    },

    {
      id: 7,
      title: "Profit",
      value: totalEarning,
      icon: currencyPref,
    },
    {
      id: 9,
      title: "Clients",
      value: user?.clientCount,
      icon: <Users size={20} />,
    },
  ];
  const { isAnimate } = useStatusStore();
  const check = [
    "Starting..",
    "Creating DashBoard",
    "managing DashBoard",
    "wait.....",
  ];
  const [value, setValue] = useState(check[0]);
  let i = 0;
  setInterval(() => {
    setValue(check[i]);
    i++;
  }, 2000);

  return (
    <>
      {isAnimate && (
        <div className="absolute w-[100%] flex items-center justify-center overflow-hidden z-50  h-[100vh] bg-black text-white top-0 right-0 left-0 bottom-0 font-semibold text-2xl">
          {value}
        </div>
      )}
      <div className="p-4 md:p-8 space-y-5 ">
        {/* Stats Section */}
        <motion.div
          className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-6"
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, idx) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              delay={idx}
              icon={stat.icon}
            />
          ))}
        </motion.div>
        {/* Chart Section */}
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg h-full">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Earning Graph
          </h2>

          {newArr?.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart
                data={newArr}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                {/* Grid */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  opacity={0.5}
                />

                {/* Axes */}
                <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                <YAxis tick={{ fill: "#6b7280" }} />

                {/* Tooltip & Legend */}
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                          <p className="font-bold text-gray-900 dark:text-gray-100">
                            {label}
                          </p>
                          {payload.map((entry, idx) => (
                            <p
                              key={idx}
                              className="flex items-center text-sm"
                              style={{ color: entry.color }}
                            >
                              {entry.name}:{" "}
                              <span className="ml-1 font-medium">
                                {entry.dataKey === "revenue"
                                  ? `₹${entry.value}`
                                  : entry.value}
                              </span>
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />

                {/* Charts */}
                <Bar
                  dataKey="projects"
                  barSize={24}
                  fill="#3B82F6"
                  name="Total Projects"
                  animationDuration={800}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  name="Completed"
                  animationDuration={1000}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F59E0B"
                  fill="#FBBF24"
                  fillOpacity={0.2}
                  name="Revenue"
                  animationDuration={1200}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-10">
              No chart data available
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
