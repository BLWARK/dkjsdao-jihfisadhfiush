"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTelegramPlane } from "react-icons/fa";
import WebApp from "@twa-dev/sdk";
import { useRouter } from "next/navigation";
import { useBackend} from "@/context/BackContext";

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
  const router = useRouter();
  const { login } = useBackend();

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  console.log(userData);

  useEffect(() => {
    if (userData !== null) {
      login(userData);
    }
  }, [userData]);
 
  return (
    <div className="w-full flex min-h-screen flex-col items-center justify-start bgs">
      <div className="wrapper mt-14 flex justify-center items-center flex-col">
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

        <div className="wrap-logo coin  flex justify-center items-center mt-20 ">
          <Image src="/XYZMER COIN.png" alt="Logo" width={250} height={250} />
        </div>

        <Link href="/main/earn">
          <div className="connect-wallet mt-20 flex justify-center items-center">
            <p className="w-[300px] h-[65px] font-bold but rounded-full flex justify-center items-center gap-3">
              <FaTelegramPlane className="text-[22px]" /> Login With Telegram
            </p>
          </div>
        </Link>
        {/* <p>{userData?.first_name}</p> */}
      </div>
    </div>
  );
}