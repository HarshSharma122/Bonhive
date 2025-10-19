"use client";
import OneSignal, { IInitObject } from "react-onesignal";

const Chart = dynamic(() => import("@/utilis/projectChart"), {
  ssr: false,
  loading: () => <p>Loading chart...</p>,
});
const RevenueChart = dynamic(() => import("@/utilis/revenueChart"), {
  ssr: false,
  loading: () => <p>Loading chart...</p>,
});

import { CardProps } from "@/types/bonhive-types";
import { fetchProjects, fetchUser } from "@/utilis/fetchData";
import { formatPrice } from "@/utilis/formatPrice";
import { useProjectStore } from "@/zustand/useProjectStore";
import { useProfileStore } from "@/zustand/userProfileStore";
import { useSonnerStore } from "@/zustand/useSonner";
import { useSonnerDetailsStore } from "@/zustand/useSonnerDetailsStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Clock,
  Projector,
  TrendingUp,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { MdPayment } from "react-icons/md";
import useSWR from "swr";
// ------------------ Reusable Stat Card ------------------

const StatCard = ({
  title,
  value,
  delay,
  icon,
  description,
  trend,
}: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{
      duration: 0.4,
      delay: delay * 0.1,
      type: "spring",
      stiffness: 300,
    }}
    className="relative rounded-2xl bg-white text-gray-900 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group overflow-hidden"
  >
    {/* Accent border */}
    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500" />

    <div className="relative z-10 flex justify-between items-start">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <motion.p
          className="text-2xl font-bold text-gray-900"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: delay * 0.1 + 0.2 }}
        >
          {value ?? 0}
        </motion.p>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {trend && (
          <p className="text-xs text-green-500 font-medium mt-1">{trend}</p>
        )}
      </div>
      <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 group-hover:from-blue-100 group-hover:to-purple-100 transition-colors duration-300">
        {icon}
      </div>
    </div>
  </motion.div>
);

// Revenue Card Component
const RevenueCard = ({
  title,
  value,
  subtitle,
  trend,
  delay,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1 }}
    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
  >
    <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
    <p className="text-sm text-gray-500">{subtitle}</p>
    {trend && (
      <p className="text-xs text-green-500 font-medium mt-1">{trend}</p>
    )}
  </motion.div>
);

declare global {
  interface Window {
    OneSignalInitialized?: boolean;
  }
}

// Custom Tooltip for charts

const Page = () => {
  const { projects, addProjects } = useProjectStore();
  const [totalProject, setTotalProject] = useState<number>(0);
  const [countLead, setCountLead] = useState(0);
  const [pendingProject, setPendingProject] = useState(0);
  const [completedProject, setCompletedProject] = useState(0);
  const { isShow, setIsShow } = useSonnerStore();
  const { sonnerDetails, addSonnerDetails } = useSonnerDetailsStore();
  const { data: session } = useSession();
  const [workingProject, setWorkingProject] = useState(0);
  const [paymentPendingProject, setPaymentPendingProject] = useState(0);
  const [totalEarning, setTotalEarning] = useState("0");
  const [totalLeadBill, setTotalLeadBill] = useState("0");

  const [totalRevenue, setTotalRevenue] = useState(0);

  const { user, setUser } = useProfileStore();
  const [projectCountMonth, setProjectMonth] = useState("0");

  useEffect(() => {
    if (projects?.length > 0) {
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
        projects?.filter((fil) => fil.status == "progress").length
      );
      setCountLead(projects?.filter((fil) => fil.status == "lead").length);
      setCompletedProject(
        projects?.filter((fil) => fil.status == "completed").length
      );
      setPaymentPendingProject(
        projects?.filter((fil) => fil.status == "payment pending").length
      );

      // Calculate earnings
      const totalBill = projects
        ?.filter((pro) => pro.totalBill)
        .reduce((acc, pro) => acc + pro.totalBill, 0);

      setTotalEarning(formatPrice(totalBill));

      const totalBudget = projects?.reduce(
        (acc, client) => acc + client.bidAmount,
        0
      );

      const totalRevenue = totalBill + totalBudget;

      setTotalRevenue(totalRevenue);

      setTotalLeadBill(formatPrice(totalBudget));

      // projectcount by month

      const projectCountByMonth = projects
        ?.filter(
          (project) =>
            new Date(project.createdAt).getMonth() == new Date().getMonth()
        )
        .length.toString();

      setProjectMonth(projectCountByMonth);
    }
  }, [projects]);

  // Fetch projects from server

  // Fetch user data
  const { data: projectData, error: projectError } = useSWR(
    session ? "/api/projects" : null,
    fetchProjects
  );

  const { data: userData, error: userError } = useSWR(
    session ? "/api/user" : null,
    fetchUser
  );

  useEffect(() => {
    if (userData) setUser(userData);
    else if (userError) addSonnerDetails("you are not authenticated");
  }, [userData, setUser, userError]);

  useEffect(() => {
    if (projectData) addProjects(projectData);
    else if (projectError) addSonnerDetails("you are not authenticated");
  }, [projectData, addProjects, projectError]);

  const stats = [
    {
      id: 1,
      title: "Total Projects",
      value: totalProject || 0,
      icon: <Projector size={20} className="text-blue-600" />,
      description: "All time projects",
    },
    {
      id: 2,
      title: "Project Leads",
      value: countLead || 0,
      icon: <TrendingUp size={20} className="text-green-600" />,
      description: "Potential projects",
    },
    {
      id: 3,
      title: "Completed",
      value: completedProject || 0,
      icon: <CheckCircle size={20} className="text-green-600" />,
      description: "Successfully delivered",
    },
    {
      id: 4,
      title: "Pending",
      value: pendingProject || 0,
      icon: <Clock size={20} className="text-yellow-600" />,
      description: "Awaiting action",
    },
    {
      id: 5,
      title: "Payment Pending",
      value: paymentPendingProject || 0,
      icon: <MdPayment size={20} className="text-orange-600" />,
      description: "Awaiting payment",
    },
    {
      id: 6,
      title: "In Progress",
      value: workingProject || 0,
      icon: <Circle size={20} className="fill-blue-500 text-blue-500" />,
      description: "Currently working",
    },
    {
      id: 7,
      title: "Hourly Earnings",
      value: totalEarning || 0,
      icon: user?.userLanguage,
      description: "Time Based Project",
    },
    {
      id: 8,
      title: "Bid Earning",
      value: totalLeadBill || 0,
      icon: user?.userLanguage,
      description: "Fixed price project",
    },
  ];

  const revenueStats = [
    {
      id: 1,
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      subtitle: "Overall earnings",
    },
    {
      id: 2,
      title: "New Leads",
      value: projectCountMonth || 0,
      subtitle: "This month",
    },
    {
      id: 3,
      title: "Closed Deals",
      value: completedProject || 0,
      subtitle: "Successful conversions",
    },
  ];

  const clientStats = [
    {
      id: 1,
      title: "Contracted",
      value: workingProject || 0,
      subtitle: "Active contracts",
    },
    {
      id: 2,
      title: "Proposal",
      value: pendingProject || 0,
      subtitle: "Pending proposals",
    },
  ];
  setTimeout(() => {
    setIsShow(false);
  }, 2000);

  useEffect(() => {
    if (!user?.oneSignal_id) {
      const initOneSignal = async () => {
        if (window.OneSignalInitialized) return;

        try {
          const options = {
            appId: process.env.NEXT_PUBLIC_ONE_SIGNAL_APP_ID!,
            safari_web_id:
              "web.onesignal.auto.21fd847c-14e1-48c8-a072-78170e2e9023",
            allowLocalhostAsSecureOrigin: false,
          };
          await OneSignal.init(options);

          window.OneSignalInitialized = true;
          console.log("✅ OneSignal initialized successfully");

          const id = OneSignal.User.PushSubscription.id;

          console.log("OneSignal user ID:", id);

          if (id) {
            const response = await fetch("/api/saveOneSignalId", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ oneSignalId: id }),
            });

            if (!response.ok) throw new Error("Failed to save OneSignal ID");
            console.log("✅ OneSignal ID saved to backend");
          }
        } catch (err) {
          console.error("❌ OneSignal init failed:", err);
        }
      };

      void initOneSignal(); // prevent unhandled promise warning
    }
  }, [user?.oneSignal_id]);

  return (
    <div onClick={() => setIsShow(false)} className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {isShow && (
          <div className="bg-gray-200 text-xs flex items-center text-black rounded-md border-1 border-gray-200 shadow-md z-100 fixed top-0 gap-2 right-0">
            <X onClick={() => setIsShow(false)} />
            <h1 className="font-semibold">{sonnerDetails}</h1>
          </div>
        )}
      </AnimatePresence>

      <div className="p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 flex items-center justify-between"
        >
          <div className="">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome {session?.user.name}
            </h1>
            <p className="text-gray-600">
              Comprehensive overview of your projects and earnings
            </p>
          </div>
        </motion.div>

        {/* Revenue Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {revenueStats.map((stat, idx) => (
            <RevenueCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              delay={idx}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Project Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, idx) => (
                  <StatCard
                    key={stat.id}
                    title={stat.title}
                    value={stat.value}
                    delay={idx}
                    icon={stat.icon}
                    description={stat.description}
                  />
                ))}
              </div>
            </motion.div>

            <Chart />
          </div>

          {/* Right Column - Clients & Additional Info */}
          <div className="space-y-8">
            {/* Contract Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Contract Status
              </h2>
              <div className="space-y-4">
                {clientStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {stat.title}
                      </h3>
                      <p className="text-sm text-gray-600">{stat.subtitle}</p>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Revenue chart */}
            <RevenueChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
