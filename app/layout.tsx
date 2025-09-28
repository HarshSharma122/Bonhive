import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/utilis/providers";
import { Analytics } from "@vercel/analytics/next";
export const metadata: Metadata = {
  title: "Bonhive",
  description: "Bonhive helps freelancers achieve freedom by simplifying work management without relying on spreadsheets",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className}`}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
