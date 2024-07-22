"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGlobalState } from "@/context/GlobalStateContext";
import Link from "next/link";
import { dataLevel } from "@/lib/data";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const Page = () => {
  const { userLevel, perSecondEarn, referrals, balanceAirdrop, checkpointCount, pointsReached, getNftCountAndRarity, hasCompletedCheckpoint } = useGlobalState();
  
  const [showLevelInfoPopup, setShowLevelInfoPopup] = useState(false);

  const handleLevelInfoClick = () => {
    setShowLevelInfoPopup(true);
  };

  const handleCloseLevelInfoPopup = () => {
    setShowLevelInfoPopup(false);
  };

  const getLevelImage = (levelName) => {
    const level = dataLevel.find((lvl) => lvl.name === levelName);
    return level ? level.image : null;
  };

  const levelImage = getLevelImage(userLevel);

  const CompleteButton = () => (
    <span className="bg-green-500 text-white px-2 py-1 rounded text-[8px]">Complete</span>
  );

  const GoButton = ({ link }) => (
    <Link href={link}>
      <button className="bg-blue-500 text-white px-4 py-1 rounded text-[8px]">Go</button>
    </Link>
  );

  const renderNftRequirement = (level) => {
    const { minNftOwnership, rarity } = level;

    let nftLinkText = "";
    let linkUrl = "";

    if (level.name === "Street Trader") {
      nftLinkText = "1 Rare NFT";
      linkUrl = "/marketplace/rare";
    } else if (level.name === "Small Biz Tycoon") {
      nftLinkText = "2 Rare NFTs";
      linkUrl = "/marketplace/rare";
    } else if (level.name === "Enterprise Leader") {
      nftLinkText = "1 Super Rare NFT";
      linkUrl = "/marketplace/super-rare";
    } else if (level.name === "Billionaire Visionary") {
      nftLinkText = "2 Super Rare NFTs";
      linkUrl = "/marketplace/super-rare";
    }

    const { countR, countSR } = getNftCountAndRarity();
    const userNftCount = rarity === "R" ? countR : countSR;
    const nftRequirementMet = userNftCount >= minNftOwnership;

    return (
      <li className="font-regular text-[12px] flex justify-between items-center w-full gap-4">
        <div>
          Have{" "}
          <Link href={linkUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-500 italic">
            {nftLinkText}
          </Link>{" "}
          NFT
        </div>
        {nftRequirementMet ? <CompleteButton /> : <GoButton link={linkUrl} />}
      </li>
    );
  };

  const renderTasksForNextLevel = (level) => {
    const nextLevelIndex = dataLevel.findIndex(lvl => lvl.name === level) + 1;
    if (nextLevelIndex >= dataLevel.length) return null;
    const nextLevel = dataLevel[nextLevelIndex];

    return (
      <div className="info1 gap-2 flex flex-col justify-start items-start">
        <p className="font-bold text-[16px] text-blue-300 flex flex-col mb-3">
          Next Level: 
          <span>
          {nextLevel.name} ({nextLevel.perHourEarn} profit/hour)
          </span>
        </p>
        <ul className="info1-wrap list-disc list-inside flex flex-col justify-start items-start gap-2">
          {nextLevel.minReferral && (
            <li className="font-regular text-[12px] flex justify-between items-center w-full">
              Total referral reached {nextLevel.minReferral} user
              {referrals >= nextLevel.minReferral ? <CompleteButton /> : <GoButton link="/main/invite" />}
            </li>
          )}
          {nextLevel.minimumPoint && (
            <li className="font-regular text-[12px] flex justify-between items-center w-full gap-4">
              Total Point reached {nextLevel.minimumPoint} points
              {balanceAirdrop >= nextLevel.minimumPoint || pointsReached[nextLevel.name] ? <CompleteButton /> : <GoButton link="/main/earn" />}
            </li>
          )}
          {nextLevel.minNftOwnership && renderNftRequirement(nextLevel)}
        </ul>
      </div>
    );
  };

  const renderCurrentLevelTasks = () => {
    if (!currentLevelData) return null;

    return (
      <div className="info1 gap-2 flex flex-col justify-start items-start">
        <div className="flex flex-col justify-center items-start mb-3">
          <p className="font-bold text-[16px] text-blue-300">
            {currentLevelData.name} ({currentLevelData.perHourEarn} profit/hour) :
          </p>
          <p className="font-light text-xs text-blue-300 italic">(Your task to eligible to claim rewards)</p>
        </div>
        <ul className="info1-wrap list-disc list-inside flex flex-col justify-start items-start gap-2">
          {currentLevelData.totalCheckPoin && (
            <li className="font-regular text-[12px] flex justify-between items-center w-full gap-4">
              <div>
                Checkpoint {checkpointCount}/{currentLevelData.totalCheckPoin}
              </div>
              {hasCompletedCheckpoint() ? <CompleteButton /> : <GoButton link="/main/claim" />}
            </li>
          )}
          {currentLevelData.minReferral && (
            <li className="font-regular text-[12px] flex justify-between items-center w-full">
              Total referral reached {currentLevelData.minReferral} user
              {referrals >= currentLevelData.minReferral ? <CompleteButton /> : <GoButton link="/main/invite" />}
            </li>
          )}
          {currentLevelData.minimumPoint && (
            <li className="font-regular text-[12px] flex justify-between items-center w-full gap-4">
              Total Point reached {currentLevelData.minimumPoint} points
              {balanceAirdrop >= currentLevelData.minimumPoint || pointsReached[userLevel] ? <CompleteButton /> : <GoButton link="/main/earn" />}
            </li>
          )}
          {currentLevelData.minNftOwnership && renderNftRequirement(currentLevelData)}
        </ul>
      </div>
    );
  };

  const currentLevelData = dataLevel.find((levelData) => levelData.name === userLevel);

  return (
    <div className="level-info-sec bgs w-full min-h-screen flex flex-col justify-start items-center overflow-y-scroll ">
      <div className="balance mt-5 flex justify-center items-center gap-2 ">
        <div onClick={handleLevelInfoClick}  className="wrap-level w-full flex flex-col justify-center items-center">
          <div className="wrap-icon-coin w-full flex justify-center items-center gap-2 mt-2">
            <p  className="text-white text-[28px] font-bold">{userLevel}</p>
            <AiOutlineQuestionCircle
              className="text-white cursor-pointer"
              size={20}
              
            />
          </div>
          <div className="wrap-icon-coin w-full flex justify-center items-center gap-2">
            <p className="text-[12px] font-bold">Profit per hour: </p>
            <p className="text-white text-[12px] font-bold">
              {(perSecondEarn * 3600).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className="custom-wrap-slider w-full flex justify-center items-center  -mt-10">
        <div className="custom-slider-container flex justify-center items-center overflow-hidden w-full ">
          
          <div className="custom-slide flex flex-col justify-center items-center w-full h-[400px]">
            {levelImage && (
              <Image
                src={levelImage} // Gunakan URL gambar level pengguna
                alt={userLevel}
                width={250}
                height={250}
                className="rounded-xl coins2"
              />
            )}
          </div>
        </div>
      </div>
      <div className="level-info-contain bgs flex flex-col justify-center items-center w-full h-[500px] rounded-3xl gap-2 -mt-10 ">
        <div className="wrap-level w-full h-[1200px] flex justify-start items-start p-8">
          <div className="wrap-icon-coin w-full flex flex-col justify-start items-start gap-10">
            {renderCurrentLevelTasks()}
            {renderTasksForNextLevel(userLevel)}
          </div>
        </div>
      </div>

      {showLevelInfoPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="popup-content bgs w-[375px] p-4 rounded-lg shadow-lg text-white text-center relative">
            <button
              className="close-icon absolute top-2 right-2 text-white text-2xl px-3"
              onClick={handleCloseLevelInfoPopup}
            >
              &times;
            </button>
            <h2 className="font-bold text-[16px] mb-2 mt-4 text-left text-blue-400">How to Level Up</h2>
            <p className="text-left mb-2 text-[12px] ">To level up, you need to fulfill the following criteria:</p>
            <ul className="list-disc list-inside text-left mb-4 text-[12px]">
              <li>Reach the required number of referrals.</li>
              <li>Ensure each referral has the required points.</li>
              <li>Own the required number and rarity of NFTs.</li>
              
            </ul>
            <h2 className="font-bold text-[16px] mt-10 mb-2 text-left text-blue-400">How to be Eligible for Rewards</h2>
            <p className="text-left mb-2 text-[12px]">To be eligible for rewards, you need to meet the following criteria:</p>
            <ul className="list-disc list-inside text-left mb-4 text-[12px]">
              <li>Complete all required checkpoints for your current level.</li>
              <li>Have the minimum number of active referrals.</li>
              <li>Reach the minimum point threshold.</li>
              <li>Own the required NFTs if specified.</li>
            </ul>
            <p className="mb-2 text-[8px] italic">Check your current progress in the tasks section to see what you need to complete to be eligible for rewards.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
