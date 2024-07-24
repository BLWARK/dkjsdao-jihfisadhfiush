"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoMdPersonAdd } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";
import { dataReferral } from "@/lib/data"; // Import data referral

const Page = () => {
  const [animate, setAnimate] = useState(false);
  const [referrals, setReferrals] = useState(dataReferral[0].referrals); // Mengambil data referral dari lib/data.js

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 2000); // Durasi animasi pulse
    }, 3000); // Interval setiap 3 detik

    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, []);

  return (
    <div className="invite-sec bgs w-full flex flex-col justify-start items-center overflow-y-scroll relative">
      <div className="wrap-invite w-full px-4 flex flex-col justify-center items-center mt-5">
        <div className="title flex flex-col justify-center items-center">
          <p className="font-bold text-[36px]">Invite friends</p>
          <p className="font-regular text-gray-400 text-[14px]">
            More friends more rewards!
          </p>
        </div>
        <div className="gift-information w-[360px] h-[120px] flex justify-center items-center bgs mt-10 rounded-3xl">
          <div className="icon w-[25%] flex justify-center items-center">
            <Image src="/gift1.png" alt="gift" width={75} height={75} />
          </div>
          <div className="icon w-[75%] flex flex-col justify-start items-start">
            <p className="font-bold text-[20px]">Invite Friends</p>
            <p className="font-md text-[12px] flex justify-center items-center px-2">
              <span className="text-orange-500 font-bold text-[12px] flex justify-center items-center mr-1 gap-1">
                <Image src="/XYZMER COIN.png" alt="gift" width={13} height={13} />
                +6,666
              </span>
              for every friend who join and play
            </p>
          </div>
        </div>
        <div className="list-friends w-full flex flex-col justify-start items-start mt-10">
          <div className="title-list-friend font-bold text-[14px]">
            <p>Total Referral ({referrals.length})</p>
          </div>
          <div className="all-friends overflow-y-scroll h-[240px] gap-4 mt-5">
            {referrals.map((referral, index) => (
              <div
                key={index}
                className="list1 w-[360px] h-[80px] flex justify-between items-center bgs mt-3 rounded-xl p-4"
              >
                <div className="flex flex-col">
                  <p className="text-white text-[14px]">
                    {referral.userName_Telegram}
                  </p>
                  <p className="text-gray-400 text-[12px]">{referral.name}</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-regular text-[12px]">Total Points</p>
                  <p className="text-end text-[12px]">{referral.balanceAirdrop}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="button-invite w-full flex justify-center items-center gap-3 mt-10">
          <button
            className={`w-[80%] h-[65px] but rounded-xl font-bold flex justify-center items-center gap-2 ${animate ? "pulseInvite" : ""}`}
          >
            <IoMdPersonAdd />
            Invite a Friends
          </button>
          <button className="w-[20%] h-[65px] but rounded-xl flex justify-center items-center font-extrabold text-[24px]">
            <IoCopyOutline />
          </button>
        </div>
        <div className="mt-40"></div>
      </div>
    </div>
  );
};

export default Page;
