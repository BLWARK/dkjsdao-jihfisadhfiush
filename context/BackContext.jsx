"use client";
import React, { useState, createContext, useContext } from "react";
import { customGet, customPost, customPut } from "../hooks/customAxios";
import { useRouter } from "next/navigation";



export const BackContext = createContext();

export const BackProvider = ({ children }) => {
  const router = useRouter();
  const [dataMe, setDataMe] = useState();
  const [dataPlay, setDataPlay] = useState();
  const [clickCoin, setClickCoin] = useState();
  const [claim, setClaim] = useState();

//   const [balance, setBalance] = useState(dataUser.balanceAirdrop);
//   const [balanceAirdrop, setBalanceAirdrop] = useState(dataUser.balanceAirdrop);
//   const [balanceFarming, setBalanceFarming] = useState(dataUser.balanceFarming);
//   const [referrals, setRefferals] = useState(dataReferral[0].totalReferral);
//   const [hourEarn, setHourEarn] = useState(666);
//   const [timer, setTimer] = useState(3600);
//   const [canClaim, setCanClaim] = useState(false);
//   const [claimableCoins, setClaimableCoins] = useState(0);
//   const [userLevel, setUserLevel] = useState("Urban Survivor");
//   const [perSecondEarn, setPerSecondEarn] = useState(0.185);
//   const [levelImage, setLevelImage] = useState("/UrbanSurvivor.png");
//   const [nftRewardBonus, setNftRewardBonus] = useState(0);
//   const [checkpointDone, setCheckpointDone] = useState(false);
//   const [checkpointCount, setCheckpointCount] = useState(0);
//   const [pointsReached, setPointsReached] = useState({});
//   const [lastCheckpointDate, setLastCheckpointDate] = useState("");
//   const [userNFTs, setUserNFTs] = useState(dataUser.nfts);
//   const [completedTasks, setCompletedTasks] = useState([]);

  const login = async ( userData ) => {
    const data = {
      id: userData?.id,
      first_name: userData?.first_name,
      last_name: userData?.last_name,
      username: userData?.username,
      language_code: userData?.language_code,
      is_premium: userData?.is_premium,
    };

    try {
      const res = await customPost("/api/v1/auth/telegram",
        data
      );
      
      if (res?.data?.token) {
        localStorage.setItem("token", res?.data?.token);
        router.push("/main/earn");
      }
      
    } catch (error) {
      console.error(error);
    } 
  };

  const getMe = async () => {
    try {
      const res = await customGet(`/api/v1/me`);
      console.log(res)
      setDataMe(res?.user);
    } catch (error) {
      console.log(error);
    }
  };

  const play = async () => {
    try{
      const res = await customPost('/api/v1/play')
      setDataPlay(res);
    } catch (error) {
      console.log(error);
    }
  }

  const click = async ( dataCount ) => {
    const clickCount = {
      clickCount: dataCount?.clickCount,
    };
    try{
      const res = await customPost('/api/v1/click-coin',  clickCount)
      console.log(res)
      setClickCoin(res);
    } catch (error) {
      console.log(error);
    }
  }


  const claimPoint = async () => {
    try{
      const res = await customPost('/api/v1/claim')
      console.log(res)
      setClaim(res);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <BackContext.Provider
      value={{
        login,
        getMe,
        play,
        click,
        claimPoint,
        dataMe,
        dataPlay,
        clickCoin,
        claim,
      }}
    >
      {children}
    </BackContext.Provider>
  );


};

export function useBackend() {
    return useContext(BackContext);
  }