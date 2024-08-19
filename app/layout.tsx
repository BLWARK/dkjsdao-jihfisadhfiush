import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalStateProvider } from "@/context/GlobalStateContext"; // Sesuaikan dengan path yang benar
import Script from "next/script";
import { BackProvider } from "@/context/BackContext"
// import { cookieToInitialState } from "wagmi";
// import {headers} from "next/headers"
// import { config } from "@/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XYZMER P2E",
  description: "XYZMER Play To Earn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const initialState = cookieToInitialState(config, headers().get("cookie"))
  return (
    <html lang="en">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className}>
        <BackProvider>
        <GlobalStateProvider>
          <div className="w-full h-min-screen  mx-auto flex justify-center items-center ">
            {children}
          </div>
        </GlobalStateProvider>
        </BackProvider>
      </body>
    </html>
  );
}