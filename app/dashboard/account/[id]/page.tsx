"use client";

import Button from "@/components/UI/button";
import { useProfileStore } from "@/zustand/userProfileStore";
import { useSonnerStore } from "@/zustand/useSonner";
import { useSonnerDetailsStore } from "@/zustand/useSonnerDetailsStore";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import userImg from "../../../../public/user.svg";

const Page = () => {
  const { data: session } = useSession();
  const { addSonnerDetails } = useSonnerDetailsStore();
  const [isRoaming, setIsRoaming] = useState(false);
  const [circulate, setCirculate] = useState(false);
  const { setIsShow } = useSonnerStore();
  const { user } = useProfileStore();
  const router = useRouter();

  const feedbackOptions = [
    "Improvement related feedback",
    "Bug report",
    "Feature request",
    "Other",
  ];

  const currentPlan = user?.bonhivePlan;

  const createdDate = new Date(user.subscrption.createdDate);
  const currentDate = new Date();
  const diff = currentDate.getTime() - createdDate.getTime();
  const diffImDays = Math.round(diff / (1000 * 60 * 60 * 24)) + 1;

  const remainingDays = diffImDays;
  const [cancelNote, setCancelNote] = useState<string>("");

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
  const cancelSubscription = async () => {
    setCirculate(true);
    try {
      const response = await fetch("/api/cancel_subscrption", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const convert = await response.json();
      if (response.ok) {
        setCancelNote(convert.msg);
        setTimeout(() => {
          localStorage.removeItem("projects");
          router.push("/");
          location.reload();
        }, 3000);
      }
    } catch (error) {
      alert("Something went wrong");
      return error;
    }
  };

  const signout = () => {
    signOut({ callbackUrl: "/auth/register" });
    localStorage.clear();
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      {cancelNote && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          {cancelNote}
        </motion.div>
      )}

      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Hello, {session?.user.name} 👋
          </h1>
          <div className="ml-4 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden shadow-lg">
            {session?.user.image ? (
              <Image
                src={session.user.image}
                alt="user_img"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <Image
                src={userImg}
                alt="user_img"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            )}
          </div>
        </div>

        <p className="text-gray-300 mb-8 text-lg">
          Welcome to your account dashboard
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Card */}
          <motion.div
            className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {session?.user.name}
                  </h2>
                  <p className="text-gray-400">{session?.user.email}</p>
                </div>
                <span className="px-3 py-1 bg-indigo-900 text-indigo-200 rounded-full text-sm">
                  {user?.bonhivePlan || "User"}
                </span>
              </div>
            </div>

            {/* Plan Info */}
            <div className="px-6 pb-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-xl shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium opacity-80">
                      Current Plan
                    </p>
                    <p className="text-xl font-bold mt-1">{currentPlan}</p>
                  </div>
                  <div className="text-right">
                    {currentPlan === "Free" ? (
                      <p className="text-sm font-medium">Free plan</p>
                    ) : (
                      <div>
                        <p className="text-sm font-medium opacity-80">
                          Monthly plan
                        </p>
                        <p className="text-lg font-bold mt-1">
                          {remainingDays} / 30 Days
                        </p>
                      </div>
                    )}
                  </div>
                </div>

               
              </div>

              {remainingDays >= 0 && user.bonhivePlan === "Pro" && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={cancelSubscription}
                    disabled={circulate}
                    className={`mt-4 w-full bg-rose-600 hover:bg-rose-700 py-3 rounded-xl font-medium
                      ${
                        circulate
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 transition-colors"
                      }        
                      `}
                  >
                    {circulate ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        wait.....
                      </>
                    ) : (
                      <>cancel subscrption</>
                    )}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Feedback Form */}
          <motion.div
            className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700 p-6"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-bold text-white mb-2">
              Share your feedback
            </h3>
            <p className="text-gray-400 mb-6">
              We had love to hear your suggestions to improve our service.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Feedback Type
                </label>
                <select
                  value={inputValue.feedBack_type}
                  onChange={handleInput}
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Your Feedback
                </label>
                <textarea
                  rows={4}
                  value={inputValue.feedBack}
                  onChange={handleInput}
                  placeholder="Write your feedback here..."
                  name="feedBack"
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                ></textarea>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={handleSubmit}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-medium"
                  disabled={isRoaming}
                >
                  {isRoaming ? "Submitting..." : "Submit Feedback"}
                </button>
              </motion.div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  varient="bgFill"
                  className="w-full border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white py-3 rounded-xl font-medium"
                  onclick={signout}
                >
                  Logout
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
