import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Inter, Geist } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PASAL | Student Engagement Portal",
  description:
    "The official digital platform for the Public Administration Students Association (PASAL), University of Ghana. Submit concerns, suggestions, browse opportunities and events.",
  keywords: [
    "PASAL",
    "University of Ghana",
    "Student Portal",
    "Public Administration",
    "Student Engagement",
    "UG",
  ],
  authors: [{ name: "PASAL – University of Ghana" }],
  metadataBase: new URL("https://pasal-portal.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://pasal-portal.vercel.app",
    siteName: "PASAL Student Engagement Portal",
    title: "PASAL | Student Engagement Portal – University of Ghana",
    description:
      "Your Voice. Your Campus. Your Future. Submit concerns, suggestions, and discover opportunities at PASAL, University of Ghana.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PASAL Student Engagement Portal – University of Ghana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PASAL | Student Engagement Portal – University of Ghana",
    description:
      "Your Voice. Your Campus. Your Future. Submit concerns, suggestions, and discover opportunities at PASAL, University of Ghana.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
    shortcut: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#001057",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${hankenGrotesk.variable} ${inter.variable} ${geist.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
