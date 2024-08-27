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
  const [total, setTotal] = useState ();
  const [task, setTask] = useState ();
  const [userTask, setUserTask] = useState ();
  const [checkpoint, setCheckpoint] = useState();  // State untuk menyimpan data checkpoint user

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
      const res = await customPost("/api/v1/auth/telegram", data);
      if (res?.data?.token) {
        localStorage.setItem("token", res?.data?.token);
        router.push("/main/earn");
      }
    } catch (error) {
      console.error(error);
    } 
  };

  const loginReferral = async (referral, userData) => {
    const data = {
      id: userData?.id,
      first_name: userData?.first_name,
      last_name: userData?.last_name,
      username: userData?.username,
      language_code: userData?.language_code,
      is_premium: userData?.is_premium,
    };
    
    try {
      const res = await customPost(`/api/v1/auth/telegram/${referral}`, data);
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        return res.data;
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Error logging in with referral:", error);
    }  
  };

  const getMe = async () => {
    try {
      const res = await customGet(`/api/v1/me`);
      setDataMe(res?.user);
    } catch (error) {
      console.log(error);
    }
  };

  const totalUsers = async () => {
    try {
      const res = await customGet(`/api/v1/total-user`);
      setTotal(res?.totalUser);
    } catch (error) {
      console.log(error);
    }
  };

  const play = async () => {
    try {
      const res = await customPost('/api/v1/play')
      setDataPlay(res);
    } catch (error) {
      console.log(error);
    }
  };

  const click = async ( dataCount ) => {
    const clickCount = {
      clickCount: dataCount?.clickCount,
    };
    try {
      const res = await customPost('/api/v1/click-coin',  clickCount);
      setClickCoin(res);
    } catch (error) {
      console.log(error);
    }
  };

  const claimPoint = async () => {
    try {
      const res = await customPost('/api/v1/claim');
      setClaim(res);
    } catch (error) {
      console.log(error);
    }
  };

  const leaderboard = async () => {
    try {
      const res = await customGet('api/v1/leaderboard');
      setRank(res);
    } catch (error) {
      console.log(error);
    }
  };

  const taskList = async () => {
    try {
      const res = await customGet('api/v1/tasks');
      if (res?.tasks) {
        setTask(res.tasks);  // Simpan data tugas di state
      }
    } catch (error){
      console.log(error);
    }
  };
  

  const useTask = async (taskId) => {
    try {
      const data = { taskId: taskId };
      const res = await customPost('api/v1/usertasks', data);
      
      if (res?.data?.userPoint) {
        console.log("New user points:", res.data.userPoint);
        setBalanceAirdrop(res.data.userPoint); // Update balanceAirdrop with the new points
      }
  
      // Set state only if response contains necessary data
      if (res?.data) {
        setUserTask(res.data);
      }
  
      return res?.data; // Return only the data part of the response
    } catch (error) {
      console.error("Error in useTask:", error);
    }
  };
  
  

  // Tambahkan fungsi getCheckpoint untuk mengambil data checkpoint user
  const getCheckpoint = async () => {
    try {
      const res = await customGet('api/v1/checkpoint');
      setCheckpoint({
        userPoints: res?.userPoints,
        checkpoint: res?.checkpoint,
        totalCheckpoint: res?.totalCheckpoint,
        checkpointDeduction: res?.checkpointDeduction
      }); // Simpan data checkpoint di state
      return res;
    } catch (error) {
      console.error("Error fetching checkpoint data:", error);
    }
  };
  
  const postCheckpoint = async () => {
    try {
      const res = await customPost('api/v1/checkpoint');
      if (res?.userPoints !== undefined && res?.checkpoint !== undefined) {
        setCheckpoint({
          userPoints: res?.userPoints,
          checkpoint: res?.checkpoint,
          totalCheckpoint: res?.totalCheckpoint
        }); // Update checkpoint setelah post berhasil
      }
      return res;
    } catch (error) {
      console.error("Error posting checkpoint:", error);
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
        totalUsers,
        taskList,
        useTask,
        getCheckpoint,  // Ekspos fungsi getCheckpoint
        postCheckpoint, // Ekspos fungsi postCheckpoint
        task,
        userTask,
        checkpoint,  // Ekspos state checkpoint
        rank,
        dataMe,
        dataPlay,
        clickCoin,
        claim,
        total,
      }}
    >
      {children}
    </BackContext.Provider>
  );
};

export function useBackend() {
    return useContext(BackContext);
}
