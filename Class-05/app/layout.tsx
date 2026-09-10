import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#07090e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Atta Ur Rehman — Vibe Engineering || Data Analyst || Python || SQL || Meta Ads",
  description:
    "Portfolio of Atta Ur Rehman — Vibe Engineering, Data Analyst, Python, SQL, Power BI, Excel, Social Media Manager, Meta Ads based in Lahore, Pakistan.",
  keywords: [
    "Atta Ur Rehman",
    "Vibe Engineering",
    "Data Analyst Lahore",
    "Python Data Analytics",
    "SQL",
    "Power BI",
    "Excel",
    "Social Media Manager",
    "Meta Ads",
    "Zyrom PVT LTD",
    "Pakistan Youth Nexus Society",
    "Institute for Art and Culture",
  ],
  authors: [{ name: "Atta Ur Rehman", url: "https://github.com/atta-ur-rehman-14" }],
  creator: "Atta Ur Rehman",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://attaurrehman.dev",
    title: "Atta Ur Rehman — Vibe Engineering & Data Analyst",
    description:
      "Vibe Engineering || Data Analyst || Python || SQL || Power Bi || Excel || Social Media Manager || Meta Ads",
    siteName: "Atta Ur Rehman Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atta Ur Rehman — Vibe Engineering & Data Analyst",
    description: "Exploring datasets, uncovering patterns, and building solutions that solve real-world problems.",
    creator: "@attaurrehman",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Atta Ur Rehman",
  url: "https://github.com/atta-ur-rehman-14",
  jobTitle: "Vibe Engineering, Data Analyst & Social Media Manager",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    addressCountry: "Pakistan",
  },
  knowsAbout: [
    "Vibe Engineering",
    "Data Analytics with Python",
    "Business Development",
    "Python",
    "SQL",
    "Power BI",
    "Excel",
    "Social Media Management",
    "Meta Ads",
    "Machine Learning basics",
    "Pandas & NumPy",
  ],
  sameAs: [
    "https://www.linkedin.com/in/atta-ur-rehman-14b249370",
    "https://github.com/atta-ur-rehman-14",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
