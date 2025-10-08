import React, { useState, useEffect } from "react";
import Image from "next/image";
import img from "../../../public/bonhive_Dash_first.png";
import { useSession } from "next-auth/react";
import { useProfileStore } from "@/zustand/userProfileStore";
import Link from "next/link";
import { motion } from "framer-motion";

const Front = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    setIsMounted(true);
    // Generate particles only on client side
    setParticles(
      Array.from({ length: 15 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  let isLoggedIn = false;
  const { status } = useSession();
  const { user } = useProfileStore();

  if (status == "authenticated") {
    isLoggedIn = true;
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        <div className="max-w-6xl w-full relative z-10">
          <div className="text-center mb-20">
            <div className="relative inline-block mb-10">
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl blur-lg opacity-60"></div>
              <h1 className="relative text-7xl md:text-8xl font-bold tracking-normal text-gray-900 leading-tight">
                Bonhive
              </h1>
            </div>
            <div className="animate-pulse bg-gradient-to-r from-blue-100 to-indigo-100 h-12 w-64 mx-auto rounded-2xl mb-14"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Enhanced Gradient Background Elements */}
      <div className="absolute top-10 left-5 md:top-20 md:left-10 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-gentle-float"></div>
      <div className="absolute bottom-10 right-5 md:bottom-20 md:right-10 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-gentle-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse-soft"></div>

      {/* Enhanced Grid Overlay with Blue Tint */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      {/* Floating Particles */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-lg shadow-blue-200"
              initial={{
                x: particle.x,
                y: particle.y,
                opacity: 0,
              }}
              animate={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: particle.delay,
              }}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-6xl w-full relative z-10">
        {/* Elegant Header Section */}
        <div className="text-center mb-7">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative inline-block mb-10"
          >
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl blur-lg opacity-60"></div>
            <h1 className="relative text-4xl md:text-6xl lg:text-8xl font-extrabold text-gray-900 px-4">
              The all-in-one CRM built for freelancers.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto mb-14"
          >
            <div className="text-base md:text-lg font-semibold px-6 py-4 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg shadow-blue-100/50 text-gray-600 leading-relaxed">
              Handle clients, projects, and payments — without the chaos. Everything you need to manage your freelance business efficiently. Smart. Simple. Built to help you focus on the work that matters.
            </div>
          </motion.div>

          {/* Refined CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-4 md:gap-5 flex-wrap"
          >
            {status === "authenticated" ? (
              user?.isPlanSelected === true ? (
                <Link
                  href="/dashboard"
                  className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:opacity-90 px-6 md:px-9 py-3.5 md:py-4.5 rounded-2xl text-sm md:text-base shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-400 cursor-pointer overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Go to Dashboard
                    <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                      →
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                </Link>
              ) : (
                <Link
                  href="#price"
                  className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:opacity-90 px-6 md:px-9 py-3.5 md:py-4.5 rounded-2xl text-sm md:text-base shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-400 cursor-pointer overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Choose Plan
                    <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                      →
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                </Link>
              )
            ) : (
              <Link
                href="/auth/register"
                className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:opacity-90 px-6 md:px-9 py-3.5 md:py-4.5 rounded-2xl text-sm md:text-base shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-400 cursor-pointer overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Today
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                    →
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
              </Link>
            )}

            {/* Sophisticated Secondary Buttons */}
            <div className="flex gap-3 md:gap-4">
              {isLoggedIn && (
                <Link
                  href="/auth/login"
                  className="bg-white/90 backdrop-blur-sm text-gray-900 shadow-lg shadow-blue-100/30 hover:shadow-xl hover:shadow-blue-200/40 px-5 md:px-7 py-3.5 md:py-4.5 rounded-2xl font-medium hover:scale-[1.02] transition-all duration-400 cursor-pointer hover:bg-white"
                >
                  Sign in
                </Link>
              )}

              {!isLoggedIn && (
                <Link
                  href="/auth/register"
                  className="bg-white/90 backdrop-blur-sm text-gray-900 shadow-lg shadow-blue-100/30 hover:shadow-xl hover:shadow-blue-200/40 px-5 md:px-7 py-3.5 md:py-4.5 rounded-2xl font-medium hover:scale-[1.02] transition-all duration-400 cursor-pointer hover:bg-white"
                >
                  Sign up
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="relative mb-20"
        >
          <div className="relative w-full h-64 md:h-[400px] lg:h-[500px]">
            <div className="absolute -inset-4 md:-inset-6 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 rounded-3xl blur-xl opacity-60"></div>
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20">
              <Image
                src={img}
                alt="Bonhive dashboard interface"
                fill
                className="object-contain transition-transform duration-600"
                priority
              />
            </div>
          </div>
        </motion.div>

        {/* Balanced Value Proposition Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col lg:flex-row items-stretch justify-between gap-6 md:gap-8 mb-10"
        >
          {/* Main Value Card */}
          <div className="group relative bg-white/90 backdrop-blur-sm p-6 md:p-9 rounded-3xl shadow-2xl shadow-blue-100/30 hover:shadow-3xl hover:shadow-blue-200/40 transition-all duration-500 hover:-translate-y-2 flex-1">
            <div className="absolute -top-3 -left-3 w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-2xl blur-md opacity-60"></div>
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex gap-2">
                <div className="w-2 h-10 md:h-14 bg-gradient-to-b from-blue-600 to-indigo-700 rounded-full animate-soft-bounce"></div>
                <div className="w-2 h-6 md:h-9 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full self-end animate-soft-bounce delay-400"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 md:mb-3">
                  Streamlined Management
                </h2>
                <p className="text-gray-600 text-base md:text-lg font-normal">
                  Focus on your creative work
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-400 transform group-hover:translate-x-1.5">
                <div className="w-9 h-9 md:w-11 md:h-11 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-md shadow-blue-500/30">
                  <span className="text-white font-medium text-sm md:text-base">→</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Value Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 flex-1">
            {[
              {
                title: "Time",
                desc: "Save hours weekly",
                icon: "⏱️",
                color: "from-blue-500 to-indigo-600",
              },
              {
                title: "Focus",
                desc: "Reduce distractions",
                icon: "🎯",
                color: "from-blue-500 to-indigo-600",
              },
              {
                title: "Growth",
                desc: "Scale efficiently",
                icon: "📈",
                color: "from-blue-500 to-indigo-600",
              },
              {
                title: "Peace",
                desc: "Work stress-free",
                icon: "✨",
                color: "from-blue-500 to-indigo-600",
              },
            ]?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="group relative bg-white/90 backdrop-blur-sm p-5 md:p-7 rounded-2xl shadow-xl shadow-blue-100/20 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                <div className="relative z-10 text-center">
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-5 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-400`}
                  >
                    <span className="text-white text-lg md:text-xl">{item.icon}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-2 md:mb-3 group-hover:text-gray-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm font-normal opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-400">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mb-15"
        >
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-12 overflow-hidden shadow-2xl shadow-blue-100/30">
            <div className="absolute -top-12 -right-12 w-24 h-24 md:w-32 md:h-32 bg-blue-100 rounded-full opacity-60 blur-xl"></div>
            <div className="absolute -bottom-12 -left-12 w-24 h-24 md:w-32 md:h-32 bg-indigo-100 rounded-full opacity-60 blur-xl"></div>

            <div className="relative z-10">
              <h3 className="text-xl md:text-3xl font-semibold text-gray-900 mb-4 md:mb-6">
                Ready to simplify your workflow?
              </h3>
              <p className="text-gray-600 text-base md:text-lg font-normal mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
                Join freelancers who are focusing on their craft while we handle the management.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 md:px-11 py-4 md:py-5 rounded-2xl font-semibold text-sm md:text-base shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-400 cursor-pointer"
              >
                Begin your journey
                <span className="text-base md:text-lg group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Front;