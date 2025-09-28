"use client";

import { useProfileStore } from "@/zustand/userProfileStore";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
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
  return (
    <>
      {isRoaming && <Roaming />}

      {openBar && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className={`bg-black  text-white lg:hidden sm:hidden top-0 right-0 left-0 h-screen w-screen absolute`}
        >
          <div className="flex items-center justify-between px-3 py-2">
            <X
              onClick={() => setOpenBar(false)}
              className="flex font-semibold  border-1 rounded-full bg-white text-black cursor-pointer"
            />
            <aside className="flex gap-2">
              {user?.isPlanSelected === true && (
                <Link
                  href="/dashboard"
                  className="bg-[#0096c7] hover:bg-blue-500 text-white px-3 py-1 rounded-md  hover:scale-105 transition duration-300 cursor-pointer"
                >
                  DashBoard
                </Link>
              )}

              {isLoggedIn ? (
                <>
                  <Link
                    href="/auth/login"
                    className="bg-[#0096c7] hover:bg-blue-500 text-white px-3 py-1 rounded-md hover:scale-105 transition duration-300 cursor-pointer"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <Link
                  href="/auth/register"
                  className="bg-[#0096c7] hover:bg-blue-500 px-3 py-1 rounded-md text-white hover:scale-105 transition duration-300 cursor-pointer"
                >
                  Register
                </Link>
              )}
            </aside>
          </div>

          <nav className="flex flex-col items-center justify-center  gap-7 mt-20 text-xl">
            <a
              href=""
              className="font-semibold bg-[#fff] text-black px-2 transition-all duration-300 rounded-md"
            >
              Home
            </a>

            <a
              href="#price"
              className=" hover:bg-[#fff] hover:text-black hover:px-2 transition-all duration-300 rounded-md"
            >
              Pricing
            </a>
            <a
              href="#features"
              className="  hover:bg-[#fff] hover:text-black hover:px-2 transition-all  rounded-md duration-300"
            >
              Features
            </a>
            <a
              href="#contact"
              className="  hover:bg-[#fff] hover:text-black hover:px-2 transition-all  rounded-md duration-300"
            >
              Contacts
            </a>
          </nav>
        </motion.div>
      )}
      <div className="flex items-center justify-between py-3 text-white bg-black px-4">
        <div className="font-extrabold text-white text-3xl">Bonhive</div>

        <nav className="lg:flex sm:flex hidden gap-10 text-sm items-center justify-center">
          <a
            href=""
            className="font-semibold bg-[#0096c7] text-white px-2 py-2 transition-all duration-300 rounded-md"
          >
            Home
          </a>

          <div className="flex gap-3 text-gray-500">
            <a
              href="#price"
              className=" hover:bg-[#0096c7] text-white transition-all px-2 py-2 duration-300 rounded-md"
            >
              Pricing
            </a>
            <a
              href="#features"
              className="  hover:bg-[#0096c7] text-white transition-all px-2 py-2 duration-300 rounded-md"
            >
              Features
            </a>
            <a
              href="#contact"
              className="  hover:bg-[#0096c7] text-white transition-all duration-300 rounded-md px-2 py-2"
            >
              Contacts
            </a>
          </div>
        </nav>

        <aside className="lg:flex sm:flex hidden gap-2">
          {user?.isPlanSelected === true && (
            <Link
              href="/dashboard"
              onClick={startRoaming}
              className="bg-[#0096c7] hover:bg-blue-500 text-white px-3 py-1 rounded-md  hover:scale-105 transition duration-300 cursor-pointer"
            >
              DashBoard
            </Link>
          )}

          {isLoggedIn ? (
            <>
              <Link
                href="/auth/login"
                onClick={startRoaming}
                className="bg-[#0096c7] hover:bg-blue-500 text-white px-3 py-1 rounded-md hover:scale-105 transition duration-300 cursor-pointer"
              >
                Login
              </Link>
            </>
          ) : (
            <Link
              href="/auth/register"
              className="bg-[#0096c7] hover:bg-blue-500 px-3 py-1 rounded-md text-white hover:scale-105 transition duration-300 cursor-pointer"
            >
              Register
            </Link>
          )}
        </aside>

        <span
          onClick={() => setOpenBar(true)}
          className="lg:hidden sm:hidden flex"
        >
          <Menu />
        </span>
      </div>
    </>
  );
};

export default Header;
