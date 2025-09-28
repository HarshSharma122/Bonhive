import { useStatusStore } from "@/zustand/useshowStatusStore";
import { useSonnerStore } from "@/zustand/useSonner";
import { useSonnerDetailsStore } from "@/zustand/useSonnerDetailsStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Script from "next/script";
import { useProfileStore } from "@/zustand/userProfileStore";

interface RazorpayOptions {
  key?: string;
  amount?: number;
  currency?: string;
  order_id?: string;
  subscription_id?: string;
  name?: string;
  description?: string;
  handler?: (response: RazorpaySubscriptionResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}
interface RazorpayPaymentSuccess {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
}

interface RazorpayPaymentFailure {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id?: string;
      payment_id?: string;
    };
  };
}




interface RazorpayInstance {
  open(): void;
  on(
    event: "payment.failed",
    callback: (response: RazorpayPaymentFailure) => void
  ): void;
  on(
    event: "payment.success",
    callback: (response: RazorpayPaymentSuccess) => void
  ): void;
  on(event: string, callback: (response: unknown) => void): void; // fallback
  close(): void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}
declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}
interface RazorpaySubscriptionResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}


const Pricing = () => {
  const { data: session } = useSession();
  const [isRoaming, setIsRoaming] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const { user } = useProfileStore();
  const { setIsShow } = useSonnerStore();
  const { setIsAnimate } = useStatusStore();
  const { addSonnerDetails } = useSonnerDetailsStore();

  // Add fade-in animation on component mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const plans = [
    {
      name: "Free",
      price: 0,
      type: "monthly",
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
      type: "monthly",
      price: 100,
      description: "For growing businesses",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "Calendar support",
        "Client management",
        "Invoice creation",
      ],
      cta: "Subscribe Now",
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
        }),
      });

      const data = await response.json();
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

        const subscriptionId = data.id;
        console.log(subscriptionId);
        
        if (!subscriptionId) {
          alert("Subscription creation failed.");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          subscription_id: subscriptionId,
          name: session?.user.name || "User",
          description: "Subscription Payment",
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
                  razorpay_subscrption_id: response.razorpay_subscription_id,
                  amount: price * 100,
                  PricePlanType: name,
                  subscriptionId,
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
            color: "#3399cc",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (response: RazorpayPaymentFailure) {
          alert("Payment failed: " + response.error.description);
          setIsRoaming(false);
        });
        paymentObject.open();
      }
    } catch (error) {
      addSonnerDetails("Something went wrong! please try again later");
      setIsRoaming(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      {isRoaming && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center transform transition-all duration-300 scale-100 animate-fade-in">
            {/* Modern animated spinner */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-3 rounded-full border-4 border-blue-300 border-b-transparent animate-spin-reverse"></div>
            </div>

            {/* Pulsing text with gradient */}
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-lg mt-4 animate-pulse">
              Processing payment...
            </p>

            {/* Animated progress bar */}
            <div className="w-48 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progress"></div>
            </div>

            {/* Optional status message */}
            <p className="text-gray-500 text-sm mt-3">
              Please wait while we secure your transaction
            </p>
          </div>
        </div>
      )}

      <div
        id="price"
        className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-opacity duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl bg-clip-text  bg-gradient-to-r from-blue-600 to-purple-600">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Choose the perfect plan for your business needs. No hidden fees.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  plan.popular
                    ? "ring-2 ring-blue-500 shadow-lg border-0 transform -translate-y-2"
                    : "border border-gray-200 shadow-md"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 lg:left-1/2  left-30 transform -translate-x-1/2 -translate-y-0 z-10">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div
                  className={`pt-12 pb-8 px-8 text-center bg-gradient-to-b from-white to-gray-50`}
                >
                  <h2 className={`text-2xl font-bold text-${plan.color}-700`}>
                    {plan.name}
                  </h2>
                  <p className="mt-2 text-gray-600">{plan.description}</p>

                  <div className="mt-6 flex items-baseline justify-center">
                    <span className="text-5xl font-extrabold text-gray-900">
                      ₹{plan.price}
                    </span>
                    <span className="ml-1 text-xl font-semibold text-gray-500">
                      {"/month"}
                    </span>
                  </div>
                  <button
                    onClick={() => processPayment(plan.name, plan.price)}
                    className={`mt-8 w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                    } ${
                      plan.price === 0
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 border-0"
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
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-8 pb-10 px-8 bg-white flex-grow">
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
                    What is included
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg
                          className="flex-shrink-0 h-6 w-6 text-green-500 mt-0.5"
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
                        <span className="ml-3 text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ section */}
          <div className="mt-24 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Can I change plans anytime?
                </h3>
                <p className="mt-2 text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time.
                  Changes will be prorated.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Can I cancel my subscription?
                </h3>
                <p className="mt-2 text-gray-600">
                  Yes, you can but within 7 days we refund your money after that
                  we can not refund the money.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Is there a setup fee?
                </h3>
                <p className="mt-2 text-gray-600">
                  No, there are no setup fees for any of our plans. You only pay
                  the advertised price.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Do you offer discounts?
                </h3>
                <p className="mt-2 text-gray-600">No, initialy no</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  What payment methods do you accept?
                </h3>
                <p className="mt-2 text-gray-600">
                  We accept all major credit cards, UPI, and bank transfers for
                  annual plans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
