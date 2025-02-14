import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron, Roboto } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/menu/page";


/*=========================================================================================================================
Outer wrapper for the entire web app
Brennen Beck
January 29, 2025

Synopsis: Wraps the entire web app, mostly to provide a common navigation menu sidebar.

Description: 
  Currently, this only has the navigation sidebar, but will implement anything that should be on the screen on every page.

Notes:

  Version 1.0 (1/29/2025-BB) - Original code.
===========================================================================================================================*/
const fontOrbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400","500","600","700","800","900"],
});

const fontRoboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100","300","400","500","700","900"],
});


export const metadata: Metadata = {
  title: "BBeck Actual's Traveller Site",
  description: "Website and trade calculator for my Traveller game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontOrbitron.variable} ${fontRoboto.variable} antialiased`}>
        <div className="flex ">
          <Sidebar>{children}</Sidebar>
          
        </div>
      </body>
    </html>
    );
  }
    
