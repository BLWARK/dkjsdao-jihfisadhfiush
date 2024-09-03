"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Player } from "@lottiefiles/react-lottie-player"; // Lottie Player
import { IoWallet, IoTimer } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight, MdClose } from "react-icons/md";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useBackend } from "@/context/BackContext";
import { TiWarning } from "react-icons/ti";
import CoinImage from "@/public/Coins1.png";

const Earn = () => {
  const {
    setBalance, 
    balanceAirdrop,
    setBalanceAirdrop,
    timer,
    setTimer,
    canClaim,
    setCanClaim,
    setClaimableCoins,
    nftRewardBonus,
  } = useGlobalState();

  const {
    dataMe, 
    getMe, 
    dataPlay, 
    play, 
    claimPoint, 
    click, 
    connectWallet,
    getMeNFT,
  } = useBackend();

  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const [coinClicked, setCoinClicked] = useState(false);
  const [tapTrails, setTapTrails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [clickDelay, setClickDelay] = useState(false);
  const [unclaimedPoints, setUnclaimedPoints] = useState(0);
  const [isClickDisabled, setIsClickDisabled] = useState(false);
  const [coinAdded, setCoinAdded] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showConnectWalletPopup, setShowConnectWalletPopup] = useState(false);
  const [walletAddress, setWalletAddress] = useState();
  const [walletStatus, setWalletStatus] = useState(null);
  
  const locale = "en-US";

  const playCalled = useRef(false);

  useEffect(() => {
    const popupShown = localStorage.getItem("popupShown");
    if (!popupShown) {
      setShowPopup(true);
      localStorage.setItem("popupShown", "true");
    }
  }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);

        const userData = await getMe();
        const playData = await play();

        if (userData) {
          setBalanceAirdrop(userData.points);
        }

        if (playData) {
          setClaimableCoins(playData.unclaimedPoints);
          setTimer(3600 - playData.elapsedTimeInSeconds);
          // perSecondEarn langsung digunakan dari playData tanpa disimpan dalam state global
        }

        setIsInitialLoading(false);
      } catch (error) {
        console.error("Error initializing data:", error);
        setIsInitialLoading(false);
      }
    };

    if (!playCalled.current) {
      initializeData();
      playCalled.current = true;
    }
  }, []);

  useEffect(() => {
    if (dataMe && dataMe.walletAddress) {
      setWalletAddress(dataMe.walletAddress);
    }
  }, [dataMe]);

  useEffect(() => {
    if (dataPlay) {
      const { elapsedTimeInSeconds } = dataPlay;
      setTimer(Math.floor(3600 - elapsedTimeInSeconds)); 

      const interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? Math.floor(prev - 1) : 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dataPlay]);

  useEffect(() => {
    if (dataPlay) {
      setCanClaim(true);
      setUnclaimedPoints(dataPlay?.unclaimedPoints || 0);

      const interval = setInterval(() => {
        if (dataPlay?.elapsedTimeInSeconds < 3600) {
          setUnclaimedPoints((prev) => prev + dataPlay?.perSecondEarn); 
        }
      }, 1000);

      if (dataPlay?.elapsedTimeInSeconds >= 3600) {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }
  }, [dataPlay]);

  const handleClaim = async () => {
    try {
      setIsClaimLoading(true);
      setCanClaim(false);

      if (unclaimedPoints <= 0) {
        console.warn("No points to claim.");
        setIsClaimLoading(false);
        setCanClaim(true);
        return;
      }

      const claimResponse = await claimPoint();
      console.log("Claim Response:", claimResponse);

      const updateUserData = async () => {
        await getMe(); 

        const playResponse = await play();

        if (playResponse && playResponse.elapsedTimeInSeconds !== undefined) {
          const { elapsedTimeInSeconds } = playResponse;
          setTimer(3600 - elapsedTimeInSeconds); 
          setUnclaimedPoints(0);
        } else {
          console.error("Invalid play response", playResponse);
        }
      };

      updateUserData(); 

      setIsClaimLoading(false);
      setTimeout(() => setCanClaim(true), 5000);
    } catch (error) {
      console.error("Error in handleClaim:", error);
      setIsClaimLoading(false);
      setCanClaim(true);
    }
  };

  useEffect(() => {
    if (dataMe) {
      setBalanceAirdrop(dataMe.points);
    }
  }, [dataMe]);

  const handleClick = (event) => {
    if (isClickDisabled) return;

    const currentTime = Date.now();
    if (currentTime - lastClickTime < 10) return;
    setLastClickTime(currentTime);

    setClickCount((prevCount) => prevCount + 1);

    if (unclaimedPoints > 0) {
      const valueToAdd = dataPlay?.perSecondEarn; // Langsung ambil dari dataPlay

      setBalance((prev) => prev + valueToAdd);
      setBalanceAirdrop((prev) => prev + valueToAdd);
      setUnclaimedPoints((prev) => Math.max(prev - valueToAdd, 0));
      setTimer((prev) => Math.min(prev + 1, 3600));
      setClaimableCoins((prev) => prev + valueToAdd);

      setCoinAdded(true);

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
          await click({ clickCount });
          setClickCount(0);
        } catch (error) {
          console.error("Error during click:", error);
        }
      }, 2000);
      setClickDelay(newDelay);

      setTimeout(() => setCoinAdded(false), 300);
    } else {
      setIsClickDisabled(true);
      setTimeout(() => setIsClickDisabled(false), 3000);
    }
  };

  const formatTime = (seconds) => {
    const secs = Math.floor(seconds);
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = secs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleConnectWalletClick = () => {
    if (!walletAddress) {
      setShowConnectWalletPopup(true);
    }
  };

  const handleCloseConnectWalletPopup = () => {
    setShowConnectWalletPopup(false);
    setWalletAddress("");
  };

  const handleWalletAddressChange = (event) => {
    setWalletAddress(event.target.value);
  };

  const handleConnectWallet = async () => {
    if (walletAddress) {
      try {
        const response = await connectWallet(walletAddress);

        if (response && response.length > 0) {
          setWalletStatus('success');
          setWalletAddress(walletAddress);
          setShowConnectWalletPopup(false);
        } else {
          setWalletStatus('error');
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setWalletStatus('error');
      }
    }
  };

  const handleCloseWalletStatusPopup = () => {
    setWalletStatus(null);
  };

  const formatWalletAddress = (address) => {
    if (address.length > 9) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
  };

  if (isInitialLoading) {
    return (
      <div className="loading-screen flex justify-center items-center h-screen">
        <Player
          autoplay
          loop
          src="https://lottie.host/16594a2c-c2ad-4196-98e2-51ab691a2e8d/ycygvL2itD.json"
          style={{ height: "150px", width: "150px" }}
        />
      </div>
    );
  }

  return (
    <div className="earn-sec bgs w-full flex flex-col justify-start items-center min-h-screen overflow-y-scroll relative my-5">
      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center px-3">
          <div className="relative  rounded-lg shadow-lg p-1 w-screen justify-center items-center flex flex-col gap-4">
            <button
              className="absolute top-2 right-2 text-white hover:text-gray-700"
              onClick={handleClosePopup}
            >
              <MdClose size={24} />
            </button>
            <Image
              src="/NewFeature.jpg"
              alt="New Feature"
              width={400}
              height={400}
              className="rounded-md"
            />
            <Link
              href="/main/claim"
              className="text-center text-white font-bold px-4 w-full py-5  but rounded-xl mb-3 "
            >
              Check out our New Feature!
            </Link>
          </div>
        </div>
      )}

      {/* Render floating numbers for point addition visual feedback */}
      {floatingNumbers.map((num) => (
        <div
          key={num.id}
          className="floating-number"
          style={{ left: num.x, top: num.y }}
        >
          <Image src={CoinImage} alt="Floating Coin" width={40} height={40} />
        </div>
      ))}
      {/* Render tap trails for visual feedback */}
      {tapTrails.map((trail) => (
        <div
          key={trail.id}
          className="tap-trail"
          style={{ left: trail.x, top: trail.y }}
        ></div>
      ))}
      <div className="wrap-farm w-full px-4 flex flex-col justify-center items-center">
        <div className="top-sec w-full flex justify-between items-center">
          <div className="top-user w-[60%] flex items-center justify-start gap-2">
            <button className="gap-2 px-2 flex flex-col justify-start items-start">
              <p className="text-[12px] font-bold">
                Hi, {dataMe ? dataMe?.firstName : "loading"}
              </p>
              <Link
                href="/main/level"
                className="flex justify-start items-center text-blue-400"
              >
                <p className="text-[12px] font-bold">
                  <span className="text-[12px] font-light text-gray-400">
                    Level:{" "}
                  </span>
                  {dataPlay?.levelName}
                </p>
                <MdOutlineKeyboardArrowRight />
              </Link>
            </button>
          </div>
          <div className="top-user w-[50%] flex items-center justify-end gap-2">
            <button
              className={`gap-2 but p-4 flex justify-center items-center rounded-xl ${
                walletAddress ? "Disable" : ""
              }`}
              onClick={handleConnectWalletClick}
              disabled={!!walletAddress}
            >
              <IoWallet />
              <p className=" text-[12px] ">
                {walletAddress
                  ? formatWalletAddress(walletAddress)
                  : "Connect Wallet"}
              </p>
            </button>
          </div>
        </div>

        <div className="level-sec w-full grid grid-cols-2 justify-between items-center mt-4 gap-4">
          <div className="balance bgs flex flex-col justify-start items-start px-4 py-3 rounded-xl gap-2">
            <p className="font-light text-[10px] text-gray-400">
              Profit per hour
            </p>
            <div className="wrap-level w-full flex justify-between items-center">
              <div className="wrap-icon-coin w-full flex justify-start items-start gap-2">
                <p className="text-white text-[12px] font-bold">
                  {dataPlay?.perHourEarn.toLocaleString(locale)}
                </p>
              </div>
            </div>
          </div>
          <div className="nft-reward-bonus bgs flex flex-col justify-start items-start px-4 py-3 rounded-xl gap-2">
            <p className="font-light text-[10px] text-gray-400">
              NFT Reward Bonus
            </p>
            <div className="wrap-level w-full flex justify-between items-center">
              <div className="wrap-icon-oin w-full flex justify-start items-start gap-2">
                <p className="text-white text-[12px] font-bold">
                  {dataMe?.nftRewardBonus.toLocaleString(locale)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="balance flex flex-col justify-start items-start mt-7 gap-4">
          <div className="wrap-total-balance w-full flex justify-between items-center">
            <div
              className={`wrap-icon-coin w-full flex justify-center items-center gap-2 ${
                coinAdded ? "coin-increment" : ""
              }`}
            >
              <Image
                src="/Coins.png"
                alt="Logo"
                loading="lazy"
                width={30}
                height={30}
              />
              <p className="font-bold text-[28px] text-white text-right">
                {balanceAirdrop.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
        <div
          className="wrap-coin-sec w-full flex flex-col justify-center items-center px-14 py-5"
          onClick={handleClick}
        >
          <div className="coin-sec w-full flex flex-col justify-center items-center -mt-3">
            <div className="coins1 mt-8"></div>
            <Image
              src={dataMe?.level ? `/${dataMe.level}.png` : "/1.png"}
              alt="Level Image"
              width={240}
              height={240}
              priority={true}
              className={`coin1 mt-8 ${coinClicked ? "clicked" : ""}`}
            />
          </div>
        </div>
        <button
          className={`w-[330px] h-[55px] rounded-xl flex justify-center items-center mt-10 ${
            canClaim ? "but bg-blue-500" : "bg-gray-500 cursor-not-allowed"
          }`}
          onClick={handleClaim}
          disabled={!canClaim || isClaimLoading}
        >
          <div className="timer w-[15%] h-[55px] rounded-l-xl but flex flex-col justify-center items-center">
            <IoTimer />
            <p className="text-[8px]">{formatTime(timer)}</p>
          </div>
          <div className="claim w-[85%] flex justify-center items-center font-bold">
            {isClaimLoading ? (
              <Player
                autoplay
                loop
                src="https://lottie.host/16594a2c-c2ad-4196-98e2-51ab691a2e8d/ycygvL2itD.json"
                style={{ height: "50px", width: "50px" }}
              />
            ) : (
              <p>
                Claim{" "}
                {unclaimedPoints.toLocaleString("en-US", {
                  maximumFractionDigits: 3,
                })}
              </p>
            )}
          </div>
        </button>

        <div className="wrap-coin-sec w-full flex flex-col justify-center items-center rounded-2xl mt-8 mb-28">
          <div className="img-warp w-[500] h-[200] object-contain">
            <Image
              src="/banner1.jpg"
              alt="banner"
              width={360}
              height={50}
              className="rounded-xl"
              loading="lazy"
              onClick={() => window.open("https://xyznt.io", "_blank")}
            />
          </div>
        </div>
      </div>
      {showConnectWalletPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 ">
          <div className="popup-content bgs w-[350px] h-[360px] rounded-lg shadow-lg text-center flex flex-col p-3 gap-2 relative">
            <button
              className="close-icon absolute top-4 right-4 text-white text-2xl"
              onClick={handleCloseConnectWalletPopup}
            >
              <MdClose />
            </button>
            <p className="mb-4 text-white font-bold text-lg mt-5">
              Connect Your Wallet
            </p>
            <input
              type="text"
              placeholder="Enter your wallet address"
              value={walletAddress}
              onChange={handleWalletAddressChange}
              className="bg-blue-950 w-[330px] h-[70px] p-5 rounded-lg text-[12px] mb-4"
            />
            <p className="text-xs italic text-red-500 font-extrabold">
              Please enter your wallet address (BEP20) correctly,{" "}
              <span className="text-xs italic text-white font-light">
                your reward will send in your wallet address, We will not be
                responsible if the wallet you entered is incorrect
              </span>
            </p>
            <button
              onClick={handleConnectWallet}
              className={`but p-4 rounded-lg mt-8 ${
                !walletAddress ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!walletAddress}
            >
              Connect
            </button>
          </div>
        </div>
      )}

      {walletStatus === 'success' && (
         <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
         <div className="bgs flex gap-5 flex-col w-[340px] h-[300px] rounded-lg text-center justify-center items-center">
           <div className="text-green-500 text-[120px]"><FaCheckCircle /></div>
           <h3 className=" font-bold mb-3">Wallet successfully connected!</h3>
           <button onClick={handleCloseWalletStatusPopup} className="but w-[80%] bg-blue-500 px-4 py-2 rounded-lg">Close</button>
         </div>
       </div>
      )}
      {walletStatus === 'error' && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
          <div className="bgs flex gap-5 flex-col w-[340px] h-[300px] rounded-lg text-center justify-center items-center">
            <div className="text-red-500 text-[120px]"><TiWarning /></div>
            <h3 className=" font-bold mb-3">Wallet already connected in another account!</h3>
            <button onClick={handleCloseWalletStatusPopup} className="but w-[80%] bg-blue-500 px-4 py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}
      <div className="py-3"></div>
    </div>
  );
};

export default Earn;
