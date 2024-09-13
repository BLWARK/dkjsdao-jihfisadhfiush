"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useBackend } from "@/context/BackContext";
import { dataLevel } from "@/lib/data";
import { Player } from "@lottiefiles/react-lottie-player"; // Lottie Player

const Level = () => {
  const { dataMe, getMe, dataPlay, play, checkpoint, getCheckpoint, getMeNFT } =
    useBackend();
  const [showLevelInfoPopup, setShowLevelInfoPopup] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for the page
  const [activeTab, setActiveTab] = useState("eligible"); // State untuk switch antara Eligible dan Level Info
  const [nftData, setNftData] = useState([]); // Menyimpan data NFT
  const [countR, setCountR] = useState(0); // Jumlah Rare NFT
  const [countSR, setCountSR] = useState(0); // Jumlah Super Rare NFT

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getMe(); // Fetch user data
        await play(); // Fetch game session data
        await getCheckpoint(); // Fetch checkpoint data from backend

        const nftResult = await getMeNFT(); // Ambil data NFT
        setNftData(nftResult); // Simpan data NFT ke dalam state

        // Hitung jumlah Rare dan Super Rare NFT
        const rareCount = nftResult.filter((nft) => nft.rarity === "R").length;
        const superRareCount = nftResult.filter(
          (nft) => nft.rarity === "SR"
        ).length;

        setCountR(rareCount);
        setCountSR(superRareCount);

        setLoading(false); // Set loading selesai
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading selesai jika terjadi error
      }
    };
    fetchData();
  }, []);

  const handleLevelInfoClick = () => {
    setShowLevelInfoPopup(true);
  };

  const handleCloseLevelInfoPopup = () => {
    setShowLevelInfoPopup(false);
  };

  const CompleteButton = () => (
    <span className="bg-green-500 text-white px-2 py-1 rounded text-[8px]">
      Complete
    </span>
  );

  const GoButton = ({ link }) => (
    <Link href={link} target="_blank" rel="noopener noreferrer">
      <button className="bg-blue-500 text-white px-4 py-1 rounded text-[8px]">
        Go
      </button>
    </Link>
  );

  const NotEligibleButton = () => (
    <span className="bg-red-500 text-white px-2 py-1 rounded text-[8px]">
      Not Eligible
    </span>
  );

  const EligibleButton = () => (
    <span className="bg-green-500 text-white px-2 py-1 rounded text-[8px]">
      Eligible
    </span>
  );

  // Render NFT Requirement untuk level tertentu
  const renderNftRequirementWithDetails = (level) => {
    const { minNftOwnership } = level;
    let nftRequirementText = "";
    let linkUrl = "https://xyznt.io"; // Default marketplace link

    // Menentukan syarat NFT untuk setiap level
    if (level.name === "Street Trader") {
      nftRequirementText = "1 Rare NFT (R)";
      linkUrl = "https://xyznt.io";
    } else if (level.name === "Small Biz Tycoon") {
      nftRequirementText = "2 Rare NFT (R)";
      linkUrl = "https://xyznt.io";
    } else if (level.name === "Enterprise Leader") {
      nftRequirementText = "1 Super Rare NFT (SR)";
      linkUrl = "https://xyznt.io";
    } else if (level.name === "Billionaire Visionary") {
      nftRequirementText = "2 Super Rare NFT (SR)";
      linkUrl = "https://xyznt.io";
    }

    const nftRequirementMet = countR + countSR >= minNftOwnership;

    return (
      <li className="font-regular text-[12px] flex justify-between items-center w-full gap-4">
        <div>
          Have{" "}
          <Link
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-500 italic"
          >
            {nftRequirementText}
          </Link>
        </div>
        {nftRequirementMet ? (
          <CompleteButton />
        ) : (
          <GoButton link={linkUrl} target="_blank" />
        )}
      </li>
    );
  };

  // Render Eligibility Status untuk level tertentu
  const renderEligibilityStatus = () => {
    console.log("renderEligibilityStatus dipanggil");

    const currentLevelData = dataLevel.find(
      (levelData) => levelData.name === dataPlay?.levelName
    );

    if (!currentLevelData || !dataMe || !checkpoint) {
      console.log("Data tidak tersedia: ", {
        currentLevelData,
        dataMe,
        checkpoint,
      });
      return null; // Jika salah satu data tidak ada, return null
    }

    const hasEnoughReferrals =
      (dataMe?.referredUsers?.length || 0) >= currentLevelData.minReferral;
    const hasEnoughPoints =
      (dataMe?.points || 0) >= currentLevelData.minimumPoint;
    const hasEnoughCheckpoints =
      (checkpoint?.checkpoint || 0) >= currentLevelData.totalCheckPoin;

    const isEligible =
      hasEnoughReferrals && hasEnoughPoints && hasEnoughCheckpoints;

    console.log("Is Eligible:", isEligible); // Log status eligibility

    return (
      <li className="font-regular text-[12px] flex justify-between items-center w-full gap-4">
        <div>Eligibility Status</div>
        {isEligible ? <EligibleButton /> : <NotEligibleButton />}
      </li>
    );
  };

  // Render Tasks untuk Next Level
  const renderTasksForNextLevel = () => {
    const currentLevelIndex = dataLevel.findIndex(
      (levelData) => levelData.name === dataPlay?.levelName
    );
    const nextLevelIndex = currentLevelIndex + 1;

    if (nextLevelIndex >= dataLevel.length) return null; // Jika tidak ada level selanjutnya
    const nextLevelData = dataLevel[nextLevelIndex];

    return (
      <div className="info1 gap-2 flex flex-col justify-start items-start h-full mb-20">
        <p className="font-bold text-[16px] text-blue-300 flex flex-col mb-2">
          Next Level:
          <span>
            {nextLevelData.name} ({nextLevelData.perHourEarn} profit/hour)
          </span>
        </p>
        <ul className="info1-wrap list-disc list-inside flex flex-col justify-start items-start gap-2 ">
          {nextLevelData.minReferral && (
            <li className="font-regular text-[12px] flex justify-between items-center w-full">
              Total referral reached {nextLevelData.minReferral} user
              {(dataMe?.referredUsers?.length || 0) >=
              nextLevelData.minReferral ? (
                <CompleteButton />
              ) : (
                <GoButton href="/main/invite" />
              )}
            </li>
          )}
          {nextLevelData.minimumPoint && (
            <li className="font-regular text-[12px] flex justify-between items-center w-full gap-4">
              Total Point reached {nextLevelData.minimumPoint} points
              {(dataMe?.points || 0) >= nextLevelData.minimumPoint ? (
                <CompleteButton />
              ) : (
                <GoButton href="/main/earn" />
              )}
            </li>
          )}
        </ul>
      </div>
    );
  };

  // Render Tasks untuk Current Level
  const renderCurrentLevelTasks = () => {
    const currentLevelData = dataLevel.find(
      (levelData) => levelData.name === dataPlay?.levelName
    ); // level dari backend

    if (!currentLevelData || !dataMe || !checkpoint) return null;

    return (
      <div className="info1 gap-2 flex flex-col justify-start items-start">
        <div className="flex flex-col justify-center items-start mb-2">
          <p className="font-bold text-[16px] text-blue-300">
            {dataPlay?.levelName} ({dataPlay?.perHourEarn} profit/hour) :
          </p>
          <p className="font-light text-xs text-blue-300 italic">
            (Your task to be eligible to claim rewards)
          </p>
        </div>
        <ul className="info1-wrap list-disc list-inside flex flex-col justify-start items-start gap-2">
          {currentLevelData.totalCheckPoin && (
            <li className="font-regular text-[12px] flex justify-between items-center w-full gap-4">
              <div>
                Checkpoint {checkpoint?.checkpoint}/
                {currentLevelData.totalCheckPoin}
              </div>
              {checkpoint?.checkpoint >= currentLevelData.totalCheckPoin ? (
                <CompleteButton />
              ) : (
                <GoButton href="/main/claim" />
              )}
            </li>
          )}
          {currentLevelData.minReferral && (
            <li className="font-regular text-[12px] flex justify-between items-center w-full">
              Total referral reached {currentLevelData.minReferral} user
              {(dataMe?.referredUsers?.length || 0) >=
              currentLevelData.minReferral ? (
                <CompleteButton />
              ) : (
                <GoButton href="/main/invite" />
              )}
            </li>
          )}
          {currentLevelData.minimumPoint && (
            <li className="font-regular text-[12px] flex justify-between items-center w-full gap-4">
              Total Point reached {currentLevelData.minimumPoint} points
              {(dataMe?.points || 0) >= currentLevelData.minimumPoint ? (
                <CompleteButton />
              ) : (
                <GoButton href="/main/earn" />
              )}
            </li>
          )}
          {renderEligibilityStatus()}
        </ul>
      </div>
    );
  };

  // Render Total Referral dan NFT untuk Level Info (Current Level)
  // const renderReferralAndNFTCurrentLevel = () => {
  //   const currentLevelData = dataLevel.find(
  //     (levelData) => levelData.name === dataPlay?.levelName
  //   );
  //   if (!currentLevelData) return null;

  //   return (
  //     <div className="info1 gap-2 flex flex-col justify-start items-start">
  //       <p className="font-bold text-[16px] text-blue-300">
  //         {currentLevelData.name} (Current Level)
  //       </p>
  //       <ul className="info1-wrap list-disc list-inside flex flex-col justify-start items-start gap-2">
  //         {currentLevelData.minReferral && (
  //           <li className="font-regular text-[12px] flex justify-between items-center w-full gap-6">
  //             Total referral reached {currentLevelData.minReferral} user
  //             {(dataMe?.referredUsers?.length || 0) >=
  //             currentLevelData.minReferral ? (
  //               <CompleteButton />
  //             ) : (
  //               <GoButton link="/main/invite" />
  //             )}
  //           </li>
  //         )}
  //         {currentLevelData.minNftOwnership &&
  //           renderNftRequirement(currentLevelData)}
  //       </ul>
  //     </div>
  //   );
  // };

  // Render Total Referral dan NFT untuk Level Info (Next Level)

  const renderReferralAndNFTForCurrentAndNextLevels = () => {
    const currentLevelIndex = dataLevel.findIndex(
      (levelData) => levelData.name === dataPlay?.levelName
    );

    if (currentLevelIndex === -1) return null; // Jika level tidak ditemukan

    // Ambil semua level dari current level hingga level terakhir
    const levelsToDisplay = dataLevel.slice(currentLevelIndex);

    // Ambil semua level dari Street Trader ke atas untuk syarat NFT
    const streetTraderIndex = dataLevel.findIndex(
      (levelData) => levelData.name === "Street Trader"
    );
    const nftLevelsToCheck = dataLevel.slice(streetTraderIndex);

    return (
      <>
        {levelsToDisplay.map((levelData, index) => (
          <div
            key={index}
            className="info1 w-full gap-2 flex flex-col justify-between items-start mt-4"
          >
            <p className="font-bold text-[16px] text-blue-300 gap-4">
              {levelData.name}{" "}
              {index === 0 ? "(Current Level)" : "(Next Level)"}
            </p>
            <ul className="info1-wrap list-disc list-inside flex flex-col justify-start items-start gap-2">
              {/* Tampilkan syarat referral jika ada */}
              {levelData.minReferral && (
                <li className="font-regular text-[12px] flex justify-between items-center w-full gap-8">
                  Total referral needed {levelData.minReferral} users
                  {(dataMe?.referredUsers?.length || 0) >=
                  levelData.minReferral ? (
                    <CompleteButton />
                  ) : (
                    <GoButton link="/main/invite" />
                  )}
                </li>
              )}

              {/* Tampilkan syarat NFT jika ada, dari level Street Trader ke atas */}
              {nftLevelsToCheck.includes(levelData) &&
                levelData.minNftOwnership && (
                  <li className="font-regular text-[12px] flex justify-between items-center w-full gap-8">
                    {renderNftRequirementWithDetails(levelData)}
                  </li>
                )}
            </ul>
          </div>
        ))}
      </>
    );
  };

  // Jika data sedang diambil, tampilkan animasi loading
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Player
          autoplay
          loop
          src="https://lottie.host/16594a2c-c2ad-4196-98e2-51ab691a2e8d/ycygvL2itD.json" // Animasi Lottie
          style={{ width: 150, height: 150 }}
        />
      </div>
    );
  }

  return (
    <div className="level-info-sec bgs w-full h-screen flex flex-col justify-start items-center overflow-y-scroll">
      <div className="balance mt-5 flex justify-center items-center gap-2 ">
        <div
          onClick={handleLevelInfoClick}
          className="wrap-level w-full flex flex-col justify-center items-center"
        >
          <div className="wrap-icon-coin w-full flex justify-center items-center gap-2 mt-2">
            <p className="text-white text-[28px] font-bold">
              {dataPlay?.levelName}
            </p>
            <AiOutlineQuestionCircle
              className="text-white cursor-pointer"
              size={20}
            />
          </div>
          <div className="wrap-icon-coin w-full flex justify-center items-center gap-2">
            <p className="text-[12px] font-bold">Profit per hour: </p>
            <p className="text-white text-[12px] font-bold">
              {dataPlay?.perHourEarn}
            </p>
          </div>
        </div>
      </div>
      <div className="custom-wrap-slider w-full flex justify-center items-center -mt-8">
        <div className="custom-slider-container flex justify-center items-center overflow-hidden w-full">
          <div className="custom-slide flex flex-col justify-center items-center w-full h-[350px]">
            <Image
              src={dataMe?.level ? `/${dataMe.level}.png` : "/1.png"}
              alt={dataMe?.level}
              width={250}
              height={250}
              className="rounded-xl coins2"
            />
          </div>
        </div>
      </div>

      {/* Switch Button Section */}
      <div className="switch-button px-4 gap-3 relative flex justify-start items-start w-full">
        <button
          className={`button-eligible rounded-lg bgs px-4 py-3 text-[12px] font-bold transition-transform duration-300 ${
            activeTab === "eligible"
              ? "text-blue-300 scale-110"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("eligible")}
        >
          Eligible Status
        </button>
        <button
          className={`button-levelinfo rounded-lg bgs px-4 py-3 text-[12px] font-bold transition-transform duration-300 ${
            activeTab === "levelInfo"
              ? "text-blue-300 scale-110"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("levelInfo")}
        >
          Level Info
        </button>
      </div>

      {/* Konten untuk masing-masing tab */}
      {activeTab === "eligible" && (
        <div className="eligible-info-contain bgs flex flex-col justify-center items-center w-full h-screen rounded-3xl gap-2 mt-2">
          <div className="wrap-level w-full flex justify-start items-start p-8">
            <div className="wrap-icon-coin w-full flex flex-col justify-start items-start gap-10">
              {/* Konten yang akan di-render ketika tombol Eligible diklik */}
              {/* Render current level tasks */}
              {renderCurrentLevelTasks()}
              {/* Render next level tasks */}
              {renderTasksForNextLevel()}
            </div>
          </div>
        </div>
      )}

      {activeTab === "levelInfo" && (
        <div className="level-info-contain bgs flex flex-col justify-start items-start w-full h-[990px] rounded-3xl gap-4 mt-2 mb-24 py-4 px-8">
          {/* Render Referral and NFT untuk Level Info */}
          {renderReferralAndNFTForCurrentAndNextLevels()}
        </div>
      )}

      {showLevelInfoPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="popup-content bgs w-[375px] p-4 rounded-lg shadow-lg text-white text-center relative">
            <button
              className="close-icon absolute top-2 right-2 text-white text-2xl px-3"
              onClick={handleCloseLevelInfoPopup}
            >
              &times;
            </button>
            <h2 className="font-bold text-[16px] mb-2 mt-4 text-left text-blue-400">
              How to Level Up
            </h2>
            <p className="text-left mb-2 text-[12px]">
              To level up, you need to fulfill the following criteria:
            </p>
            <ul className="list-disc list-inside text-left mb-4 text-[12px]">
              <li>Reach the required number of referrals.</li>

              <li>Own the required number and rarity of NFTs.</li>
            </ul>
            <h2 className="font-bold text-[16px] mt-10 mb-2 text-left text-blue-400">
              How to be Eligible for Rewards
            </h2>
            <p className="text-left mb-2 text-[12px]">
              To be eligible for rewards, you need to meet the following
              criteria:
            </p>
            <ul className="list-disc list-inside text-left mb-4 text-[12px]">
              <li>Complete all required checkpoints for your current level.</li>
              <li>Have the minimum number of active referrals.</li>
              <li>Reach the minimum point threshold.</li>
              <li>Own the required NFTs if specified.</li>
            </ul>
            <p className="mb-2 text-[8px] italic">
              Check your current progress in the tasks section to see what you
              need to complete to be eligible for rewards.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Level;
