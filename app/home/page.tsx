"use client";
import { useProfileStore } from "@/zustand/userProfileStore";
import { useSonnerStore } from "@/zustand/useSonner";
import { useSonnerDetailsStore } from "@/zustand/useSonnerDetailsStore";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cache, Suspense, useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import Front from "../home/component/Front";
import Contact from "./component/Contact";
import Features from "./component/Features";
import Pricing from "./component/Pricing";
import Loader from "./loader";
import { useCurrencyPrefStore } from "@/zustand/useCurrencyprefStore";
const Home = cache(() => {
  const { isShow, setIsShow } = useSonnerStore();
  const { user, setUser } = useProfileStore();
  const { sonnerDetails , addSonnerDetails} = useSonnerDetailsStore();
  
  const [isRoaming, setIsRoaming] = useState(false);
  const [openPref, setOpenPref] = useState<boolean>(true);
  const{addCurrencyPref} = useCurrencyPrefStore();
  const [userLanguage, setUserLanguage] = useState("");
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRoaming(true);
    try {
      await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userLanguage: userLanguage,
        }),
        credentials: "include",
      })
        .then((res) => res.json())
        .then(() => setOpenPref(false));
        addCurrencyPref(userLanguage);
      setTimeout(() => {
        setIsRoaming(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };





  
  let isOpen = false;
  // this is for if user delete the currency pref from the localhost
  useEffect(() => {
    const fn = async () => {
      try {
        const response = await fetch("/api/user", 
          {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          next:{revalidate:180}
        }
      );
        const data = await response.json();
        if (response.ok) {
          setUser(data.msg);
          isOpen = true;
        } else {
          setIsShow(true)
          addSonnerDetails(data.msg);
          isOpen = false;
        }
      } catch (error) {
        addSonnerDetails("Something went wrong! please try again later")
      }
    };

    fn();
  }, []);

  return (
    <>
      {isShow && (
        <div className="bg-gray-200 text-xs flex items-center text-black rounded-md border-1 border-gray-200 shadow-md fixed top-0 gap-2 right-0">
          <X onClick={() => setIsShow(false)} />
          <h1 className="font-semibold">{sonnerDetails}</h1>
        </div>
      )}
      <div className="scroll-smooth">
        <Front />
        <Suspense fallback={<Loader />}>
          <Pricing />
          <Features />
          <Contact />
        </Suspense>
        
        {isOpen ||  !user?.userLanguage && (
          <AnimatePresence>
            {openPref && (
              <div className="fixed inset-0 bg-gray-200 bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                      some additional question
                    </h2>
                    <button
                      onClick={() => setOpenPref(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form className="p-6 space-y-5" onSubmit={save}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select your local currency*
                      </label>
                      <select
                        name="userLanguage"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={userLanguage}
                        onChange={(e) => setUserLanguage(e.target.value)}
                      >
                        {["select language", "INR"].map((lanuage, index) => (
                          <option key={index} value={lanuage}>
                            {lanuage}
                          </option>
                        ))}
                      </select>
                    </motion.div>

                    <div className="flex justify-end pt-4 gap-3">
                      <button
                        type="button"
                        onClick={() => setOpenPref(false)}
                        className="px-5 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isRoaming}
                        className={`px-6 py-2.5 rounded-lg font-medium ${
                          isRoaming
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 transition-colors"
                        } text-white flex items-center gap-2`}
                      >
                        {isRoaming ? (
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
                            saving...
                          </>
                        ) : (
                          <>
                            <FiSave size={16} />
                            save
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        )}


      </div>
    </>
  );
});

export default Home;
