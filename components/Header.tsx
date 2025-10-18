"use client";

import { useProfileStore } from "@/zustand/userProfileStore";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Roaming from "./Roaming";



const Header = () => {
  let isLoggedIn = false;
  const { status } = useSession();
  if (status == "authenticated") {
    isLoggedIn = true;
  }
  const [openBar, setOpenBar] = useState(false);
  const [isRoaming, setIsRoaming] = useState(false);
  const { user } = useProfileStore();
  
  const startRoaming = () => {
    setIsRoaming(true);
  };

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#price", label: "Pricing" },
    { href: "#features", label: "Features" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
      {isRoaming && <Roaming />}

      <AnimatePresence>
        {openBar && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 bg-gray-900 text-white z-50 lg:hidden border-l border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800">
              <div className="font-extrabold text-white text-2xl">Bonhive</div>
              <button
                onClick={() => setOpenBar(false)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col p-6 space-y-4 bg-gray-900 h-full">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setOpenBar(false)}
                  className="flex items-center justify-between p-4 text-lg font-semibold bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-300 group border border-gray-700"
                >
                  {item.label}
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </motion.a>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="pt-6 space-y-3 border-t border-gray-700 mt-4">
                {user?.isPlanSelected === true && (
                  <Link
                    href="/dashboard"
                    onClick={() => {
                      startRoaming();
                      setOpenBar(false);
                    }}
                    className="flex items-center justify-center w-full bg-white text-black hover:bg-gray-100 font-semibold px-4 py-3 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-300"
                  >
                    Go to Dashboard
                  </Link>
                )}

                {isLoggedIn ? (
                  <Link
                    href="/auth/login"
                    onClick={() => {
                      startRoaming();
                      setOpenBar(false);
                    }}
                    className="flex items-center justify-center w-full bg-black hover:bg-gray-600 text-white font-semibold px-4 py-3 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-600"
                  >
                    Sign In
                  </Link>
                ) : (
                  <Link
                    href="/auth/register"
                    onClick={() => setOpenBar(false)}
                    className="flex items-center justify-center w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-4 py-3 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg border border-gray-600"
                  >
                    Get Started Free
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-40  backdrop-blur-sm"
      >
        <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="font-extrabold text-black text-2xl md:text-3xl tracking-tight"
            >
              Bonhive
            </motion.div>
            <div className="w-2 h-2 bg-gray-900 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-1.5 text-sm rounded-xl font-medium transition-all duration-300 border border-transparent ${
                  item.href === "" 
                    ? "bg-gray-700 text-white shadow-inner border-gray-600" 
                    : "text-gray-800 hover:bg-gray-800 hover:text-white border-gray-800"
                }`}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {user?.isPlanSelected === true && (
              <Link
                href="/dashboard"
                onClick={startRoaming}
                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg text-sm hover:shadow-xl border border-gray-300"
              >
                Dashboard
              </Link>
            )}

            {isLoggedIn ? (
              <Link
                href="/auth/login"
                onClick={startRoaming}
                className="bg-black text-sm hover:bg-gray-600 text-white font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg border border-gray-600"
              >
                Sign In
              </Link>
            ) : (
              <Link
                href="/auth/register"
                className="bg-gradient-to-r text-sm from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl border border-gray-600"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenBar(true)}
            className="lg:hidden p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors duration-200 border border-gray-700"
          >
            <Menu className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </motion.header>
    </>
  );
};

export default Header;