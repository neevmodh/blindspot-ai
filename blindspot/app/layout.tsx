import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blindspot — Academic Requirement Checker",
  description:
    "Drop your rubric and your work. Get a brutal, instant hit-list of everything missing before you submit.",
  keywords: ["rubric checker", "academic", "assignment", "AI grader", "blindspot"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable} dark`}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
