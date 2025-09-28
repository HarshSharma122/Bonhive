"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Calendar,
  ChevronRight,
  CircleUser,
  Clock,
  LayoutDashboard,
  Menu,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cache, useEffect, useState } from "react";
import { CgAdd } from "react-icons/cg";
import { FcManager } from "react-icons/fc";
import { HiHome } from "react-icons/hi2";
import { MdDashboardCustomize } from "react-icons/md";
import Roaming from "./Roaming";

const navItems = [
  { icon: <HiHome size={18} />, label: "Home", path: "/home" },
  {
    icon: <MdDashboardCustomize size={18} />,
    label: "DashBoard",
    path: "/dashboard",
  },
  {
    icon: <LayoutDashboard size={18} />,
    label: "Projects",
    path: "/dashboard/projects",
  },
  {
    icon: <CgAdd size={18} />,
    label: "Add leads",
    path: "/dashboard/addLeads",
  },
  {
    icon: <Calendar size={18} />,
    label: "Calendar",
    path: "/dashboard/calender",
  },
  {
    icon: <Clock size={18} />,
    label: "Task Management",
    path: "/dashboard/task-management",
  },
  {
    icon: <FcManager size={18} />,
    label: "Client Management",
    path: "/dashboard/client-management",
  },
];

const AsideDash = cache(() => {
  const [username, setusername] = useState<string | null | undefined>("");
  const { data: session, status } = useSession();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (status == "authenticated") {
      setusername(session?.user.name);
    }
  }, [session]);
  const router = useRouter();

  const accountNavigate = () => {
    setIsNavigating(true);

    setTimeout(() => {
      router.push(`/dashboard/account/${username}`);
      setIsNavigating(false);
    }, 2000);
  };
  const prefetchAccount = () => {
    router.prefetch(`/dashboard/account/${session?.user?.name || ""}`);
  };

  const [openSideBar, setOpenSideBar] = useState(false);

  const [isRoaming, setIsRoaming] = useState<boolean>(false);
  const startRoaming = () => {
    setIsRoaming(true);

    setTimeout(() => {
      setIsRoaming(false);
    }, 3000);
  };

  return (
    <>
      {isRoaming && <Roaming />}
      <div className="">
        <Menu
          onClick={() => setOpenSideBar(true)}
          className="absolute  top-0 lg:hidden block cursor-pointer mx-4 my-2 font-semibold z-50 opacity-100 border-1 w-10 h-10"
        />
      </div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`opacity-100 z-50 bg-gray-900 text-white w-55 h-screen fixed lg:flex flex-col border-r border-gray-800 md:flex ${
          openSideBar ? "flex" : "hidden"
        } transition-all duration-300`}
      >
        <Menu
          onClick={() => setOpenSideBar(false)}
          className="absolute lg:hidden block cursor-pointer mx-4 my-2 font-semibold z-50 opacity-100 top-27 left-43"
        />
        {/* AI Suggestion Banner */}
        <motion.section
          whileHover={{ scale: 1.02 }}
          className="border-b border-gray-800 p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50"
        >
          <div className="flex items-center gap-2">
            <Brain className="text-blue-400" size={18} />
            <span className="text-sm font-medium">Mental Overhead</span>
            <span className="ml-auto text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full"></span>
          </div>
          <p className="text-gray-300 text-xs mt-2">
            Suggestion: Reduce workload for better productivity
          </p>
        </motion.section>

        {/* Navigation */}
        <nav className="mt-8 px-4 flex-1">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <motion.li
                key={item.label}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.2 }}
              >
                <Link
                  href={item.path}
                  onClick={startRoaming}
                  prefetch={true}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all 
    "text-gray-400 hover:bg-gray-800 hover:text-white"
                `}
                >
                  <span className="text-gray-300">{item.icon}</span>
                  {item.label}

                  <ChevronRight
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    size={16}
                  />
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Account Section */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 border-t border-gray-800 cursor-pointer"
        >
          <button
            className="w-full py-2 rounded-md px-2 flex items-center justify-between gap-2 text-sm bg-gray-800 hover:bg-gray-700 transition-colors"
            onClick={accountNavigate}
            onMouseEnter={prefetchAccount}
            disabled={isNavigating}
          >
            <div className="flex items-center gap-2">
              <CircleUser className="text-gray-300" size={18} />
              <span>{isNavigating ? "Loading..." : "Account"}</span>
            </div>
            <ChevronRight size={16} />
          </button>
        </motion.section>
      </motion.div>
    </>
  );
});

export default AsideDash;
