"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
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
      if (nft.rarity === "R") {
        countR += 1;
      } else if (nft.rarity === "SR") {
        countSR += 1;
      }
    });
    return { countR, countSR };
  };

  const getNftRewardBonus = () => {
    let totalNftReward = 0;
    dataUser.nfts.forEach(userNft => {
      dataNFT.forEach(nftCategory => {
        const nft = nftCategory.nfts.find(n => n.id === userNft.id);
        if (nft) {
          totalNftReward += nft.reward;
        }
      });
    });
    return totalNftReward;
  };

  const checkLevelCriteria = (referrals, referralData, balanceAirdrop, nftCountR, nftCountSR) => {
    if (referrals >= 10 && nftCountSR >= 2 && referralData.every(ref => ref.points >= 666)) {
      return "Billionaire Visionary";
    }
    if (referrals >= 8 && nftCountSR >= 1 && referralData.every(ref => ref.points >= 666)) {
      return "Enterprise Leader";
    }
    if (referrals >= 5 && nftCountR >= 2 && referralData.every(ref => ref.points >= 666)) {
      return "Small Biz Tycoon";
    }
    if (referrals >= 3 && nftCountR >= 1 && referralData.every(ref => ref.points >= 666)) {
      return "Street Trader";
    }
    if (referrals >= 12 && referralData.every(ref => ref.points >= 666)) {
      return "Hustler";
    }
    return "Urban Survivor";
  };

  // useEffect(() => {
  // if (dataUser.referrals.length === 4 && (dataUser.nfts.map((nft) => nft.traits.rarity === "R"))) {
  //   dataLevel[1]
  // } 
  
  // },[
    
  // ])

  useEffect(() => {
    const calculateLevel = () => {
      let newLevel = "Urban Survivor";
      let newPerSecondEarn = 0.185;
      let newHourEarn = 666;

      const { countR, countSR } = getNftCountAndRarity();
      const referralData = dataReferral[0].referrals;

      newLevel = checkLevelCriteria(referrals, referralData, balanceAirdrop, countR, countSR);

      if (newLevel === "Urban Survivor") {
        newPerSecondEarn = dataLevel[0].perHourEarn / 3600;
        newHourEarn = dataLevel[0].perHourEarn;
        setLevelImage(dataLevel[0].image);
      } else if (newLevel === "Hustler") {
        newPerSecondEarn = dataLevel[1].perHourEarn / 3600;
        newHourEarn = dataLevel[1].perHourEarn;
        setLevelImage(dataLevel[1].image);
      } else if (newLevel === "Street Trader") {
        newPerSecondEarn = dataLevel[2].perHourEarn / 3600;
        newHourEarn = dataLevel[2].perHourEarn;
        setLevelImage(dataLevel[2].image);
      } else if (newLevel === "Small Biz Tycoon") {
        newPerSecondEarn = dataLevel[3].perHourEarn / 3600;
        newHourEarn = dataLevel[3].perHourEarn;
        setLevelImage(dataLevel[3].image);
      } else if (newLevel === "Enterprise Leader") {
        newPerSecondEarn = dataLevel[4].perHourEarn / 3600;
        newHourEarn = dataLevel[4].perHourEarn;
        setLevelImage(dataLevel[4].image);
      } else if (newLevel === "Billionaire Visionary") {
        newPerSecondEarn = dataLevel[5].perHourEarn / 3600;
        newHourEarn = dataLevel[5].perHourEarn;
        setLevelImage(dataLevel[5].image);
      }

      setUserLevel(newLevel);
      setPerSecondEarn(newPerSecondEarn);
      setHourEarn(newHourEarn);
    };

    calculateLevel();
    setNftRewardBonus(getNftRewardBonus());
  }, [referrals, balanceAirdrop]);

  useEffect(() => {
    const updatePointsReached = () => {
      const currentLevelData = dataLevel.find((levelData) => levelData.name === userLevel);
      if (currentLevelData) {
        setPointsReached(prevState => ({
          ...prevState,
          [userLevel]: balanceAirdrop >= currentLevelData.minimumPoint || prevState[userLevel]
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
        setTimer((prev) => Math.max(prev - 1, 0));
        if (timer <= 3590) {
          setCanClaim(true);
        }
        setClaimableCoins((prev) => prev + perSecondEarn);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, perSecondEarn]);

  // Tambahkan fungsi untuk mengupdate status penyelesaian tugas
 

  return (
    <GlobalStateContext.Provider value={{
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
     
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
