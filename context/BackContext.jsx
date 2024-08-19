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
  const [rank, setRank] = useState ();

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

  const leaderboard = async () => {
    try{
      const res = await customGet('api/v1/leaderboard')
      console.log(res)
      setRank(res);
    } catch (error) {
      console.log(error);
    }
  }

  const loginReferral = async (referral) => {
   
    toast.loading("Logging in with referral code"); 
    try {
      const res = await customPost(`/api/v1/auth/telegram/${referral}` );
      return res.data;
    } catch (error) {
      console.log(error);
      toast.error("Invalid referral code");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <BackContext.Provider
      value={{
        login,
        getMe,
        play,
        click,
        claimPoint,
        leaderboard,
        loginReferral,
        rank,
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