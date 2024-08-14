"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoWallet, IoTimer } from "react-icons/io5";
import { MdClose, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useBackend } from "@/context/BackContext";
import CoinImage from "@/public/Coins1.png";

const Page = () => {
  const {
    balance,
    setBalance,
    timer,
    setTimer,
    claimableCoins,
    setClaimableCoins,
    levelImage,
    nftRewardBonus,
  } = useGlobalState();

  const {
    dataMe, 
    getMe,
    dataPlay, 
    play,
    claimPoint,
  } = useBackend();

  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const [coinClicked, setCoinClicked] = useState(false);
  const [tapTrails, setTapTrails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [clickDelay, setClickDelay] = useState(false);
  const [showConnectWalletPopup, setShowConnectWalletPopup] = useState(false);

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    play();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);

        // Update coin pertumbuhan setiap detik
        const valueToAdd = dataPlay?.perSecondEarn || 0;
        setClaimableCoins((prev) => prev + valueToAdd);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, dataPlay, setTimer, setClaimableCoins]);

  // Menghitung apakah pengguna bisa klaim berdasarkan unclaimedPoints dari API backend
  const canClaim = claimableCoins > 0;

  const handleClaim = async () => {
    if (canClaim) {
      setIsLoading(true);

      // Panggil API claim dari backend
      const claimData = await claimPoint();

      if (claimData) {
        // Update balance dan dataMe.points dengan earnedPoints dari respons API
        setBalance((prev) => prev + claimData.earnedPoints);

        // Update dataMe.points (alias balanceAirdrop) dengan earnedPoints
        dataMe.points += claimData.earnedPoints;

        // Reset claimable coins dan timer setelah klaim
        setClaimableCoins(0); 
        setTimer(3600); 

        // Panggil play lagi untuk memulai sesi baru
        await play(); 
      }

      setIsLoading(false);
    }
  };

  const handleClick = (event) => {
    if (clickDelay || claimableCoins <= 0) return;

    const currentTime = Date.now();
    if (currentTime - lastClickTime < 10) {
      return;
    }
    setLastClickTime(currentTime);

    if (claimableCoins > 0) {
      const valueToAdd = dataPlay?.perSecondEarn || 0; // Menggunakan dataPlay.perSecondEarn dari API
      setBalance((prev) => prev + valueToAdd);
      dataMe.points += valueToAdd; // Update points di dataMe sesuai dengan perSecondEarn

      setClaimableCoins((prev) => {
        const newClaimableCoins = prev - valueToAdd;
        if (newClaimableCoins <= 0) {
          setClickDelay(true);
          setTimeout(() => {
            setClickDelay(false);
          }, 5000);
        }
        return newClaimableCoins < 0 ? 0 : newClaimableCoins;
      });

      const { clientX, clientY } = event;

      const id = Date.now();
      setFloatingNumbers((prev) => [
        ...prev,
        {
          id,
          value: valueToAdd.toFixed(6),
          x: clientX,
          y: clientY,
        },
      ]);

      setTapTrails((prev) => [
        ...prev,
        {
          id,
          x: clientX,
          y: clientY,
        },
      ]);

      setCoinClicked(true);
      setTimeout(() => {
        setCoinClicked(false);
      }, 50);

      setTimeout(() => {
        setFloatingNumbers((prev) =>
          prev.filter((num) => num.id !== id)
        );
        setTapTrails((prev) =>
          prev.filter((trail) => trail.id !== id)
        );
      }, 2000);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="earn-sec bgs w-full flex flex-col justify-start items-center min-h-screen overflow-y-scroll relative my-5">
      {floatingNumbers.map((num) => (
        <div
          key={num.id}
          className="floating-number"
          style={{ left: num.x, top: num.y }}
        >
          <Image src={CoinImage} alt="Floating Coin" width={40} height={40} />
        </div>
      ))}
      {tapTrails.map((trail) => (
        <div
          key={trail.id}
          className="tap-trail"
          style={{ left: trail.x, top: trail.y }}
        ></div>
      ))}
      <div className="wrap-farm w-full px-4 flex flex-col justify-center items-center mt-5 ">
        <div className="top-sec w-full flex justify-between items-center ">
          <div className="top-user w-[50%] flex items-center justify-start gap-2">
            <button className="gap-2 px-2 flex flex-col justify-start items-start ">
              <p className=" text-[12px] font-bold">Hi, {dataMe ? dataMe?.username : "loading"}</p>
              <Link href="/main/level" className="flex justify-center items-center text-blue-400 ">
                <p className=" text-[12px] font-bold "><span className="text-[12px] font-light text-gray-400">Level: </span>{dataPlay?.levelName} </p>
                <MdOutlineKeyboardArrowRight />
              </Link>
            </button>
          </div>
          <div className="top-user w-[50%] flex items-center justify-end gap-2">
            <button 
              className="gap-2 but p-4 flex justify-center items-center rounded-xl" 
              // onClick={handleConnectWalletClick}
              // disabled={!!walletAddress}
            >
              <IoWallet />
              <p className=" text-[12px] ">walletAddress</p>
            </button>
          </div>
        </div>
       
        <div className="level-sec w-full grid grid-cols-2 justify-between items-center mt-4 gap-4">
          <div className="balance bgs  flex flex-col justify-start items-start px=4 py-3 rounded-xl gap-2">
            <p className="font-light text-[10px] text-gray-400">Profit per hour </p>
            <div className="wrap-level w-full  flex justify-between items-center">
              <div className="wrap-icon-coin w-full flex justify-start items-start gap-2">
                <p className="text-white text-[12px] font-bold">{(dataPlay?.perSecondEarn * 3600).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="balance bgs  flex flex-col justify-start items-start px-4 py-3 rounded-xl gap-2">
            <p className="font-light text-[10px] text-gray-400">NFT Reward Bonus </p>
            <div className="wrap-level w-full  flex justify-between items-center">
              <div className="wrap-icon-oin w-full flex justify-start items-start gap-2">
                <p className="text-white text-[12px] font-bold">{nftRewardBonus.toLocaleString('en-US', { maximumFractionDigits: 4 })}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="balance  flex flex-col justify-start items-start mt-7  gap-4">
          <div className="wrap-total-balance w-full flex justify-between items-center">
            <div className="wrap-icon-coin w-full flex justify-center items-center gap-2">
              <Image src="/Coins.png" alt="Logo" loading="lazy" width={30} height={30} />
              <p className="font-bold text-[28px] text-white text-right">{dataMe?.points.toLocaleString('en-US', { maximumFractionDigits: 4 })}</p>
            </div>
          </div>
        </div>
        <div className="wrap-coin-sec w-full flex flex-col justify-center items-center  px-14 py-5" onClick={handleClick}>
          <div className="coin-sec w-full flex flex-col justify-center items-center -mt-3">
            <div className="coins1 mt-8"></div>
            <Image
              src={`/${dataMe?.level}.png`}
              alt="Level Image"
              width={240}
              height={240}
              className={`coin1 mt-8 ${coinClicked ? 'clicked' : ''}`}
            />
          </div>
        </div>
        <button
          className={`w-[330px] h-[55px]  rounded-xl flex justify-center items-center mt-10 ${canClaim ? 'but' : 'bg-gray-500 cursor-not-allowed'}`}
          onClick={handleClaim}
          disabled={!canClaim || isLoading}
        >
          <div className="timer w-[15%] h-[55px] rounded-l-xl but flex flex-col justify-center items-center">
            <IoTimer />
            <p className="text-[8px]">{formatTime(timer)}</p>
          </div>
          <div className="claim w-[85%] flex justify-center items-center font-bold">
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              <p>Claim {claimableCoins.toLocaleString('en-US', { maximumFractionDigits: 6 })}</p>
            )}
          </div>
        </button>
        <div className="wrap-coin-sec w-full flex flex-col justify-center items-center rounded-2xl mt-8  mb-28">
          <div className="img-warp w-[500] h-[200] object-contain">
            <Image
              src="/banner1.jpg"
              alt="banner"
              width={360}
              height={50}
              className="rounded-xl"
              onClick={() => window.open("https://xyznt.io", "_blank")}
            />
          </div>
        </div>
      </div>

      {/* {showConnectWalletPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 ">
          <div className="popup-content bgs w-[350px] h-[360px] rounded-lg shadow-lg text-center flex flex-col p-3 gap-2 relative">
            <button className="close-icon absolute top-4 right-4 text-white text-2xl" onClick={handleCloseConnectWalletPopup}>
              <MdClose />
            </button>
            <p className="mb-4 text-white font-bold text-lg mt-5">Connect Your Wallet</p>
            <input
              type="text"
              placeholder="Enter your wallet address"
              value={walletAddress}
              onChange={handleWalletAddressChange}
              className="bg-blue-950 w-[330px] h-[70px] p-5 rounded-lg text-[12px] mb-4"
            />
            <p className='text-xs italic text-red-500 font-extrabold'>Please enter your wallet address (BEP20) correctly, <span className='text-xs italic text-white font-light'>your reward will send in your wallet address, We will not be responsible if the wallet you entered is incorrect</span>
            </p>
            <button
              onClick={handleConnectWallet}
              className={`but p-4 rounded-lg mt-8 ${!walletAddress ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!walletAddress}
            >
              Connect
            </button>
          </div>
        </div>
      )} */}
      <div className="py-3"></div>
    </div>
  );
};

export default Page;
