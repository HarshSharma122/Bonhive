import { useProjectStore } from "@/zustand/useProjectStore";
import { motion } from "framer-motion";
import { BarChart3, Calendar } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/lib/rechart";

interface PayloadItem {
  value: string | number | boolean | null | undefined;
  dataKey?: string;
  name?: string;
  payload: Record<string, unknown>;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string | number;
}
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active = false,
  payload = [],
  label = "",
}: CustomTooltipProps): React.JSX.Element | null => {
  const shouldShow: boolean = active && payload.length > 0;

  if (shouldShow) {
    const firstPayload: PayloadItem = payload[0];
    const name = firstPayload?.name;

    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-300 rounded-lg p-3 shadow-2xl">
        <p className="text-gray-900 font-semibold">{label}</p>
        <p className="text-blue-600">
          {name}: <span className="text-gray-700">{firstPayload.value}</span>
        </p>
      </div>
    );
  }

  return null;
};

const Chart = () => {
  const { projects, addProjects } = useProjectStore();
  const [select, setSelect] = useState<"month" | "year">("month");

  // Group projects by month
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const shortMonthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const yearName = ["2025", "2026", "2027", "2028", "2029", "2030"];

  const shortYearName = ["25", "26", "27", "28", "29", "30"];
  const [newArr, setNewArr] = useState<
    { month: string; projects: number; shortMonth: string }[]
  >([]);

  const [newYearArr, setNewYearArr] = useState<
    { year: string; projects: number; shortYear: string }[]
  >([]);

  // for month
  useEffect(() => {
    const s = monthName?.map((month, index) => ({
      month,
      shortMonth: shortMonthName[index],
      projects: projects?.filter(
        (project) => new Date(project.createdAt).getMonth() === index
      ).length,
    }));

    const sYear = yearName?.map((year, index) => ({
      year,
      shortYear: shortYearName[index],
      projects: projects?.filter(
        (project) => new Date(project.createdAt).getFullYear() === Number(year)
      ).length,
    }));

    setNewYearArr(sYear);
    setNewArr(s);
  }, [projects]);

  const getBarColor = (count: number) => {
    if (count === 0) return "#E5E7EB";
    if (count <= 2) return "#3B82F6";
    if (count <= 5) return "#8B5CF6";
    return "#10B981";
  };
  return (
    <>
      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Project Analytics
            </h2>
            <p className="text-gray-600">
              {select}ly project distribution and trends
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelect("month")}
              className={`${
                select === "month"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } px-4 py-2 rounded-xl transition-colors duration-300 flex items-center`}
            >
              <Calendar size={16} className="mr-2" />
              Month
            </button>
            <button
              onClick={() => setSelect("year")}
              className={`${
                select === "year"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } px-4 py-2 rounded-xl transition-colors duration-300`}
            >
              Year
            </button>
          </div>
        </div>

        {select === "month" ? (
          newArr.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={newArr}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="shortMonth"
                    stroke="#6B7280"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="projects"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1500}
                  >
                    {newArr.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(entry.projects)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <BarChart3 size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No chart data available</p>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                Start adding projects to see your analytics and trends
                visualized here.
              </p>
            </div>
          )
        ) : newYearArr.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={newYearArr}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  vertical={false}
                />
                <XAxis
                  dataKey="shortYear"
                  stroke="#6B7280"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="projects"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                >
                  {newYearArr.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry.projects)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <BarChart3 size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No chart data available</p>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Start adding projects to see your analytics and trends visualized
              here.
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Chart;
