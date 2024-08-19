"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { IoMdPersonAdd } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";
import { useBackend } from "@/context/BackContext";

const Invite = () => {
  const [animate, setAnimate] = useState(false);
  const { dataMe, getMe } = useBackend();

  const initialized = useRef(false); // Ref to prevent multiple API calls

  const initialize = async () => {
    if (!dataMe && !initialized.current) {
      await getMe(); // Call API once
      initialized.current = true; // Mark as initialized
    }
  };

  useEffect(() => {
    initialize(); // Run initialize only once
  }, []);
  // Buat referralLink menggunakan data dari API
  const referralLink = `https://t.me/Xyzmercoin_bot?referralCode=${dataMe?.referralCode}`;

  // Fungsi untuk membagikan tautan referral ke platform
  const handleShare = (platform) => {
    let shareUrl = "";
    const encodedLink = encodeURIComponent(referralLink);
    if (platform === "telegram") {
      shareUrl = `https://t.me/share/url?url=${encodedLink}`;
    }

    window.open(shareUrl, "_blank");
  };

  // Animasi button pulse
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
                +666
              </span>
              for every friend who join and play
            </p>
          </div>
        </div>
        <div className="list-friends w-full flex flex-col justify-start items-start mt-10">
          <div className="title-list-friend font-bold text-[14px]">
            <p>Total Referral ({dataMe?.referredUsers?.length || 0})</p> {/* Menampilkan jumlah total referral */}
          </div>
          <div className="all-friends overflow-y-scroll h-[240px] gap-4 mt-5">
            {dataMe?.referredUsers?.length > 0 ? (
              dataMe.referredUsers.map((referral, index) => (
                <div
                  key={referral._id}
                  className="list1 w-[360px] h-[80px] flex justify-between items-center bgs mt-3 rounded-xl p-4"
                >
                  <div className="flex flex-col">
                    <p className="text-white text-[14px]">
                      {referral.username}
                    </p>
                    <p className="text-gray-400 text-[12px]">{referral.firstName}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-regular text-[12px]">Total Points</p>
                    <p className="text-end text-[12px]">{referral.points}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white italic flex justify-center items-center text-[12px]">No referrals yet.</p>
            )}
          </div>
        </div>
        <div className="button-invite w-full flex justify-center items-center gap-3 mt-10">
          <button
            onClick={() => handleShare("telegram")}
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

export default Invite;
