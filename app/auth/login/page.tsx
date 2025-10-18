"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

const Page = (() => {
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

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRoaming(true);
    const result = await signIn("credentials", {
      username: inputValue.username,
      email: inputValue.email,
      password: inputValue.password,
      redirect: false,
    });

    if (result?.error) {
      setMsg(result.error);
      router.push("/auth/register");
    } else {
      router.push("/");
      localStorage.clear();
    }
    setTimeout(() => {
      setIsRoaming(false);
    }, 2000);
  };

  const googleSignin = () => {
    signIn("google", { callbackUrl: "/" });
    localStorage.clear();
  };

  const githubSignin = () => {
    signIn("github", { callbackUrl: "/" });
    localStorage.clear();
  };

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-10 right-10 bg-white px-4  py-1"
        >
          {msg}
        </motion.div>
      )}
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Login your account
          </h2>
        </div>

        <form onSubmit={(e) => formSubmit(e)} className="space-y-5">
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
            <button
              type="submit"
              disabled={isRoaming ? true : false}
              value={`${isRoaming ? "Wait..." : "Login"}`}
              className={`${
                isRoaming ? " bg-[#10453f]" : ""
              } flex-1 py-3 bg-[#111] px-3 rounded-md text-white hover:scale-105 transition duration-300 cursor-pointer`}
            >
              Login
            </button>
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
            onClick={googleSignin}
            className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 hover:shadow-sm transition-all"
          >
            <FaGoogle className="text-red-500 text-lg" />
            <span>Google</span>
          </button>

          <button
            onClick={githubSignin}
            className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 hover:shadow-sm transition-all"
          >
            <FaGithub className="text-gray-800 text-lg" />
            <span>GitHub</span>
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Dont have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[#2a9d8f] font-medium hover:underline"
            >
              Register{" "}
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
});

export default Page;
