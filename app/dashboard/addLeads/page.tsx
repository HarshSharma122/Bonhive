"use client";

import Button from "@/components/UI/button";
import { useCurrencyPrefStore } from "@/zustand/useCurrencyprefStore";
import { useProjectStore } from "@/zustand/useProjectStore";
import { useProfileStore } from "@/zustand/userProfileStore";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


const Page = () => {
  const router = useRouter();
  const [isRoaming, setIsRoaming] = useState(false);
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const { projects} = useProjectStore();
  const { user } = useProfileStore();
  const [inputValue, setInputValue] = useState({
    clientName: "",
    clientBudget: "",
    clientLanguage: "INR",
    email: "",
    contact: "",
    location: "",
    projectName: "",
    bidAmount: "",
    desc: "",
    duration: "",
    notes: "",
    leadSource: "",
    proposal: "",
    hourlyRate: "",
  });

  const [IshourBillable, setIsHourBillable] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMessage, setShowMessage] = useState(false);
  const{currencyPref} = useCurrencyPrefStore();

  // Show message for 3 seconds
  useEffect(() => {
    if (msg) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        setMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!inputValue.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    
    if (!inputValue.clientBudget.trim()) {
      newErrors.clientBudget = "Client budget is required";
    } else if (parseFloat(inputValue.clientBudget) <= 0) {
      newErrors.clientBudget = "Budget must be greater than 0";
    }
    
    if (!inputValue.leadSource) {
      newErrors.leadSource = "Please select a lead source";
    }
    
    if (inputValue.leadSource === "freelancing site" && !inputValue.proposal.trim()) {
      newErrors.proposal = "Proposal is required for freelancing sites";
    }
    
    if (!inputValue.notes.trim()) {
      newErrors.notes = "Notes are required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!inputValue.projectName.trim()) {
      newErrors.projectName = "Project name is required";
    }
    
    if (!inputValue.duration) {
      newErrors.duration = "Please select a submission date";
    }
    
    if (!IshourBillable && !inputValue.bidAmount.trim()) {
      newErrors.bidAmount = "Bid amount is required for fixed-price projects";
    } else if (!IshourBillable && parseFloat(inputValue.bidAmount) <= 0) {
      newErrors.bidAmount = "Bid amount must be greater than 0";
    }
    
    if (IshourBillable && !inputValue.hourlyRate.trim()) {
      newErrors.hourlyRate = "Hourly rate is required for hourly projects";
    } else if (IshourBillable && parseFloat(inputValue.hourlyRate) <= 0) {
      newErrors.hourlyRate = "Hourly rate must be greater than 0";
    }
    
    if (!inputValue.desc.trim()) {
      newErrors.desc = "Project description is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, leadSource: e.target.value });
    
    if (errors.leadSource) {
      setErrors({ ...errors, leadSource: "" });
    }
  };

  const registerAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setIsRoaming(true);

    try {
      const response = await fetch("/api/projectform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: inputValue.projectName,
          clientName: inputValue.clientName,
          clientLanguage: inputValue.clientLanguage,
          bidAmount: inputValue.bidAmount,
          desc: inputValue.desc,
          duration: inputValue.duration,
          clientBudget: inputValue.clientBudget,
          email: inputValue.email,
          contact: inputValue.contact,
          location: inputValue.location,
          notes: inputValue.notes,
          leadSource: inputValue.leadSource,
          proposal: inputValue.proposal,
          IshourBillable: IshourBillable,
          hourlyRate: inputValue.hourlyRate,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Add project to Zustand store
        setMsg("Project added successfully!");
        setTimeout(() => {
          setIsRoaming(false);
          router.push("/dashboard");
        }, 2000);
      } else {
        setMsg(data.message || "Failed to add project");
        setIsRoaming(false);
      }
    } catch (error) {
      setMsg("Something went wrong");
      console.log(error);      
      setIsRoaming(false);
    }
  };

  const stepFn = (direction: "next" | "prev") => {
    if (direction === "next" && step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    } else if (direction === "prev" && step === 2) {
      setStep(1);
    }
  };

  if (projects.length >= 5 && user.bonhivePlan !="Pro") {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4 md:ml-10">
        <motion.div 
          className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upgrade Required</h2>
          <p className="text-gray-600 mb-6">
            You have reached the maximum number of projects for the free plan. Upgrade to PRO to add more projects.
          </p>
          <Button 
            onclick={() => router.push("/")} 
            varient="bgFill" 
            className="px-6 py-3"
          >
            View Pricing Plans
          </Button>
        </motion.div>
      </div>
    );
  }


  return (
    <>
      <AnimatePresence>
        {showMessage && (
          <motion.div 
            className="fixed top-4 right-4 bg-green-100 text-green-800 px-4 py-3 rounded-md border border-green-200 shadow-md z-50 flex items-center gap-2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
   
      <motion.div
        className="flex flex-col min-h-screen items-center justify-center p-4 md:ml-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Stepper */}
        <div className="flex items-center justify-center w-full max-w-2xl mb-12 relative">
          <div className="flex items-center z-10">
            <div className="flex flex-col items-center mr-16">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step === 1
                    ? "bg-teal-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                <span className="font-medium">1</span>
              </div>
              <span
                className={`text-sm font-medium ${
                  step === 1 ? "text-teal-600" : "text-gray-500"
                }`}
              >
                Client Details
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step === 2
                    ? "bg-teal-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                <span className="font-medium">2</span>
              </div>
              <span
                className={`text-sm font-medium ${
                  step === 2 ? "text-teal-600" : "text-gray-500"
                }`}
              >
                Project Details
              </span>
            </div>
          </div>

          <div className="absolute top-5 left-20 right-20 h-1 bg-gray-200">
            <div
              className={`h-full bg-teal-500 transition-all duration-300 ${
                step === 2 ? "w-full" : "w-0"
              }`}
            ></div>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
          {/* Step 1: Client Details */}
          {step === 1 && (
            <motion.div 
              className="p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Add Client Details
                </h2>
                <p className="text-gray-500">
                  Fill in the basic information about your client
                </p>
              </div>

              <form className="space-y-6 text-black">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="clientName"
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                        errors.clientName ? "border-red-500" : "border-gray-300"
                      }`}
                      value={inputValue.clientName}
                      onChange={handleChange}
                    />
                    {errors.clientName && (
                      <p className="mt-1 text-sm text-red-500">{errors.clientName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="client@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      value={inputValue.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Details
                    </label>
                    <input
                      type="text"
                      name="contact"
                      placeholder="+1 234 567 890"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      value={inputValue.contact}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="New York, USA"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      value={inputValue.location}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client Budget*
                      </label>
                      <div className={`flex items-center px-4 py-3 border rounded-lg focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition-all ${
                        errors.clientBudget ? "border-red-500" : "border-gray-300"
                      }`}>
                        <span className="text-gray-500 mr-2">{inputValue.clientLanguage}</span>
                        <input
                          type="number"
                          name="clientBudget"
                          placeholder="5,000"
                          className="flex-1 focus:outline-none"
                          required
                          min="0"
                          step="0.01"
                          value={inputValue.clientBudget}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.clientBudget && (
                        <p className="mt-1 text-sm text-red-500">{errors.clientBudget}</p>
                      )}
                    </div>
                    <div className="w-40">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency*
                      </label>
                      <select
                        required
                        value={inputValue.clientLanguage}
                        onChange={handleChange}
                        name="clientLanguage"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      >
                        <option value="">select currency</option>
                        <option value="INR">INR</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Source *
                  </label>
                  <div className="flex items-center gap-10">
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        id="freelancingSites"
                        value="freelancing site"
                        checked={inputValue.leadSource === "freelancing site"}
                        onChange={handleRadioChange}
                        name="leadSource"
                        className="w-4 h-4 text-teal-600"
                      />
                      <label htmlFor="freelancingSites" className="text-gray-700 text-sm">
                        Freelancing Sites
                      </label>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="radio"
                        id="others"
                        value="others"
                        checked={inputValue.leadSource === "others"}
                        onChange={handleRadioChange}
                        name="leadSource"
                        className="w-4 h-4 text-teal-600"
                      />
                      <label htmlFor="others" className="text-gray-700 text-sm">
                        Others
                      </label>
                    </div>
                  </div>
                  {errors.leadSource && (
                    <p className="mt-1 text-sm text-red-500">{errors.leadSource}</p>
                  )}
                </div>

                {/* for proposal */}
                {inputValue.leadSource === "freelancing site" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proposal*
                    </label>
                    <textarea
                      required
                      name="proposal"
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                        errors.proposal ? "border-red-500" : "border-gray-300"
                      }`}
                      value={inputValue.proposal}
                      onChange={handleChange}
                    ></textarea>
                    {errors.proposal && (
                      <p className="mt-1 text-sm text-red-500">{errors.proposal}</p>
                    )}
                  </motion.div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes*
                  </label>
                  <textarea
                    required
                    name="notes"
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                      errors.notes ? "border-red-500" : "border-gray-300"
                    }`}
                    value={inputValue.notes}
                    onChange={handleChange}
                  ></textarea>
                  {errors.notes && (
                    <p className="mt-1 text-sm text-red-500">{errors.notes}</p>
                  )}
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button
                    onclick={() => stepFn("next")}
                    varient="bgFill"
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700"
                  >
                    Next Step
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 2: Project Details */}
          {step === 2 && (
            <motion.div 
              className="p-8 text-black"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Add Project Details
                </h2>
                <p className="text-gray-500">
                  Provide information about the project
                </p>
              </div>

              <form className="space-y-6" onSubmit={registerAccount}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="projectName"
                      placeholder="Website Redesign"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                        errors.projectName ? "border-red-500" : "border-gray-300"
                      }`}
                      value={inputValue.projectName}
                      onChange={handleChange}
                    />
                    {errors.projectName && (
                      <p className="mt-1 text-sm text-red-500">{errors.projectName}</p>
                    )}
                  </div>

                  <div className="md:col-span-2 flex items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-1 mr-3">
                      Is this an hourly paid project?
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={IshourBillable}
                        onChange={(e) => setIsHourBillable(e.target.checked)}
                        name="IshourBillable"
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Submission *
                    </label>
                    <input
                      type="date"
                      value={inputValue.duration}
                      onChange={handleChange}
                      name="duration"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                        errors.duration ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
                    )}
                  </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bid Amount*
                      </label>
                      <div className={`flex items-center px-4 py-3 border rounded-lg focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition-all ${
                        errors.bidAmount ? "border-red-500" : "border-gray-300"
                      }`}>
                        <span className="text-gray-500 mr-2">{currencyPref!}</span>
                        <input
                          type="number"
                          name="bidAmount"
                          placeholder="5,000"
                          className="flex-1 focus:outline-none"
                          required={!IshourBillable}
                          min="0"
                          step="0.01"
                          value={inputValue.bidAmount}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.bidAmount && (
                        <p className="mt-1 text-sm text-red-500">{errors.bidAmount}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hourly Rate *
                      </label>
                      <div className={`flex items-center px-4 py-3 border rounded-lg focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition-all ${
                        errors.hourlyRate ? "border-red-500" : "border-gray-300"
                      }`}>
                        <span className="text-gray-500 mr-2">{currencyPref!}</span>
                        <input
                          type="number"
                          name="hourlyRate"
                          placeholder="50"
                          className="flex-1 focus:outline-none"
                          required={IshourBillable}
                          min="0"
                          step="0.01"
                          value={inputValue.hourlyRate}
                          onChange={handleChange}
                        />
                        <span className="text-gray-500 ml-2">/hour</span>
                      </div>
                      {errors.hourlyRate && (
                        <p className="mt-1 text-sm text-red-500">{errors.hourlyRate}</p>
                      )}
                    </div>
                  

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      required
                      name="desc"
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                        errors.desc ? "border-red-500" : "border-gray-300"
                      }`}
                      value={inputValue.desc}
                      onChange={handleChange}
                    ></textarea>
                    {errors.desc && (
                      <p className="mt-1 text-sm text-red-500">{errors.desc}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    onclick={() => stepFn("prev")}
                    varient="bgFill"
                    className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </Button>

                  <button
                    type="submit"
                    disabled={isRoaming}
                    className={`px-6 py-3 rounded-lg font-medium ${
                      isRoaming
                        ? "bg-teal-400 cursor-not-allowed"
                        : "bg-teal-600 hover:bg-teal-700 transition-colors"
                    } text-white flex items-center justify-center`}
                  >
                    {isRoaming ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Add Project"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Page;