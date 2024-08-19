"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useBackend } from "@/context/BackContext"; // Mengambil data dari BackContext

const Rank = () => {
  const {
    rank,  // Directly accessing rank from BackContext
    leaderboard, // Function to fetch leaderboard data
    dataMe, // Data retrieved from backend (e.g. user data)
    getMe, // Function to fetch user data
  } = useBackend();

  useEffect(() => {
    leaderboard(); // Fetch leaderboard data on component mount
    getMe(); // Fetch user data on component mount
  }, []);

  return (
    <div className="rank-sec bgs w-full flex flex-col justify-start items-center min-h-screen overflow-y-scroll ">
      <div className="rank-invite w-full px-4 flex flex-col justify-center items-center mt-5">
        <div className="title flex flex-col justify-center items-center">
          <p className="font-bold text-[24px]">Leaderboards</p>
        </div>

        <div className="Ranks-information w-[360px] h-[120px] flex justify-center items-center bgs rounded-3xl gap-4"> {/* Menambahkan gap */}
          <div className="icon w-[35%] flex justify-center items-center">
            <Image src="/Crown.png" alt="gift" width={75} height={75} />
          </div>
          <div className="icon w-[65%] flex flex-col justify-start items-start">
            <p className="font-bold text-[14px]">1st Rank winner this week</p>
            <p className="font-md text-[12px] flex justify-center items-center px-2">
              <span className="text-blue-500 font-bold text-[24px] flex justify-center items-center mr-1 mt-2 gap-1">
                <Image src="/Coins.png" alt="gift" width={25} height={25} />
                +6,666
              </span>
            </p>
          </div>
        </div>

        <div className="subtitle w-full text-[12px] text-left flex justify-start items-start mt-5">
          <p>Top Leaderboards</p>
        </div>

        <div className="all-friends overflow-y-scroll h-[340px] flex flex-col gap-4 mt-2"> 
          {rank?.leaderboard?.length > 0 ? (
            rank.leaderboard.map((user, index) => (
              <div
                key={user._id}
                className="list1 w-[360px] h-[80px] flex justify-between items-center bgs rounded-xl p-3 gap-4"
              >
                <div className="wrap-user-rank flex justify-start items-center gap-4">
                  <div className="username-wrap flex flex-col justify-start items-center gap-1">
                    <p className="text-[10px] text-gray-500">Rank</p>
                    <p className="text-white text-[12px]">{index + 1}</p>
                  </div>
                  <div className="username-wrap flex flex-col justify-start items-start gap-1">
                    <p className="text-[10px] text-gray-500">User name</p>
                    <p className="text-white text-[12px]">{user.username}</p>
                  </div>
                </div>
                <div className="total-reff flex flex-col justify-end items-end gap-2">
                  <p className="text-[10px] text-gray-500">Total Referral</p>
                  <p className="text-white text-[10px]">{user.referredUsersCount}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">Loading leaderboard...</p>
          )}
        </div>

        <div className="all-friends flex-col flex gap-4 mt-5">
          <p className="text-[12px]">Your rank</p>
          {rank?.myRank ? (
            <div className="list1 w-[360px] h-[80px] flex justify-between items-center bgs rounded-xl p-3 "> 
              <div className="wrap-user-rank flex justify-start items-center gap-4">
                <div className="username-wrap flex flex-col justify-start items-center gap-1">
                  <p className="text-[10px] text-gray-500">Rank</p>
                  <p className="text-white text-[12px]">{rank.myRank}</p>
                </div>
                <div className="username-wrap flex flex-col justify-start items-start gap-1">
                  <p className="text-[10px] text-gray-500">User name</p>
                  <p className="text-white text-[12px]">{dataMe?.username}</p>
                </div>
              </div>
              <div className="total-reff flex flex-col justify-end items-end gap-2">
                <p className="text-[10px] text-gray-500">Total referral</p>
                <p className="text-white text-[10px]">{dataMe?.referredUsers?.length || 0}</p>
              </div>
            </div>
          ) : (
            <p className="text-white">Loading your rank...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rank;
