"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Player } from "@lottiefiles/react-lottie-player";
import { useRouter } from "next/navigation";
import { useBackend } from "@/context/BackContext";

// Deklarasi global untuk menangani Telegram WebApp API
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: UserData;
          startapp?: string;  // Menangkap parameter start untuk referral
          tgWebAppStartParam?: string; // Fallback untuk menangkap parameter referral dari URL
        };
        init?: () => void;
      };
    };
  }
}

// Interface untuk tipe data pengguna
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
  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string | null>(null); // State for referral code
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const router = useRouter();
  const { login, getMe, play, loginReferral } = useBackend();

  // Fungsi untuk mendeteksi apakah aplikasi berjalan di perangkat mobile
  const isMobileDeviceCheck = (): boolean => {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  // Fungsi untuk memeriksa apakah aplikasi berjalan di dalam Telegram WebApp
  const isTelegramWebAppCheck = (): boolean => {
    return (
      typeof window !== "undefined" &&
      !!window.Telegram?.WebApp?.initDataUnsafe?.user
    );
  };

  // Inisialisasi Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp?.init) {
      window.Telegram.WebApp.init(); // Inisialisasi Telegram WebApp
    }
  }, []);

  // Tangkap kode referral dari URL atau dari initDataUnsafe
  useEffect(() => {
    // Ambil kode referral dari URL jika ada
    const urlParams = new URLSearchParams(window.location.search);
    const urlReferralCode = urlParams.get('tgWebAppStartParam'); // Ambil referral code dari parameter URL
  
    // Ambil data dari initDataUnsafe (Telegram WebApp)
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    const startParamReferralCode = window.Telegram?.WebApp?.initDataUnsafe?.startapp || window.Telegram?.WebApp?.initDataUnsafe?.tgWebAppStartParam; // Ambil referral code dari Telegram dengan fallback

    // Debugging: lihat seluruh URL yang diterima dan data dari Telegram
    console.log("Current URL:", window.location.href);
    console.log("Telegram User:", telegramUser);
    console.log("Referral code from URL:", urlReferralCode);
    console.log("Referral code from Telegram startapp:", startParamReferralCode);

    if (telegramUser) {
      setUserData(telegramUser); // Set data user dari Telegram
    }

    // Prioritaskan kode referral dari URL, jika tidak ada gunakan dari Telegram
    if (urlReferralCode) {
      setReferralCode(urlReferralCode); // Set kode referral dari URL
      localStorage.setItem('referralCode', urlReferralCode); // Simpan kode referral di localStorage
    } else if (startParamReferralCode) {
      setReferralCode(startParamReferralCode); // Set kode referral dari initDataUnsafe
      localStorage.setItem('referralCode', startParamReferralCode); // Simpan kode referral di localStorage
    }

    // Debugging: Lihat kode referral yang berhasil ditangkap
    console.log("Referral code captured:", urlReferralCode || startParamReferralCode);
  }, []);

  // Fungsi untuk login berdasarkan referral atau user data dari Telegram
  // Fungsi untuk login berdasarkan referral atau user data dari Telegram
useEffect(() => {
  const checkEnvironment = async () => {
    if (!isTelegramWebAppCheck()) {
      setIsTelegramWebApp(false);
      setIsLoading(false);
      return;
    }

    if (isMobileDeviceCheck()) {
      setIsMobileDevice(true);
    }

    if (isTelegramWebAppCheck()) {
      setIsTelegramWebApp(true);
      const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

      setUserData(telegramUser || null);

      if (telegramUser) {
        // Jika ada referral code, lakukan login dengan referral
        if (referralCode) {
          try {
            const result = await loginReferral(referralCode, telegramUser);
            console.log("Login with referral code:", referralCode);
            if (result) {
              // Setelah login dengan referral sukses, redirect ke halaman
              router.push("/main/earn");
            }
          } catch (error) {
            console.error("Referral login failed", error);
          }
        } else {
          // Jeda sebelum login tanpa referral
          setTimeout(async () => {
            try {
              await login(telegramUser); // Login biasa jika tidak ada referral code
              router.push("/main/earn");
            } catch (error) {
              console.error("Login failed", error);
            }
          }, 3000); // Delay 2 detik sebelum login tanpa referral
        }
      }
    }
  };

  checkEnvironment();
}, [login, loginReferral, referralCode, router]);


  // Fetch backend data setelah login sukses
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await getMe(); // Ambil data user
  //       await play(); // Mulai sesi game atau ambil data sesi yang sedang berjalan
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setIsLoading(false);
  //     }
  //   };

  //   if (userData) {
  //     fetchData();
  //   }
  // }, [userData, getMe, play]);

  // Jika bukan Telegram WebApp, tampilkan pesan
  if (!isTelegramWebApp) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-10">
        <p className="font-bold text-[26px] text-center">Play On your mobile</p>
        <Image src="/XYZMERBOTLINK.jpg" alt="Logo" width={230} height={230} priority={true} />
        <p className="font-bold text-[26px]">@Xyzmercoin_bot</p>
      </div>
    );
  }

  return (
    <div className="w-full flex min-h-screen flex-col justify-around items-center bgs">
      {isMobileDevice && isTelegramWebApp ? (
        <>
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
              <Player autoplay loop src="https://lottie.host/16594a2c-c2ad-4196-98e2-51ab691a2e8d/ycygvL2itD.json" style={{ height: "100px", width: "100px" }} />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col justify-center items-center min-h-screen gap-10">
          <p className="font-bold text-[26px] text-center">Play On your mobile</p>
          <Image src="/XYZMERBOTLINK.jpg" alt="Logo" width={230} height={230} priority={true} />
          <p className="font-bold text-[26px]">@Xyzmercoin_bot</p>
        </div>
      )}
    </div>
  );
};

export default AppComp;
