"use client";

import Button from "@/components/UI/button";
import { useProfileStore } from "@/zustand/userProfileStore";
import { useSonnerStore } from "@/zustand/useSonner";
import { useSonnerDetailsStore } from "@/zustand/useSonnerDetailsStore";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import userImg from "../../../../public/user.svg";
import { Mail, Calendar, Star, LogOut, MessageSquare, Crown } from "lucide-react";


const Page = () => {
  const { data: session } = useSession();
  const { addSonnerDetails } = useSonnerDetailsStore();
  const [isRoaming, setIsRoaming] = useState(false);
  const { setIsShow } = useSonnerStore();
  const { user } = useProfileStore();

  const feedbackOptions = [
    "Improvement related feedback",
    "Bug report",
    "Feature request",
    "Other",
  ];

  const currentPlan = user?.bonhivePlan;

  const createdDate = new Date(user.subscrption.createdDate);
  const [inputValue, setInputValue] = useState({
    feedBack_type: "",
    feedBack: "",
  });

  const handleInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!inputValue.feedBack_type || !inputValue.feedBack) {
        addSonnerDetails("Please fill all fields");
        setIsShow(true);
        setTimeout(() => setIsShow(false), 3000);
        return;
      }

      setIsRoaming(true);
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedBack_type: inputValue.feedBack_type,
          feedBack: inputValue.feedBack,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setInputValue({
          feedBack_type: "",
          feedBack: "",
        });
        addSonnerDetails(data.msg);
        setIsShow(true);
        setTimeout(() => {
          setIsRoaming(false);
          setIsShow(false);
        }, 3000);
      }
    } catch (error) {
      addSonnerDetails("Something went wrong!");
      setIsShow(true);
      setTimeout(() => setIsShow(false), 3000);
      return error;
    }
  };

  const signout = () => {
    signOut({ callbackUrl: "/auth/register" });
    localStorage.clear();
  };

  const getPlanColor = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'premium':
        return 'from-amber-500 to-orange-500';
      case 'pro':
        return 'from-purple-500 to-pink-500';
      case 'enterprise':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4">
     

      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden shadow-lg flex items-center justify-center">
              {session?.user.image ? (
                <Image
                  src={session.user.image}
                  alt="user_img"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image
                  src={userImg}
                  alt="user_img"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              )}
            </div>
            <div className="ml-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Hello, {session?.user.name} 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome to your account dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Card */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {session?.user.name}
                  </h2>
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-2" />
                    <span>{session?.user.email}</span>
                  </div>
                </div>
                <span className={`px-4 py-2 bg-gradient-to-r ${getPlanColor(currentPlan)} text-white rounded-full text-sm font-medium shadow-lg`}>
                  {user?.bonhivePlan || "Free"}
                </span>
              </div>

              {/* Plan Info */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Crown size={24} className="mr-3" />
                    <div>
                      <p className="text-sm font-medium opacity-90">
                        Current Plan
                      </p>
                      <p className="text-2xl font-bold mt-1">{currentPlan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {currentPlan === "Free" ? (
                      <p className="text-sm font-medium opacity-90">Free plan</p>
                    ) : (
                      <div>
                        <p className="text-sm font-medium opacity-90 flex items-center">
                          <Calendar size={14} className="mr-1" />
                          Started on
                        </p>
                        <p className="text-lg font-bold mt-1">
                          {createdDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <Star size={20} className="text-amber-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Account Status</p>
                      <p className="font-semibold text-gray-900">Active</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <Calendar size={20} className="text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-semibold text-gray-900">
                        {new Date().getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feedback Form */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <MessageSquare size={24} className="text-blue-600 mr-3" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Share your feedback
                </h3>
                <p className="text-gray-600">
                  We had love to hear your suggestions to improve our service.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-3">
                  Feedback Type
                </label>
                <select
                  value={inputValue.feedBack_type}
                  onChange={handleInput}
                  className="w-full p-4 bg-white text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  name="feedBack_type"
                >
                  <option value="">Select feedback type</option>
                  {feedbackOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-3">
                  Your Feedback
                </label>
                <textarea
                  rows={5}
                  value={inputValue.feedBack}
                  onChange={handleInput}
                  placeholder="Write your detailed feedback here... We're always looking for ways to improve!"
                  name="feedBack"
                  className="w-full p-4 bg-white text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                ></textarea>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={handleSubmit}
                  disabled={isRoaming}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRoaming ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </motion.div>
            </div>

            {/* Logout Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  varient="bgFill"
                  className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center"
                  onclick={signout}
                >
                  <LogOut size={18} className="mr-2" />
                  Logout Account
                </Button>
              </motion.div>
              <p className="text-center text-gray-500 text-sm mt-3">
                Secure and encrypted account management
              </p>
            </div>
          </motion.div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl mr-4">
                <Star size={20} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Premium Support</h4>
                <p className="text-gray-600 text-sm">24/7 customer care</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl mr-4">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Account Security</h4>
                <p className="text-gray-600 text-sm">Protected & encrypted</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl mr-4">
                <MessageSquare size={20} className="text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Quick Response</h4>
                <p className="text-gray-600 text-sm">Fast feedback processing</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;