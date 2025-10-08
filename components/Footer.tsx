"use client"

import { FiLinkedin, FiTwitter } from "react-icons/fi";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-full relative overflow-hidden border-t border-gray-700">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl animate-float-slow"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-float-slow-delayed"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="relative z-10">
        <div className="flex flex-col p-8 md:p-10 gap-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            {/* Founder Contact Section */}
            <div className="flex-1">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl font-bold text-white mb-4 bg-clip-text bg-gradient-to-r from-white to-gray-300"
              >
                Connect with Founder
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-gray-400 mb-4 max-w-md"
              >
                Have questions or want to discuss potential collaborations? Reach out directly.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-4"
              >
                <motion.a 
                  href="https://www.linkedin.com/in/harsh-sharma016" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-gray-700/50 backdrop-blur-sm border border-gray-600 flex items-center justify-center rounded-xl hover:bg-gray-600/50 hover:border-gray-500 transition-all duration-300 group"
                >
                  <FiLinkedin className="text-white text-xl group-hover:text-gray-200 transition-colors duration-300" />
                </motion.a>
                <motion.a 
                  href="https://x.com/harsh444577" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-gray-700/50 backdrop-blur-sm border border-gray-600 flex items-center justify-center rounded-xl hover:bg-gray-600/50 hover:border-gray-500 transition-all duration-300 group"
                >
                  <FiTwitter className="text-white text-xl group-hover:text-gray-200 transition-colors duration-300" />
                </motion.a>
              </motion.div>
            </div>

            {/* Additional Links Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-4"
            >
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <motion.a 
                  href="#features"
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  Features
                </motion.a>
                <motion.a 
                  href="#price"
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  Pricing
                </motion.a>
                <motion.a 
                  href="#contact"
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  Contact
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-4"
          ></motion.div>

          {/* Copyright Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center"
          >
            <div className="text-gray-400 text-sm">
              © 2025 Bonhive. All rights reserved.
            </div>
            <div className="text-gray-500 text-xs">
              Built for modern freelancers who value their time and creativity
            </div>
          </motion.div>
        </div>
      </div>

    
    </div>
  );
};

export default Footer;