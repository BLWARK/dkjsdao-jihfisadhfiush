"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { IoWallet, IoTimer } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useBackend } from "@/context/BackContext";
import CoinImage from "@/public/Coins1.png";

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
    claim,
    click,
  } = useBackend();

  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const [coinClicked, setCoinClicked] = useState(false);
  const [tapTrails, setTapTrails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [clickDelay, setClickDelay] = useState(false);
  const [unclaimedPoints, setUnclaimedPoints] = useState(0); // State untuk unclaimedPoints
  const [isClickDisabled, setIsClickDisabled] = useState(false);
  const [isClaimDisabled, setIsClaimDisabled] = useState(false); // State untuk menonaktifkan tombol Claim
  const [clickCount, setClickCount] = useState(0); // Tambahkan ini di bagian atas komponen

  const playCalled = useRef(false);

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
  }, []); // Run this effect only onceggil sekali saat komponen pertama kali dimuat


  useEffect(() => {
    if (dataPlay) {
      const { elapsedTimeInSeconds } = dataPlay;
      // Sinkronkan timer dengan dataPlay yang diterima
      setTimer(Math.floor(3600 - elapsedTimeInSeconds));
  
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev > 0) {
            return Math.floor(prev - 1); // Pastikan timer tetap integer
          }
          return 0;
        });
      }, 1000);
  
      // Pastikan membersihkan interval ketika komponen di-unmount atau dataPlay berubah
      return () => clearInterval(interval); 
    }
  }, [dataPlay]); // Interval hanya akan dijalankan ketika dataPlay berubah
  
  

  useEffect(() => {
    if (dataPlay) {
      setCanClaim(true);
      setUnclaimedPoints(dataPlay?.unclaimedPoints || 0);
  
      // Mengatur interval untuk menambah unclaimedPoints setiap detik
      const interval = setInterval(() => {
        if (dataPlay?.elapsedTimeInSeconds < 3600) {
          setUnclaimedPoints((prev) => prev + dataPlay?.perSecondEarn);
        }
      }, 1000);
  
      // Menghentikan interval jika elapsedTimeInSeconds mencapai 3600
      if (dataPlay?.elapsedTimeInSeconds >= 3600) {
        clearInterval(interval);
      }
  
      // Membersihkan interval saat komponen di-unmount atau dataPlay berubah
      return () => clearInterval(interval);
    }
  }, [dataPlay]);
  
  
  
  
  
  const handleClaim = async () => {
    try {
      setIsLoading(true);
      setCanClaim(false);  // Nonaktifkan tombol segera
  
      // Pastikan unclaimedPoints tidak negatif
      if (unclaimedPoints <= 0) {
        console.warn('No points to claim.');
        setIsLoading(false);
        setCanClaim(true); // Aktifkan kembali tombol jika tidak ada poin
        return;
      }
  
      const claimResponse = await claimPoint();  // Memanggil API claim
      console.log('Claim Response:', claimResponse);  // Logging hasil respons dari claimPoint
  
      await getMe();  // Memperbarui data pengguna tanpa penundaan
  
      const { elapsedTimeInSeconds } = await play();  // Memperbarui dataPlay dan mengambil elapsed time dari API play
      console.log('Play Response Elapsed Time:', elapsedTimeInSeconds);
  
      // Reset timer ke 1 jam (3600 detik) dan sinkronkan dengan elapsed time dari API
      setTimer(3600 - elapsedTimeInSeconds);
  
      // Reset unclaimedPoints setelah klaim
      setUnclaimedPoints(0);  // Set point ke 0 saat menunggu claim berikutnya
  
      setIsLoading(false);
  
      // Nonaktifkan tombol selama 5 detik setelah loading selesai
      setTimeout(() => {
        setCanClaim(true);
      }, 5000);
    } catch (error) {
      console.log('Error in handleClaim:', error);
      setIsLoading(false);
      setCanClaim(true);  // Pastikan tombol diaktifkan kembali jika terjadi error
    }
  };
  
  
  
  
  useEffect(() => {
    if (dataMe) {
      
      setBalanceAirdrop(dataMe.points);  // Update balanceAirdrop dari dataMe
    }
  }, [dataMe]);

  const handleClick = (event) => {
    if (isClickDisabled) return; // Periksa jika klik sedang dinonaktifkan
  
    const currentTime = Date.now();
    if (currentTime - lastClickTime < 10) return;
    setLastClickTime(currentTime);
  
    if (unclaimedPoints > 0) {
      const valueToAdd = Math.min(unclaimedPoints, perSecondEarn);  // Pastikan tidak melebihi unclaimedPoints
      setBalance((prev) => prev + valueToAdd); 
      setBalanceAirdrop((prev) => prev + valueToAdd); 
      setUnclaimedPoints((prev) => Math.max(prev - valueToAdd, 0));  // Pastikan unclaimedPoints tidak negatif
      setTimer((prev) => Math.min(prev + 1, 3600));
  
      setClaimableCoins((prev) => prev + valueToAdd);
  
      const { clientX, clientY } = event;
      const id = Date.now();
      setFloatingNumbers((prev) => [
        ...prev,
        { id, value: valueToAdd.toFixed(6), x: clientX, y: clientY },
      ]);
      setTapTrails((prev) => [...prev, { id, x: clientX, y: clientY }]);
      setCoinClicked(true);
      setTimeout(() => setCoinClicked(false), 50);
  
      setTimeout(() => {
        setFloatingNumbers((prev) => prev.filter((num) => num.id !== id));
        setTapTrails((prev) => prev.filter((trail) => trail.id !== id));
      }, 2000);
  
      clearTimeout(clickDelay); 
      const newDelay = setTimeout(async () => {
        try {
          await click({ clickCount: 1 }); 
          
        } catch (error) {
          console.error("Error during click:", error);
        }
      }, 2000);
      setClickDelay(newDelay); 
    } else {
      // Nonaktifkan klik selama 3 detik jika unclaimedPoints = 0
      setIsClickDisabled(true);
      setTimeout(() => {
        setIsClickDisabled(false); // Aktifkan kembali klik setelah 3 detik
      }, 3000);
    }
  };
  
  

  const formatTime = (seconds) => {
    const secs = Math.floor(seconds); // Pastikan nilai detik adalah integer
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
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
            >
              <IoWallet />
              <p className=" text-[12px] ">walletAddress</p>
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
                <p className="text-white text-[12px] font-bold">{nftRewardBonus.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="balance  flex flex-col justify-start items-start mt-7  gap-4">
          <div className="wrap-total-balance w-full flex justify-between items-center">
            <div className="wrap-icon-coin w-full flex justify-center items-center gap-2">
              <Image src="/Coins.png" alt="Logo" loading="lazy" width={30} height={30} />
              <p className="font-bold text-[28px] text-white text-right">{balanceAirdrop.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
        <div className="wrap-coin-sec w-full flex flex-col justify-center items-center  px-14 py-5 "onClick={handleClick} >
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
  className={`w-[330px] h-[55px] rounded-xl flex justify-center items-center mt-10 ${canClaim ? 'but bg-blue-500' : 'bg-gray-500 cursor-not-allowed'}`}
  onClick={handleClaim}
  disabled={!canClaim || isLoading}
>
  <div className="timer w-[15%] h-[55px] rounded-l-xl but flex flex-col justify-center items-center">
    <IoTimer />
    <p className="text-[8px]">{formatTime(timer)}</p>
  </div>
  <div className="claim w-[85%] flex justify-center items-center font-bold">
    {isLoading ? (
      <div className="loader"></div>  // Loader jika sedang memproses claim
    ) : (
      <p>Claim {unclaimedPoints.toLocaleString('en-US', { maximumFractionDigits: 3 })}</p>  // Menampilkan unclaimedPoints
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
      <div className="py-3"></div>
    </div>
  );
};

export default Page;
