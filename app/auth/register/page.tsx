"use client";

import Button from "@/components/UI/button";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { cache, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
const Page = cache(() => {
  const router = useRouter();
  const [isRoaming, setIsRoaming] = useState(false);
  const [msg, setMsg] = useState("");
  const [inputValue, setInputValue] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const registerAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRoaming(true);
    try {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: inputValue.username,
          email: inputValue.email,
          password: inputValue.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => setMsg(data.message));

      setTimeout(() => {
        setIsRoaming(false);
      }, 2000);
      router.replace("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {msg && <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="absolute top-10 right-10 bg-white px-4  py-1">{msg}</motion.div>}
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Join Our Community
          </h2>
          <p className="text-gray-600">Create your account in seconds</p>
        </div>

        <form className="space-y-5" onSubmit={registerAccount}>
          <div className="space-y-1">
            <label className="block font-medium text-gray-700">Username</label>
            <input
              type="text"
              required
              name="username"
              placeholder="Enter your username"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2a9d8f] focus:border-transparent focus:outline-none transition-all"
              value={inputValue.username}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              name="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2a9d8f] focus:border-transparent focus:outline-none transition-all"
              value={inputValue.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="block font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              name="password"
              placeholder="Create a password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2a9d8f] focus:border-transparent focus:outline-none transition-all"
              value={inputValue.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4 pt-2">
            <input
              type="submit"
              disabled={isRoaming ? true : false}
              value={`${isRoaming ? "Wait..." : "Register"}`}
              className={`${
                isRoaming ? " bg-[#10453f]" : ""
              } flex-1 py-3 bg-[#111] px-3 rounded-md text-white hover:scale-105 transition duration-300 cursor-pointer`}
            />

            <Link href="/auth/login">
              <Button varient="bgBlank" className="flex-1 py-3">
                Login
              </Button>
            </Link>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => signIn("google" , {callbackUrl:'/'})}
            className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 hover:shadow-sm transition-all"
          >
            <FaGoogle className="text-red-500 text-lg" />
            <span>Google</span>
          </button>

          <button
            onClick={() => signIn("github" , {callbackUrl:'/'})}
            className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 hover:shadow-sm transition-all"
          >
            <FaGithub className="text-gray-800 text-lg" />
            <span>GitHub</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default Page;
