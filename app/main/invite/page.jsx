"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { IoMdPersonAdd } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";
import { useBackend } from "@/context/BackContext";

const Invite = () => {
  const [animate, setAnimate] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [loading, setLoading] = useState(true); // State untuk melacak loading
  const { dataMe, getMe, totalUsers, total } = useBackend();
  const initialized = useRef(false);
  const [modifiedTotal, setModifiedTotal] = useState(null);

  const initialize = async () => {
    if (!initialized.current) {
      await getMe();
      await totalUsers(); // Panggil totalUser untuk mendapatkan total pengguna
      initialized.current = true;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true sebelum data diambil
      await initialize();
      setLoading(false); // Set loading to false setelah data selesai diambil
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (total) {
      setModifiedTotal(total); // Tambahkan 100 ke total user asli
    }
  }, [total]);

  const referralLink = `https://t.me/Xyzmercoin_bot/play?startapp=${dataMe?.referralCode}`;
  const message = `Enjoy the fun of playing and earning with XYZMerCoin! click my referral code for exclusive bonuses!"`;

  const handleShare = (platform) => {
    let shareUrl = "";

    if (platform === "telegram") {
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
    }

    window.open(shareUrl, "_blank");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setShowCopiedMessage(true); // Show custom alert message
      setTimeout(() => setShowCopiedMessage(false), 2000); // Hide it after 2 seconds
    } catch (err) {
      console.error("Failed to copy the text: ", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 2000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="invite-sec bgs w-full flex flex-col justify-start items-center overflow-y-scroll relative">
      {showCopiedMessage && (
        <div className="fixed top-10 bg-green-500 text-white px-4 py-2 rounded-lg z-50">
          Referral link successfully copied!
        </div>
      )}
      <div className="wrap-invite w-full px-4 flex flex-col justify-center items-center mt-5">
        <div className="title flex flex-col justify-center items-center">
          <p className="font-bold text-[36px]">Invite friends</p>
          <p className="font-regular text-gray-400 text-[14px]">
            More friends more rewards!
          </p>
        </div>
        <div className="gift-information w-[360px] h-[90px] flex justify-center items-center bgs mt-10 rounded-3xl">
          <div className="icon w-full flex flex-col justify-center items-center gap-1">
            <p className="font-bold text-[20px]">Total User</p>
            <p className="font-bold text-[14px] flex justify-center items-center px-2">
              {loading ? "Loading..." : modifiedTotal} {/* Tampilkan loading saat data diambil */}
            </p>
          </div>
        </div>
        <div className="list-friends w-full flex flex-col justify-start items-start mt-10">
          <div className="title-list-friend font-bold text-[14px]">
            <p>Total Referral ({dataMe?.referredUsers?.length || 0})</p>
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
                    <p className="font-regular text-end text-[12px]">Total Points</p>
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
            Invite a Friend
          </button>
          <button
            onClick={handleCopy}
            className="w-[20%] h-[65px] but rounded-xl flex justify-center items-center font-extrabold text-[24px]"
          >
            <IoCopyOutline />
          </button>
        </div>
        <div className="mt-40"></div>
      </div>
    </div>
  );
};

export default Invite;
