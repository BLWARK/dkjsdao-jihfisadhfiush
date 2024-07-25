"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { dataUser, dataReferral, dataLevel, dataNFT } from "@/lib/data";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [balance, setBalance] = useState(dataUser.balanceAirdrop);
  const [balanceAirdrop, setBalanceAirdrop] = useState(dataUser.balanceAirdrop);
  const [balanceFarming, setBalanceFarming] = useState(dataUser.balanceFarming);
  const [referrals, setRefferals] = useState(dataReferral[0].totalReferral);
  const [hourEarn, setHourEarn] = useState(666);
  const [timer, setTimer] = useState(3600);
  const [canClaim, setCanClaim] = useState(false);
  const [claimableCoins, setClaimableCoins] = useState(0);
  const [userLevel, setUserLevel] = useState("Urban Survivor");
  const [perSecondEarn, setPerSecondEarn] = useState(0.185);
  const [levelImage, setLevelImage] = useState("/UrbanSurvivor.png");
  const [nftRewardBonus, setNftRewardBonus] = useState(0);
  const [checkpointDone, setCheckpointDone] = useState(false);
  const [checkpointCount, setCheckpointCount] = useState(0);
  const [pointsReached, setPointsReached] = useState({});
  const [lastCheckpointDate, setLastCheckpointDate] = useState("");
  const [userNFTs, setUserNFTs] = useState(dataUser.nfts);

  const getNftCountAndRarity = () => {
    let countR = 0;
    let countSR = 0;
    dataUser.nfts.forEach(nft => {
      const rarityTrait = nft.traits.find(trait => trait.rarity);
      if (rarityTrait) {
        if (rarityTrait.rarity === "R") {
          countR += 1;
        } else if (rarityTrait.rarity === "SR") {
          countSR += 1;
        }
      }
    });
    
    return { countR, countSR };
  };

  const getNftRewardBonus = () => {
    let totalNftReward = 0;
    dataUser.nfts.forEach((userNft) => {
      const rewardTrait = userNft.traits.find((trait) => trait.reward);
      if (rewardTrait) {
        totalNftReward += rewardTrait.reward;
      }
    });
    return totalNftReward;
  };

  const checkLevelCriteria = (referrals, nftCountR, nftCountSR) => {
    console.log(`Checking level criteria - Referrals: ${referrals}, R: ${nftCountR}, SR: ${nftCountSR}`);
    if (referrals >= 10 && nftCountSR >= 2) {
      return 6; // Billionaire Visionary
    }
    if (referrals >= 8 && nftCountSR >= 1) {
      return 5; // Enterprise Leader
    }
    if (referrals >= 5 && nftCountR >= 2) {
      return 4; // Small Biz Tycoon
    }
    if (referrals >= 3 && nftCountR >= 1) {
      return 3; // Street Trader
    }
    if (referrals >= 12) {
      return 2; // Hustler
    }
    return 1; // Urban Survivor
  };

  useEffect(() => {
    const calculateLevel = () => {
      let newLevel = 1; // Urban Survivor
      let newPerSecondEarn = 0.185;
      let newHourEarn = 666;

      const { countR, countSR } = getNftCountAndRarity();

      newLevel = checkLevelCriteria(referrals, countR, countSR);

      

      const currentLevelData = dataLevel.find(level => level.id === String(newLevel));
      if (!currentLevelData) {
        console.error(`Level data not found for level ID: ${newLevel}`);
        return;
      }

      newPerSecondEarn = currentLevelData.perSecondEarn;
      newHourEarn = currentLevelData.perHourEarn;
      setLevelImage(currentLevelData.image);
      setUserLevel(currentLevelData.name); // Set the user level name for display
      setPerSecondEarn(newPerSecondEarn);
      setHourEarn(newHourEarn);

      
    };

    calculateLevel();
    setNftRewardBonus(getNftRewardBonus());
  }, [referrals, userNFTs]); // Memastikan userNFTs juga dipantau

  useEffect(() => {
    const updatePointsReached = () => {
      const currentLevelData = dataLevel.find(
        levelData => levelData.name === userLevel
      );
      if (currentLevelData) {
        setPointsReached((prevState) => ({
          ...prevState,
          [userLevel]:
            balanceAirdrop >= currentLevelData.minimumPoint ||
            prevState[userLevel],
        }));
      }
    };
    updatePointsReached();
  }, [balanceAirdrop, userLevel]);

  const hasCompletedCheckpoint = () => {
    const currentLevelData = dataLevel.find(level => level.name === userLevel);
    return checkpointCount >= (currentLevelData?.totalCheckPoin || 0);
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => Math.max(prev - 1, 0));
        if (timer <= 3590) {
          setCanClaim(true);
        }
        setClaimableCoins(prev => prev + perSecondEarn);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, perSecondEarn]);

  return (
    <GlobalStateContext.Provider
      value={{
        balance,
        setBalance,
        balanceAirdrop,
        setBalanceAirdrop,
        balanceFarming,
        setBalanceFarming,
        referrals,
        setRefferals,
        hourEarn,
        timer,
        setTimer,
        canClaim,
        setCanClaim,
        claimableCoins,
        setClaimableCoins,
        userLevel,
        perSecondEarn,
        levelImage,
        nftRewardBonus,
        getNftCountAndRarity,
        checkpointDone,
        setCheckpointDone,
        checkpointCount,
        setCheckpointCount,
        pointsReached,
        lastCheckpointDate,
        setLastCheckpointDate,
        userNFTs,
        hasCompletedCheckpoint,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
