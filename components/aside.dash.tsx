"use client";

import { useSonnerStore } from "@/zustand/useSonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  CircleUser,
  Clock,
  LayoutDashboard,
  Menu,
  UserCog,
  X
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cache, useEffect, useState } from "react";
import { CgAdd } from "react-icons/cg";
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
    icon: <UserCog size={18} />,
    label: "Client Management",
    path: "/dashboard/client-management",
  },
];

const AsideDash = cache(() => {
  const [username, setusername] = useState<string | null | undefined>("");
  const { data: session, status } = useSession();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { isShow, setIsShow } = useSonnerStore();

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsShow(true); // Always show on desktop
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [setIsShow]);

  useEffect(() => {
    if (status == "authenticated") {
      setusername(session?.user.name);
    }
  }, [session, status]);

  const router = useRouter();

  const accountNavigate = () => {
    setIsNavigating(true);
    setIsShow(false);
    setIsRoaming(true);

    setTimeout(() => {
      router.push(`/dashboard/account/${username}`);
      setIsNavigating(false);
      setIsRoaming(false);
    }, 2000);
  };

  const prefetchAccount = () => {
    router.prefetch(`/dashboard/account/${session?.user?.name || ""}`);
  };

  const [isRoaming, setIsRoaming] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<number>(1);

  const startRoaming = (index: number) => {
    setIsRoaming(true);
    setIsShow(false);
    setActiveLink(index);

    setTimeout(() => {
      setIsRoaming(false);
    }, 3000);
  };

  // Backdrop component for mobile
  const Backdrop = () => (
    <AnimatePresence>
      {isShow && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white blur-2xl bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsShow(false)}
        />
      )}
    </AnimatePresence>
  );

  return (
    <>
      {isRoaming && <Roaming />}
      
      {/* Mobile Menu Button */}
      <div className="lg:hidden block">
        <button
          onClick={() => setIsShow(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-black" />
        </button>
      </div>

      <Backdrop />

      {/* Sidebar */}
      <AnimatePresence>
        {(isShow || !isMobile) && (
          <motion.div
            initial={{ 
              x: isMobile ? -300 : -20, 
              opacity: isMobile ? 0 : 0 
            }}
            animate={{ 
              x: 0, 
              opacity: 1 
            }}
            exit={{ 
              x: isMobile ? -300 : -20, 
              opacity: isMobile ? 0 : 0 
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`
              fixed lg:static z-50 p-4 lg:p-4 
              h-screen lg:h-[calc(100vh-2rem)] 
              bg-white text-black 
              w-80 lg:w-64 
              border-r border-gray-200 
              shadow-xl lg:shadow-lg 
              rounded-r-2xl lg:rounded-lg
              flex flex-col
              top-0 left-0
              ${isShow ? "flex" : "lg:flex hidden"}
            `}
          >
            {/* Mobile Close Button */}
            {isMobile && (
              <button
                onClick={() => setIsShow(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* AI Suggestion Banner */}
            <motion.section
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Bonhive
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    Welcome back, {username || "User"}
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Navigation */}
            <nav className="mt-6 lg:mt-8 px-2 flex-1">
              <ul className="space-y-1 lg:space-y-2">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                  >
                    <Link
                      href={item.path}
                      onClick={() => startRoaming(index)}
                      prefetch={true}
                      className={`
                        flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 
                        rounded-lg lg:rounded-xl text-sm font-medium transition-all
                        group hover:shadow-md
                        ${
                          activeLink === index
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                            : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600"
                        }
                      `}
                    >
                      <span className={`${activeLink === index ? "text-white" : "text-gray-600"}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight
                        className={`
                          transition-all duration-200 
                          ${activeLink === index ? 'text-white opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'}
                        `}
                        size={16}
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Account Button */}
            <div className="mt-auto pt-4 border-t border-gray-200 px-2">
              <button
                className="w-full py-2.5 lg:py-3 cursor-pointer rounded-lg lg:rounded-xl px-3 lg:px-4 
                  flex items-center justify-between gap-2 text-sm 
                  bg-gradient-to-r from-blue-500 to-indigo-500 text-white 
                  shadow-md hover:shadow-lg transition-all duration-200 
                  hover:from-blue-600 hover:to-indigo-600 
                  disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={accountNavigate}
                onMouseEnter={prefetchAccount}
                disabled={isNavigating}
              >
                <div className="flex items-center gap-2 lg:gap-3">
                  <CircleUser size={16} className="lg:w-4 lg:h-4" />
                  <span className="text-xs lg:text-sm">
                    {isNavigating ? "Loading..." : "Account"}
                  </span>
                </div>
                <ChevronRight size={14} className="lg:w-4 lg:h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default AsideDash;