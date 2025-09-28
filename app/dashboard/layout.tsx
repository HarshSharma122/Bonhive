import AsideDash from "@/components/aside.dash";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "../globals.css"

export const metadata: Metadata = {
  title: "Bonhive",
  description: "CRM for freelancers",
};

export default function RootLayout({
  children,
}: Readonly<{   
  children: React.ReactNode;
}>) {
  return (
    <div className={`${GeistSans.className} flex text-white `}>
      <div className="">
        <AsideDash />
      </div>
      <div className=" lg:ml-55 md:ml-55  lg:pt-0 pt-10   lg:w-[90vw] w-[100vw] bg-gray-950 ">
        {children}
      </div>
    </div>
  );
}
