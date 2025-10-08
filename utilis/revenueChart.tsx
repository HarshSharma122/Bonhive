import { useProjectStore } from "@/zustand/useProjectStore";
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
} from "lucide-react";
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

import { formatPrice } from "./formatPrice";

// Custom Tooltip for charts
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

const RevenueChart = () => {
  const { projects, addProjects } = useProjectStore();

  const [newMonthRevenue, setnewMonthRevenue] = useState<
    { month: string; revenue: string; shortMonth: string }[]
  >([]);
  const [newYearRevenue, setnewYearRevenue] = useState<
    { year: string; revenue: string; shortYear: string }[]
  >([]);

  const [revSelect, setRevSelect] = useState<"month" | "year">("month");

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

  // for month
  useEffect(() => {
    const revenue = monthName?.map((month, index) => ({
      month,
      shortMonth: shortMonthName[index],
      revenue: formatPrice(
        projects
          ?.filter((fil) => new Date(fil.createdAt).getMonth() === index)
          .reduce((prev, cur) => prev + cur.bidAmount + cur.totalBill, 0)
      ),
    }));

    const revenueYear = yearName?.map((year, index) => ({
      year,
      shortYear: shortYearName[index],
      revenue: formatPrice(
        projects
          ?.filter(
            (fil) => new Date(fil.createdAt).getFullYear() === Number(year)
          )
          .reduce((prev, cur) => prev + cur.bidAmount + cur.totalBill, 0)
      ),
    }));

    setnewYearRevenue(revenueYear);
    setnewMonthRevenue(revenue);
  }, [projects]);

  const getRevenueBarColor = (index: number) => {
    const colors = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"];
    return colors[index % colors.length];
  };

  return (
    <>
      {/* chart section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
      >
        <div className="flex flex-col lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Revenue</h2>
            <p className="text-gray-600">
              {revSelect}ly Revenue distribution and trends
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setRevSelect("month")}
              className={`${
                revSelect === "month"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } px-4 py-2 rounded-xl transition-colors duration-300 flex items-center`}
            >
              <Calendar size={16} className="mr-2" />
              Month
            </button>
            <button
              onClick={() => setRevSelect("year")}
              className={`${
                revSelect === "year"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } px-4 py-2 rounded-xl transition-colors duration-300`}
            >
              Year
            </button>
          </div>
        </div>

        {revSelect === "month" ? (
          newMonthRevenue.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={newMonthRevenue}>
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
                    dataKey="revenue"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1500}
                  >
                    {newMonthRevenue.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getRevenueBarColor(index)}
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
        ) : newYearRevenue.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={newYearRevenue}>
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
                  dataKey="revenue"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                >
                  {newYearRevenue.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getRevenueBarColor(index)}
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

export default RevenueChart;
