"use client"

import { useProfileStore } from "@/zustand/userProfileStore";
import { useStatusStore } from "@/zustand/useshowStatusStore";
import { useSonnerStore } from "@/zustand/useSonner";
import { useSonnerDetailsStore } from "@/zustand/useSonnerDetailsStore";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";

import { RazorpayConstructor, RazorpayPaymentFailure, RazorpaySubscriptionResponse } from "@/types/bonhive-types";

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}
const Pricing = () => {
  const { data: session } = useSession();
  const [isRoaming, setIsRoaming] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useProfileStore();
  const { setIsShow } = useSonnerStore();
  const { setIsAnimate } = useStatusStore();
  const { addSonnerDetails } = useSonnerDetailsStore();


  const plans = [
    {
      name: "Free",
      price: 0,
      type: "one time",
      description: "Perfect for getting started",
      features: [
        "Up to 5 projects",
        "Basic analytics",
        "Email support",
        "Invoice creation",
        "Calendar support",
        "Client management",
      ],
      cta: "Get Started",
      popular: false,
      color: "gray",
    },
    {
      name: "Pro",
      type: "one time",
      price: 399,
      description: "For growing businesses",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "Calendar support",
        "Client management",
        "Invoice creation",
      ],
      cta: "Pay Now",
      popular: true,
      color: "blue",
    },
  ];

  const processPayment = async (name: string, price: number) => {
    try {
      setIsRoaming(true);
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PricePlanType: name,
          amount: price * 100,
        }),
      });

      const data = await response.json();

      if (data.errorMsg) {
        setIsShow(true);
        addSonnerDetails(data.errorMsg);
      }
      if (response.status === 404) {
        setIsRoaming(false);
      }
      if (data.msg) {
        setIsShow(true);
        addSonnerDetails(data.msg);
        router.push("/dashboard");
        setIsAnimate(true);
        setTimeout(() => {
          setIsShow(false);
          setIsAnimate(false);
        }, 5000);
        return data.msg;
      }
      if (data.id) {
        setIsShow(true);
        addSonnerDetails(data.msg);
        setIsAnimate(true);
        setIsRoaming(false);
        setTimeout(() => {
          setIsShow(false);
          setIsAnimate(false);
        }, 5000);

        const orderId = data.id;
        console.log(orderId);

        if (!orderId) {
          alert("order creation failed.");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id: orderId,
          name: session?.user.name || "User",
          description: "one time payment",
          handler: async function (response: RazorpaySubscriptionResponse) {
            try {
              const result = await fetch("/api/payment_verification", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_signature: response.razorpay_signature,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  amount: price * 100,
                  PricePlanType: name,
                  orderId,
                }),
              });

              const data = await result.json();

              if (result.ok) {
                setIsShow(true);
                addSonnerDetails(data.msg);
                router.push(`/dashboard`);
                setIsRoaming(false);
                setIsAnimate(true);
                setTimeout(() => {
                  setIsShow(false);
                  setIsAnimate(false);
                }, 5000);
              } else {
                alert("Verification failed: " + data.msg);
              }
            } catch (err) {
              alert("An error occurred during verification.");
              setIsRoaming(false);
              return err;
            }
          },
          prefill: {
            name: session?.user.name || "",
            email: session?.user.email || "",
          },
          theme: {
            color: "#ffffff",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on(
          "payment.failed",
          function (response: RazorpayPaymentFailure) {
            alert("Payment failed: " + response.error.description);
            setIsRoaming(false);
          }
        );
        paymentObject.open();
      }
    } catch (error) {
      addSonnerDetails("Something went wrong! please try again later");
      setIsRoaming(false);
      return error
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {isRoaming && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 p-8 rounded-2xl shadow-2xl flex flex-col items-center border border-gray-700"
          >
            {/* Modern animated spinner */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
              <div className="absolute inset-3 rounded-full border-4 border-gray-400 border-b-transparent animate-spin-reverse"></div>
            </div>

            {/* Pulsing text with gradient */}
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 font-semibold text-lg mt-4 animate-pulse">
              Processing payment...
            </p>

            {/* Animated progress bar */}
            <div className="w-48 h-2 bg-gray-700 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-white to-gray-400 rounded-full animate-progress"></div>
            </div>

            {/* Optional status message */}
            <p className="text-gray-400 text-sm mt-3">
              Please wait while we secure your transaction
            </p>
          </motion.div>
        </div>
      )}

      <div
        id="price"
        className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden"
      >
      <div className="absolute top-10 left-5 md:top-20 md:left-10 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-gentle-float"></div>
      <div className="absolute bottom-10 right-5 md:bottom-20 md:right-10 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-gentle-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse-soft"></div>

      {/* Enhanced Grid Overlay with Blue Tint */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Choose the perfect plan for your business needs. No hidden fees.
            </p>
          </motion.div>

          {/* Pricing cards */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  plan.popular
                    ? "ring-2 ring-gray-300 shadow-xl border-0 transform -translate-y-2"
                    : "border border-gray-200 shadow-lg"
                }`}
              >
                {plan.popular && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-0 lg:left-1/2 left-30 transform -translate-x-1/2 -translate-y-0 z-10"
                  >
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </span>
                  </motion.div>
                )}

                <div
                  className={`pt-12 pb-8 px-8 text-center bg-gradient-to-b from-white to-gray-50`}
                >
                  <h2 className={`text-2xl font-bold text-gray-900`}>
                    {plan.name}
                  </h2>
                  <p className="mt-2 text-gray-600">{plan.description}</p>

                  <div className="mt-6 flex items-baseline justify-center">
                    <span className="text-5xl font-extrabold text-gray-900">
                      ₹{plan.price}
                    </span>
                    <span className="ml-1 text-xl font-semibold text-gray-500">
                      {plan.type}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => processPayment(plan.name, plan.price)}
                    className={`mt-8 w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r  from-blue-500 to-indigo-600  text-white hover:from-blue-700 hover:to-indigo-600 shadow-md hover:shadow-lg"
                        : " text-black hover:bg-gray-200 border border-gray-300"
                    } ${
                      plan.price === 0
                        ? " text-black hover:from-gray-300 hover:to-gray-400 border-1 border-gray-300"
                        : ""
                    } ${
                      user?.bonhivePlan === "Pro" && plan.name === "Pro"
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:shadow-md"
                    }`}
                    disabled={
                      user?.bonhivePlan === "Pro" && plan.name === "Pro"
                    }
                  >
                    {plan.price === 0 ? "Get Started - Free" : plan.cta}
                    {user?.bonhivePlan === "Pro" &&
                      plan.name === "Pro" &&
                      " (Current Plan)"}
                  </motion.button>
                </div>

                <div className="border-t border-gray-200 pt-8 pb-10 px-8 bg-white flex-grow">
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
                    What is included
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.1 }}
                        className="flex items-start"
                      >
                        <svg
                          className="flex-shrink-0 h-6 w-6 text-blue-500 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="ml-3 text-gray-600">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-24 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "Can I change plans anytime?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated."
                },
                {
                  question: "Is there a setup fee?",
                  answer: "No, there are no setup fees for any of our plans. You only pay the advertised price."
                },
                {
                  question: "Do you offer discounts?",
                  answer: "No, initially no"
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, UPI, and bank transfers for one time payment."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-700 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Pricing;