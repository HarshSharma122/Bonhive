import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
const Header = dynamic(() => import('@/components/Header'));
const Footer = dynamic(() => import('@/components/Footer'));
import dynamic from "next/dynamic";
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
    <div className={`${GeistSans.className} scroll-smooth`}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
