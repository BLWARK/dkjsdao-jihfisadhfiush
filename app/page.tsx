"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Player } from "@lottiefiles/react-lottie-player"; // Lottie Player
import WebApp from "@twa-dev/sdk"; // Telegram SDK
import { useRouter } from "next/navigation";
import { useBackend } from "@/context/BackContext";

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading
  const [isTelegramMobile, setIsTelegramMobile] = useState(false); // State untuk pengecekan Telegram di mobile web
  const router = useRouter();
  const { login } = useBackend();

  // Fungsi untuk mendeteksi apakah aplikasi berjalan di browser Telegram Mobile WebApp
  const isTelegramMobileWeb = () => {
    const isTelegramWeb = !!WebApp.initDataUnsafe?.user; // Cek jika ada data user dari Telegram WebApp
    const isMobile = /Mobi|Android/i.test(navigator.userAgent); // Deteksi perangkat mobile
    return isTelegramWeb && isMobile;
  };

  // Pengecekan apakah aplikasi berjalan di Telegram Mobile WebApp
  useEffect(() => {
    if (isTelegramMobileWeb()) {
      setIsTelegramMobile(true);
      setUserData(WebApp.initDataUnsafe.user as UserData);
    } 
  }, []);

  // Login setelah mendapatkan data user
  useEffect(() => {
    if (userData !== null) {
      login(userData);
    }
  }, [userData, login]);

  return (
    <div className="w-full flex min-h-screen flex-col justify-around items-center bgs">
      {isTelegramMobile ? (
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
          <p className="font-bold text-[22px]">Play On your mobile</p>
          <Image src="/XYZMERBOTLINK.jpg" alt="Logo" width={200} height={200} priority={true} />
          <p className="font-bold text-[22px]">https://t.me/Xyzmercoin_bot</p>
        </div>
      )}
    </div>
  );
}
