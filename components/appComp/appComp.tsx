"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Player } from "@lottiefiles/react-lottie-player"; // Lottie Player
import { useRouter } from "next/navigation";
import { useBackend } from "@/context/BackContext";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: UserData;
        };
        init?: () => void;
      };
    }
  }
}

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

const AppComp: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false); // State untuk pengecekan apakah aplikasi berjalan di Telegram WebApp
  const [isMobileDevice, setIsMobileDevice] = useState(false); // State untuk pengecekan apakah aplikasi berjalan di perangkat mobile
  const router = useRouter();
  const { login } = useBackend();

  // Fungsi untuk mendeteksi apakah aplikasi berjalan di perangkat mobile
  const isMobileDeviceCheck = (): boolean => {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent); // Deteksi perangkat mobile
  };

  // Pengecekan apakah aplikasi berjalan di Telegram WebApp
  const isTelegramWebAppCheck = (): boolean => {
    return typeof window !== "undefined" && !!window.Telegram?.WebApp?.initDataUnsafe?.user;
  };

  // Cek apakah perangkat mobile atau Telegram WebApp dan tunggu API Telegram
  useEffect(() => {
    const checkEnvironment = () => {
      if (!isTelegramWebAppCheck()) {
        // Jika tidak menggunakan Telegram WebApp, redirect atau tampilkan pesan
        setIsTelegramWebApp(false);
        return;
      }

      if (isMobileDeviceCheck()) {
        setIsMobileDevice(true);
      }

      if (isTelegramWebAppCheck()) {
        setIsTelegramWebApp(true);
        const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        setUserData(telegramUser || null); // Set data user dari Telegram API
      } else {
        setIsLoading(false); // Berhenti loading jika tidak ada data pengguna dari Telegram API
      }
    };

    checkEnvironment();
  }, []);

  // Login setelah mendapatkan data user
  useEffect(() => {
    if (userData !== null) {
      login(userData).then(() => {
        setIsLoading(false); // Stop loading setelah login berhasil
      });
    }
  }, [userData, login]);

  if (!isTelegramWebApp) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-10">
        <p className="font-bold text-[26px]">This application can only be accessed from Telegram WebApp</p>
        <Image src="/XYZMERBOTLINK.jpg" alt="Logo" width={230} height={230} priority={true} />
        <p className="font-bold text-[26px]">@Xyzmercoin_bot</p>
      </div>
    );
  }

  return (
    <div className="w-full flex min-h-screen flex-col justify-around items-center bgs">
      {isMobileDevice && isTelegramWebApp ? (
        <>
          {/* Halaman awal ditampilkan di background */}
          <div className="wrapper flex justify-center items-center flex-col">
            <div className="neons font-bold text-[28px] flex justify-center items-center mt-6">
              <div>WELCOME TO</div>
              <div>WELCOME TO</div>
              <div>WELCOME TO</div>
            </div>

            <div className="neons font-bold text-[28px] flex justify-center items-center mt-10">
              <div>PLAY TO EARN XYZMER</div>
              <div>PLAY TO EARN XYZMER</div>
              <div>PLAY TO EARN XYZMER</div>
            </div>

            <div className="wrap-logo coin flex justify-center items-center mt-20">
              <Image src="/XYZMER COIN.png" alt="Logo" width={200} height={200} priority={true} />
            </div>
          </div>

          <div className="mt-[100px] flex gap-2 justify-center items-center">
            <Image src="/XYZMER LOGOs.png" alt="Logo" width={50} height={50} priority={true} />
            <p className="font-bold">XYZMERCOIN</p>
          </div>

          {/* Overlay animasi loading dengan latar belakang hitam */}
          {isLoading && (
            <div className="overlay fixed inset-0 flex justify-center items-center bg-blue-950 bg-opacity-40 z-50">
              {/* Animasi Lottie di atas halaman */}
              <Player
                autoplay
                loop
                src="https://lottie.host/16594a2c-c2ad-4196-98e2-51ab691a2e8d/ycygvL2itD.json"
                style={{ height: "100px", width: "100px" }}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col justify-center items-center min-h-screen gap-10">
          <p className="font-bold text-[26px]">Play On your mobile</p>
          <Image src="/XYZMERBOTLINK.jpg" alt="Logo" width={230} height={230} priority={true} />
          <p className="font-bold text-[26px]">@Xyzmercoin_bot</p>
        </div>
      )}
    </div>
  );
};

export default AppComp;
