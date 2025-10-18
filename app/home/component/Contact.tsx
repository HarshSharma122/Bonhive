"use client";
import React, { useState } from "react";

import { useSonnerStore } from "@/zustand/useSonner";
import { useSonnerDetailsStore } from "@/zustand/useSonnerDetailsStore";
import { motion } from "framer-motion";
import contactForm from "@/utilis/action";

const Contact = () => {
  const { addSonnerDetails } = useSonnerDetailsStore();
  const [isRoaming, setIsRoaming] = useState<boolean>(false);
  const { setIsShow } = useSonnerStore();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsRoaming(true);
      await contactForm(formData);
      addSonnerDetails("Message sent successfully!");
      setFormData({ full_name: "", email: "", subject: "", message: "" });
    } catch (error) {
      addSonnerDetails("Something went wrong!");
      return error
    } finally {
      setIsRoaming(false);
    }
  };

  return (
    <div
      id="contact"
      className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden"
    >
      {/* Subtle Background Elements */}
      <div className="absolute top-10 left-5 md:top-20 md:left-10 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-gentle-float"></div>
      <div className="absolute bottom-10 right-5 md:bottom-20 md:right-10 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-gentle-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse-soft"></div>

      {/* Enhanced Grid Overlay with Blue Tint */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700">
            Contact Us
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Have questions or want to work together? We had love to hear from
            you.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-3xl transition-all duration-500"
        >
          <div className="md:grid md:grid-cols-3">
            {/* Contact Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="md:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-8 text-white border-r border-gray-700"
            >
              <h3 className="text-2xl font-bold mb-8 bg-clip-text bg-gradient-to-r from-white to-gray-300">
                Get in Touch
              </h3>

              <div className="space-y-8">
                <div className="flex items-start group">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30"
                  >
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </motion.div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-white">Email</p>
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                      harsh444577@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30"
                  >
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </motion.div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-white">Location</p>
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                      India
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-12 pt-8 border-t border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Why Choose Us?
                </h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    24-48 hour response time
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="md:col-span-2 py-12 px-8"
            >
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div className="group">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-3 group-hover:text-gray-900 transition-colors duration-300"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      id="name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 hover:border-gray-400 shadow-sm"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-3 group-hover:text-gray-900 transition-colors duration-300"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 hover:border-gray-400 shadow-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="group">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-3 group-hover:text-gray-900 transition-colors duration-300"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 hover:border-gray-400 shadow-sm"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="group">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-3 group-hover:text-gray-900 transition-colors duration-300"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 hover:border-gray-400 shadow-sm resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-4"
                >
                  <button
                    type="submit"
                    disabled={isRoaming}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
                      isRoaming
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-gray-800 hover:to-gray-600 hover:shadow-xl"
                    }`}
                  >
                    {isRoaming ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Send Message
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                </motion.div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    We typically respond within 24-48 hours
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>

        {/* Additional Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-6">
            Prefer other ways to get in touch?
          </p>
          <div className="flex justify-center space-x-6">
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              href="mailto:harsh444577@gmail.com"
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email Directly
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
