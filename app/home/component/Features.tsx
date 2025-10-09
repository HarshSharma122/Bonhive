export const dynamic = "force-static"

import React from 'react';
import { motion } from 'framer-motion';
import { Feature } from '@/types/bonhive-types';

const Features: React.FC = () => {
  const features: Feature[] = [
    {
      id: 1,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security measures and 99.9% uptime guarantee.",
      icon: (
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
      ),
      color: "green"
    },
    {
      id: 2,
      title: "Intuitive Dashboard",
      description: "Manage everything from a clean, user-friendly interface designed for efficiency and ease of use.",
      icon: (
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
        </svg>
      ),
      color: "purple"
    },
    {
      id: 3,
      title: "Auto Detect Currency",
      description: "Bonhive provides auto-Detect currency features which helps user to manage everything in local currency",
      icon: (
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      color: "blue"
    },
    {
      id: 4,
      title: "Advanced Analytics",
      description: "Gain valuable insights with detailed analytics and customizable reports for data-driven decisions.",
      icon: (
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      ),
      color: "red"
    },
    {
      id: 5,
      title: "Smart Automation",
      description: "Automate repetitive tasks and workflows to focus on what matters most - your creative work.",
      icon: (
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
      color: "yellow"
    },
    {
      id: 6,
      title: "Client Management",
      description: "Streamline client communications, track interactions, and maintain perfect relationships effortlessly.",
      icon: (
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      ),
      color: "indigo"
    }
  ];

  const colorClasses: Record<Feature['color'], { bg: string; text: string; hover: string }> = {
    green: {
      bg: "from-green-50 to-emerald-100",
      text: "text-green-600",
      hover: "hover:from-green-100 hover:to-emerald-200"
    },
    purple: {
      bg: "from-purple-50 to-violet-100",
      text: "text-purple-600",
      hover: "hover:from-purple-100 hover:to-violet-200"
    },
    blue: {
      bg: "from-blue-50 to-cyan-100",
      text: "text-blue-600",
      hover: "hover:from-blue-100 hover:to-cyan-200"
    },
    red: {
      bg: "from-red-50 to-pink-100",
      text: "text-red-600",
      hover: "hover:from-red-100 hover:to-pink-200"
    },
    yellow: {
      bg: "from-yellow-50 to-amber-100",
      text: "text-yellow-600",
      hover: "hover:from-yellow-100 hover:to-amber-200"
    },
    indigo: {
      bg: "from-indigo-50 to-blue-100",
      text: "text-indigo-600",
      hover: "hover:from-indigo-100 hover:to-blue-200"
    }
  };



  return (
    <div id='features' className="min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Subtle Background Elements - Mobile Optimized */}
      <div className="absolute top-10 left-5 md:top-20 md:left-10 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-gentle-float"></div>
      <div className="absolute bottom-10 right-5 md:bottom-20 md:right-10 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-gentle-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse-soft"></div>

      {/* Enhanced Grid Overlay with Blue Tint */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section - Mobile Optimized */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-12 md:mb-20 px-2"
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 leading-tight"
          >
            Powerful Features
          </motion.h1>
          <motion.p
            transition={{ delay: 0.2 }}
            className="mt-4 md:mt-6 max-w-2xl mx-auto text-base md:text-xl text-gray-600 px-4"
          >
            Everything you need to streamline your freelance business and boost productivity
          </motion.p>
        </motion.div>

        {/* Features Grid - Mobile Optimized */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
         
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-2 sm:px-0"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ 
                scale: 1.02,
                y: -4,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative"
            >
              {/* Background Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[feature.color].bg} rounded-2xl md:rounded-3xl blur-lg md:blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Feature Card */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 h-full group-hover:shadow-xl">
                {/* Icon Container */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${colorClasses[feature.color].bg} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 backdrop-blur-sm border border-gray-200`}
                >
                  <div className={colorClasses[feature.color].text}>
                    {feature.icon}
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3 lg:mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 transition-all duration-300 line-clamp-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed group-hover:text-gray-700 transition-colors duration-300 line-clamp-3 md:line-clamp-none">
                  {feature.description}
                </p>

                {/* Hover Indicator - Hidden on mobile, visible on desktop */}
                <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-2 md:translate-x-4 transition-all duration-300 hidden md:flex">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>

                {/* Animated Border - Performance optimized for mobile */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-transparent via-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-transparent via-gray-900/10 to-transparent animate-shine"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mt-12 md:mt-20 px-2"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Ready to Transform Your Workflow?
            </h3>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-2">
              Join thousands of freelancers who are already boosting their productivity with Bonhive
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className=" bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base lg:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
            >
              Get Started Free
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;