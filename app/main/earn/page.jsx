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
    canClaim,
    setCanClaim,
    claimableCoins,
    setClaimableCoins,
    timer,
    setTimer,
    levelImage,
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
  const [isClaimDisabled, setIsClaimDisabled] = useState(false); // State untuk menonaktifkan tombol Claim
  const playCalled = useRef(false);

  useEffect(() => {
    getMe();
    
    if (!playCalled.current) {
      play(); // Memanggil API play hanya sekali
      playCalled.current = true; // Menandai bahwa API play sudah dipanggil
    }
  }, []); // Efek ini hanya dipanggil sekali saat komponen pertama kali dimuat
  


  
  useEffect(() => {
    if (dataPlay) {
      setUnclaimedPoints(dataPlay?.unclaimedPoints || 0);
  
      // Mengatur interval untuk menambah unclaimedPoints setiap detik
      const interval = setInterval(() => {
        setUnclaimedPoints((prev) => prev + dataPlay?.perSecondEarn);
      }, 1000);
  
      // Menghentikan interval setelah satu jam (3600 detik)
      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 3600000); // 1 jam = 3600000 ms
  
      // Membersihkan interval dan timeout saat komponen di-unmount
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [dataPlay]);
  
  
  const handleClaim = async () => {
    try {
      setIsLoading(true);
  
      await claimPoint();  // Memanggil API claim
      await getMe();       // Memperbarui data pengguna tanpa penundaan
  
      // Menunggu 3 detik sebelum menghilangkan isLoading, tetapi tetap menonaktifkan tombol selama 10 detik
      setTimeout(() => {
        setIsLoading(false); // Loader berhenti setelah 3 detik
        setUnclaimedPoints(0); // Set point ke 0 saat menunggu 10 detik
      }, 3000); // 3 detik
  
      // Menunggu 10 detik sebelum memperbarui tampilan angka pada tombol
      setTimeout(async () => {
        await play();      // Memperbarui dataPlay setelah jeda waktu 10 detik
  
        // Reset tombol Claim ke nilai baru dari dataPlay setelah API play dijalankan
        setUnclaimedPoints(dataPlay?.unclaimedPoints || 0);
        setCanClaim(true);  // Mengaktifkan kembali tombol claim
      }, 15000); // 10 detik = 10000ms
  
      setCanClaim(false);  // Nonaktifkan tombol selama 10 detik
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setCanClaim(true);  // Pastikan tombol diaktifkan kembali jika terjadi error
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
      const valueToAdd = perSecondEarn;
      setBalance((prev) => prev + valueToAdd);
      setBalanceAirdrop((prev) => prev + valueToAdd);
      setTimer((prev) => prev + 1); // Tambahkan 1 detik ke timer setiap kali gambar diklik
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
