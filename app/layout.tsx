import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/utilis/providers";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "Bonhive",
  description:
    "Bonhive helps freelancers achieve freedom by simplifying work management without relying on spreadsheets.",
  keywords: [
    "Bonhive",
    "Bonhive app",
    "Bonhive freelance management",
    "Freelance work management",
    "Freelance project tracking",
    "Freelance invoicing",
    "Freelance time tracking",
    "Freelance client management",
    "Freelance productivity tools",
    "Freelance business solutions",
    "Freelance workflow automation",
    "Freelance task management",
    "Freelance collaboration tools",
    "Freelance financial management",
    "Freelance expense tracking",
  ],
  metadataBase: new URL("https://bonhive.site"),
  alternates: {
    canonical: "https://bonhive.site",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
  type: "website",
  url: "https://bonhive.site",
  title: "Bonhive",
  description: "Bonhive helps freelancers achieve freedom by simplifying work management without relying on spreadsheets.",
  siteName: "Bonhive",
  images: [
    {
      url: "/og-image.png", // now points to public folder
      width: 1200,
      height: 630,
      alt: "Bonhive - Freelance Work Management",
    },
  ],
},
twitter: {
  card: "summary_large_image",
  title: "Bonhive",
  description: "Bonhive helps freelancers achieve freedom by simplifying work management without relying on spreadsheets.",
  images: ["/og-image.png"],
},

 
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  authors: [{ name: "Bonhive Team", url: "https://bonhive.site" }],
  applicationName: "Bonhive",
  category: "Freelance Management",
  generator: "Next.js",
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
          <SpeedInsights/>
        </Providers>
      </body>
    </html>
  );
}
