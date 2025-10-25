"use client";
import { useProfileStore } from "@/zustand/userProfileStore";
import { useSonnerStore } from "@/zustand/useSonner";

import { useSonnerDetailsStore } from "@/zustand/useSonnerDetailsStore";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const Front = dynamic(() => import("./component/Front"));
const Contact = dynamic(() => import("./component/Contact"), {
  ssr: false,
});
const Features = dynamic(() => import("./component/Features"), {
  ssr: false,
});
const Pricing = dynamic(() => import("./component/Pricing"), {
  ssr: false,
});
const Loader = dynamic(() => import("./loader"), {
  ssr: false,
});

const Page = () => {
  const { isShow, setIsShow } = useSonnerStore();
  const { user, setUser } = useProfileStore();
  const { sonnerDetails, addSonnerDetails } = useSonnerDetailsStore();
  const { data: session } = useSession();
  const [isRun, setIsRun] = useState<boolean>(false);
  const [hasUpdated, setHasUpdated] = useState<boolean>(false);

  // const router = useRouter();

  // if (user.isPlanSelected) {
  //   router.replace("/dashboard"); // redirect if authenticated
  // }

  useEffect(() => {
    const fn = async () => {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          next: { revalidate: 180 },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.msg);
          setIsRun(true);
        } else {
          setIsShow(true);
        }
      } catch (error) {
        addSonnerDetails("Something went wrong! please try again later");
        return error;
      }
    };

    fn();
  }, [addSonnerDetails, setIsShow, setUser]);

  useEffect(() => {
    if (!hasUpdated && !user?.userLanguage && session?.user?._id && isRun) {
      const fn = async () => {
        try {
          const ipRes = await fetch("https://ipapi.co/json/");
          const ipData = await ipRes.json();

          const response = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              userLanguage: ipData.currency,
            }),
          });

          const apiData = await response.json();

          if (response.ok) {
            addSonnerDetails(apiData.msg);
          } else {
            setIsShow(true);
            addSonnerDetails(apiData.msg || "Update failed");
          }
          setHasUpdated(true); // ✅ ensure it runs only once
        } catch (error) {
          addSonnerDetails("Something went wrong! Please try again later");
          return error;
        }
      };
      fn();
    }
  }, [user?.userLanguage, session?.user?._id, hasUpdated, isRun]);

  return (
    <>
      {isShow && (
        <div className="bg-gray-200 text-xs flex items-center text-black rounded-md border-1 border-gray-200 shadow-md z-100 fixed top-0 gap-2 right-0">
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
      </div>
    </>
  );
};

export default Page;
