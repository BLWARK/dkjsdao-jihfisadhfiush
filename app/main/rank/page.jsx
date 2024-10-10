"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useBackend } from "@/context/BackContext";
import { Player } from "@lottiefiles/react-lottie-player"; // Import Lottie Player

const Rank = () => {
  const { rank, leaderboard, dataMe, getMe } = useBackend();

  const [activeTab, setActiveTab] = useState("leaderboard"); // State to control active tab

  useEffect(() => {
    leaderboard(); // Fetch leaderboard when component mounts
    getMe(); // Fetch user data when component mounts
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="rank-sec bgs w-full flex flex-col justify-start items-center overflow-y-scroll">
      {/* Tab Navigation */}

      {/* Leaderboard Content */}
      <div className="rank-invite w-full px-4 flex flex-col justify-center items-center mt-5">
        <div className="title flex gap-2 justify-center items-center py-5">
          <Image src="/Crown.png" alt="gift" width={30} height={30} />
          <p className="font-bold text-[24px]">
            {activeTab === "leaderboard"
              ? "Leaderboards"
              : "Moonshot Leaderboard"}
          </p>
        </div>

        <div className="subtitle w-full text-[12px] text-left flex flex-col gap-1 justify-start items-start mt-5 mb-2">
          <p className="font-bold">
            {activeTab === "leaderboard"
              ? "Top Leaderboards"
              : "Top Moonshot Leaderboards"}
          </p>
          <p className="text-[10px] italic">
            (Rankings are calculated based on points and referrals)
          </p>
        </div>
        <div className="tabs w-full flex justify-start items-center gap-4 mt-4">
          <div
            onClick={() => handleTabClick("leaderboard")}
            className={`tab  rounded-lg bgs px-4 py-3 text-[10px] font-bold cursor-pointer transition-all duration-300 ease-in-out ${
              activeTab === "leaderboard"
                ? "scale-110 bg-blue-500 text-blue-300"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            Leaderboard
          </div>
          <div
            onClick={() => handleTabClick("moonshot")}
            className={`tab bgs px-4 py-3 text-[10px] font-bold rounded-lg cursor-pointer transition-all duration-300 ease-in-out ${
              activeTab === "moonshot"
                ? "scale-110 bg-blue-500 text-blue-300"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            Moonshot Leaderboard
          </div>
        </div>

        {/* Display different content based on the active tab */}
        <div className="all-friends overflow-y-scroll h-[540px] flex flex-col mb-24 gap-2 mt-2 transition-all duration-500 ease-in-out">
          {rank?.leaderboard?.length > 0 ? (
            rank.leaderboard.map((user, index) => (
              <div
                key={user._id}
                className="list1 w-[360px] h-[120px] flex justify-between items-center bgs rounded-xl p-6"
              >
                <div className="wrap-user-rank flex justify-start items-center gap-3">
                  {/* Conditionally render Lottie for rank 1-3 */}
                  {index === 0 && (
                    <Player
                      autoplay
                      loop
                      src="https://lottie.host/85c981ab-c4d3-45a7-9e91-586d1eddf58e/vwJeN1CnUl.json" // Rank 1
                      style={{ height: "20px", width: "20px" }}
                    />
                  )}
                  {index === 1 && (
                    <Player
                      autoplay
                      loop
                      src="https://lottie.host/81b672cb-18d8-4534-afc7-f4a6d54ef031/IsSm6Td5Sr.json" // Rank 2
                      style={{ height: "20px", width: "20px" }}
                    />
                  )}
                  {index === 2 && (
                    <Player
                      autoplay
                      loop
                      src="https://lottie.host/6a0aee3e-b454-4a0a-a871-be12d58ecb64/97h9xYYfVY.json" // Rank 3
                      style={{ height: "20px", width: "20px" }}
                    />
                  )}

                  <div className="username-wrap flex flex-col justify-start items-center ">
                    <p className="text-white text-[15px]">{index + 1}</p>
                  </div>
                  <div className="username-wrap flex flex-col justify-start items-start gap-1">
                    <p className="text-white text-[12px]">
                      {user.firstName || "Unknown User"}
                    </p>
                  </div>
                </div>
                <div className="total-points flex justify-center items-center gap-1">
                  <Image src="/Coins.png" alt="coins" width={15} height={15} />
                  <p className="text-white text-[11px]">
                    {" "}
                    {user.points.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-[340px]">
              {/* Lottie Player for loading */}
              <Player
                autoplay
                loop
                src="https://lottie.host/16594a2c-c2ad-4196-98e2-51ab691a2e8d/ycygvL2itD.json"
                style={{ height: "150px", width: "150px" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rank;
