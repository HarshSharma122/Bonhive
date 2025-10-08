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
    <div className={`${GeistSans.className} flex text-white bg-gray-100 `}>
      <div className="lg:pl-5 lg:pt-5">
        <AsideDash/>
      </div>
      <div className="lg:pt-0 pt-10   lg:w-[90vw] w-[100vw]">
        {children}
      </div>
    </div>
  );
}
