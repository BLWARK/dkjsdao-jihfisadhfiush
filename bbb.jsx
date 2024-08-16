"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { IoWallet, IoTimer } from "react-icons/io5";
import { MdClose, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useGlobalState } from "@/context/GlobalStateContext";
import CoinImage from "@/public/Coins1.png";
import { useBackend } from "@/context/BackContext";

const Page = () => {
  const {
    balance,
    setBalance,
    balanceAirdrop,
    setBalanceAirdrop,
    timer,
    setTimer,
    canClaim,
    setCanClaim,
    claimableCoins,
    setClaimableCoins,
    userLevel,
    setUserLevel,
    perSecondEarn,
    setPerSecondEarn,
    levelImage,
    setLevelImage,
    nftRewardBonus,
  } = useGlobalState();

  const {
    dataMe,
    getMe,
    dataPlay,
    play,
    claimPoint,
    click,
  } = useBackend();

  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const [coinClicked, setCoinClicked] = useState(false);
  const [tapTrails, setTapTrails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [clickDelay, setClickDelay] = useState(false);
  const [showConnectWalletPopup, setShowConnectWalletPopup] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const playCalled = useRef(false);

  // Fetch initial data from API Me and Play
  useEffect(() => {
    const initializeData = async () => {
      await getMe();
      if (dataMe) {
       
        setBalanceAirdrop(dataMe.points); // Use balanceAirdrop from backend
        
        
      }

      await play();
      if (dataPlay) {
        setClaimableCoins(dataPlay.unclaimedPoints);
        setPerSecondEarn(dataPlay.perSecondEarn);
        setTimer(3600 - dataPlay.elapsedTimeInSeconds); // Sync timer with backend
      }
    };

    if (!playCalled.current) {
      initializeData();
      playCalled.current = true;
    }
  }, []); // Run this effect only once

  // handleClaim logic
  const handleClaim = async () => {
    if (canClaim) {
      setIsLoading(true);
      
      try {
        await play(); // Get latest unclaimedPoints and perSecondEarn from backend
        setBalanceAirdrop((prev) => prev + dataPlay.unclaimedPoints);
        setBalance((prev) => prev + dataPlay.unclaimedPoints);
        setClaimableCoins(0); // Reset coins

        await claimPoint(); // Claim points on the backend

        setTimer(3600); // Reset timer
        setCanClaim(false); // Disable claim button
      } catch (error) {
        console.error("Error during claim:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // handleClick logic
  const handleClick = (event) => {
    const currentTime = Date.now();
  
    // Periksa apakah pengguna sudah menunggu 2 detik sebelum klik lagi
    if (currentTime - lastClickTime < 10) return;
    setLastClickTime(currentTime);
  
    // Logika klik frontend
    if (claimableCoins > 0) {
      const valueToAdd = perSecondEarn;
      setBalance((prev) => prev + valueToAdd); // Tambahkan balance secara lokal
      setBalanceAirdrop((prev) => prev + valueToAdd); // Tambahkan balanceAirdrop secara lokal\
      
      
      // Periksa apakah timer melebihi 1 jam (3600 detik)
      setTimer((prev) => {
        const newTimer = prev + 1;
        return newTimer > 3600 ? 3600 : newTimer; // Batasi timer maksimal 3600 detik (1 jam)
      });
  
      setClaimableCoins((prev) => prev +-valueToAdd); // Tambahkan koin yang bisa diklaim secara lokal
  
      // Visual effects untuk klik
      const { clientX, clientY } = event;
      const id = Date.now();
      setFloatingNumbers((prev) => [
        ...prev,
        { id, value: valueToAdd.toFixed(6), x: clientX, y: clientY }
      ]);
      setTapTrails((prev) => [
        ...prev,
        { id, x: clientX, y: clientY }
      ]);
      setCoinClicked(true);
      setTimeout(() => setCoinClicked(false), 50);
  
      // Hapus visual floating numbers dan trails setelah 2 detik
      setTimeout(() => {
        setFloatingNumbers((prev) => prev.filter((num) => num.id !== id));
        setTapTrails((prev) => prev.filter((trail) => trail.id !== id));
      }, 2000);
  
      // Atur timer 2 detik setelah klik terakhir untuk memanggil API click sekali saja
      clearTimeout(clickDelay); // Batalkan timeout sebelumnya jika ada
      const newDelay = setTimeout(async () => {
        try {
          await click({ clickCount: 1 }); // Panggil API click hanya sekali
        } catch (error) {
          console.error("Error during click:", error);
        }
      }, 2000);
      setClickDelay(newDelay); // Simpan timeout baru
    }
  };
  
  
  

  // Format the time from seconds to hh:mm:ss
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const handleConnectWalletClick = () => {
    if (!walletAddress) {
      setShowConnectWalletPopup(true);
    }
  };

  const handleCloseConnectWalletPopup = () => {
    setShowConnectWalletPopup(false);
    setWalletAddress('');
  };

  const handleWalletAddressChange = (event) => {
    setWalletAddress(event.target.value);
  };

  const handleConnectWallet = () => {
    if (walletAddress) {
      dataUser.walletAddress = walletAddress; // Simpan alamat wallet ke dataUser
      handleCloseConnectWalletPopup();
    }
  };

  const formatWalletAddress = (address) => {
    if (address.length > 9) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
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
      <div className="wrap-farm w-full px-4 flex flex-col justify-center items-center ">
        <div className="top-sec w-full flex justify-between items-center ">
          <div className="top-user w-[50%] flex items-center justify-start gap-2">
            <button className="gap-2 px-2 flex flex-col justify-start items-start ">
              <p className=" text-[12px] font-bold">Hi, {dataMe ? dataMe?.username : "loading"}</p>
              <Link href="/main/level" className="flex justify-center items-center text-blue-400 ">
              
              <p className=" text-[12px] font-bold "><span className="text-[12px] font-light text-gray-400">Level: </span>{userLevel} </p>
              <MdOutlineKeyboardArrowRight />
              </Link>
            </button>
          </div>
          <div className="top-user w-[50%] flex items-center justify-end gap-2">
            <button 
              className={`gap-2 but p-4 flex justify-center items-center rounded-xl ${walletAddress ? 'Disable' : ''}`} 
              onClick={handleConnectWalletClick}
              disabled={!!walletAddress}
            >
              <IoWallet />
              <p className=" text-[12px] ">{walletAddress ? formatWalletAddress(walletAddress) : 'Connect Wallet'}</p>
            </button>
          </div>
        </div>
       
        <div className="level-sec w-full grid grid-cols-2 justify-between items-center mt-4 gap-4">
          <div className="balance bgs  flex flex-col justify-start items-start px-4 py-3 rounded-xl gap-2">
            <p className="font-light text-[10px] text-gray-400">Profit per hour </p>
            <div className="wrap-level w-full  flex justify-between items-center">
              <div className="wrap-icon-coin w-full flex justify-start items-start gap-2">
                <p className="text-white text-[12px] font-bold">{(dataPlay?.perHourEarn)}</p>
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
              <p className="font-bold text-[28px] text-white text-right">{dataMe?.points.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
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
              <p>Claim {(claimableCoins).toLocaleString('en-US', { maximumFractionDigits: 6 })}</p>
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

      {showConnectWalletPopup && (
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
      )}
      <div className="py-3"></div>
    </div>
  );
};

export default Page;