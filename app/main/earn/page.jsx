"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Player } from "@lottiefiles/react-lottie-player"; // Lottie Player
import { IoWallet, IoTimer } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight, MdClose } from "react-icons/md";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useBackend } from "@/context/BackContext";
import CoinImage from "@/public/Coins1.png";

const Earn = () => {
  const {
    setBalance, // Function to update balance
    balanceAirdrop, // Global state for balance airdrop
    setBalanceAirdrop, // Function to update balance airdrop
    timer, // Global state for timer
    setTimer, // Function to update timer
    canClaim, // Global state to determine if the user can claim points
    setCanClaim, // Function to set whether the user can claim points
    setClaimableCoins, // Function to set claimable coins (points)
    perSecondEarn, // Global state for earning rate per second
    nftRewardBonus, // Global state for NFT reward bonus
  } = useGlobalState();

  const {
    dataMe, // Data retrieved from backend (e.g. user data)
    getMe, // Function to fetch user data
    dataPlay, // Data for game play session from backend
    play, // Function to initiate or continue a game session
    claimPoint, // Function to claim points
    click, // Function to handle click interactions with backend
    connectWallet,
    getMeNFT,
  } = useBackend();

  const [floatingNumbers, setFloatingNumbers] = useState([]); // Local state to manage floating numbers for visual feedback
  const [coinClicked, setCoinClicked] = useState(false); // State to trigger coin-click animation
  const [tapTrails, setTapTrails] = useState([]); // State to track tap trails for visual effects
  const [isLoading, setIsLoading] = useState(false); // Loading state for when a claim is being processed
  const [lastClickTime, setLastClickTime] = useState(0); // Track the last time a click was registered
  const [clickDelay, setClickDelay] = useState(false); // State for delaying click actions
  const [unclaimedPoints, setUnclaimedPoints] = useState(0); // State for unclaimed points
  const [isClickDisabled, setIsClickDisabled] = useState(false); // State to disable clicks during certain conditions
  const [coinAdded, setCoinAdded] = useState(false); // State to trigger animation when coins/points are added
  const [isInitialLoading, setIsInitialLoading] = useState(true); // State for initial loading
  const [isClaimLoading, setIsClaimLoading] = useState(false); // State for claim loading
  const [clickCount, setClickCount] = useState(0); // State to track click count
  const [showPopup, setShowPopup] = useState(false); // State for controlling popup
  const [showConnectWalletPopup, setShowConnectWalletPopup] = useState(false);
  const [walletAddress, setWalletAddress] = useState();
  const [totalNftReward, setTotalNftReward] = useState(0); // State untuk total NFT reward
  const locale = "en-US";

  const playCalled = useRef(false); // Ref to ensure play is only called once

  useEffect(() => {
    const popupShown = localStorage.getItem("popupShown");
    if (!popupShown) {
      setShowPopup(true); // Show popup if it hasn't been shown before
      localStorage.setItem("popupShown", "true"); // Set it so it won't show again
    }
  }, []);

  // Tambahkan state untuk memeriksa apakah data sedang di-load
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
        }

        // Hanya set loading ke false jika userData dan playData sudah ada
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
      setWalletAddress(dataMe.walletAddress); // Set wallet address dari dataMe
    }
  }, [dataMe]);

  useEffect(() => {
    const fetchNftRewards = async () => {
      try {
        const nftData = await getMeNFT(); // Panggil API getMeNFT

        if (nftData) {
          const totalRewardCalc = nftData.reduce(
            (acc, nft) => acc + (nft.reward || 0),
            0
          );
          setTotalNftReward(totalRewardCalc); // Simpan total reward ke state
        }
      } catch (error) {
        console.error("Error fetching NFT data:", error);
      }
    };

    fetchNftRewards(); // Panggil fungsi untuk mengambil dan menghitung reward NFT
  }, []);

  useEffect(() => {
    // Effect to update timer and manage countdown for game session
    if (dataPlay) {
      const { elapsedTimeInSeconds } = dataPlay;
      setTimer(Math.floor(3600 - elapsedTimeInSeconds)); // Sync timer with backend data

      const interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? Math.floor(prev - 1) : 0)); // Decrease the timer every second
      }, 1000);

      return () => clearInterval(interval); // Clean up interval when component unmounts or dataPlay changes
    }
  }, [dataPlay]); // Re-run effect whenever dataPlay changes

  useEffect(() => {
    // Effect to increase unclaimed points every second during the game session
    if (dataPlay) {
      setCanClaim(true); // Allow user to claim points
      setUnclaimedPoints(dataPlay?.unclaimedPoints || 0); // Set unclaimed points from backend

      const interval = setInterval(() => {
        if (dataPlay?.elapsedTimeInSeconds < 3600) {
          setUnclaimedPoints((prev) => prev + dataPlay?.perSecondEarn); // Increment unclaimed points every second
        }
      }, 1000);

      if (dataPlay?.elapsedTimeInSeconds >= 3600) {
        clearInterval(interval); // Stop interval when maximum elapsed time is reached
      }

      return () => clearInterval(interval); // Clean up interval when component unmounts or dataPlay changes
    }
  }, [dataPlay]); // Re-run effect whenever dataPlay changes

  const handleClaim = async () => {
    try {
      setIsClaimLoading(true); // Set animasi loading klaim
      setCanClaim(false); // Disable tombol klaim

      if (unclaimedPoints <= 0) {
        console.warn("No points to claim.");
        setIsClaimLoading(false); // Hentikan animasi loading klaim
        setCanClaim(true); // Aktifkan kembali tombol klaim
        return;
      }

      const claimResponse = await claimPoint(); // Lakukan klaim
      console.log("Claim Response:", claimResponse);

      // Lanjutkan tanpa mengubah status loading klaim
      const updateUserData = async () => {
        await getMe(); // Refresh data user

        // Dapatkan respons dari play dan cek jika data valid
        const playResponse = await play(); // Lanjutkan atau mulai sesi baru

        // Pastikan playResponse valid sebelum destruktur
        if (playResponse && playResponse.elapsedTimeInSeconds !== undefined) {
          const { elapsedTimeInSeconds } = playResponse;
          setTimer(3600 - elapsedTimeInSeconds); // Reset timer
          setUnclaimedPoints(0); // Reset poin yang belum diklaim
        } else {
          console.error("Invalid play response", playResponse); // Tambahkan log jika respons tidak valid
        }
      };

      updateUserData(); // Memanggil API `play` dan `getMe` tanpa mengubah state loading klaim

      setIsClaimLoading(false); // Hentikan animasi loading klaim setelah klaim selesai
      setTimeout(() => setCanClaim(true), 5000); // Aktifkan kembali tombol klaim setelah 5 detik
    } catch (error) {
      console.error("Error in handleClaim:", error);
      setIsClaimLoading(false); // Hentikan animasi loading klaim jika terjadi error
      setCanClaim(true); // Aktifkan kembali tombol klaim
    }
  };

  useEffect(() => {
    if (dataMe) {
      setBalanceAirdrop(dataMe.points); // Update balance with points from backend
    }
  }, [dataMe]); // Re-run effect when dataMe changes

  const handleClick = (event) => {
    if (isClickDisabled) return; // Prevent clicks if clicking is disabled

    const currentTime = Date.now(); // Get current time
    if (currentTime - lastClickTime < 10) return; // Prevent multiple clicks within a very short time
    setLastClickTime(currentTime); // Update the last click time

    setClickCount((prevCount) => prevCount + 1); // Increment click count locally

    if (unclaimedPoints > 0) {
      const valueToAdd = perSecondEarn; // Remove the division by 1000

      setBalance((prev) => prev + valueToAdd); // Update balance
      setBalanceAirdrop((prev) => prev + valueToAdd); // Update balance airdrop
      setUnclaimedPoints((prev) => Math.max(prev - valueToAdd, 0)); // Decrease unclaimed points
      setTimer((prev) => Math.min(prev + 1, 3600)); // Increment timer, but not beyond 3600 seconds
      setClaimableCoins((prev) => prev + valueToAdd); // Update claimable points

      setCoinAdded(true); // Trigger coin addition animation

      const { clientX, clientY } = event; // Get the click position
      const id = Date.now(); // Generate a unique ID based on the current time
      setFloatingNumbers((prev) => [
        ...prev,
        { id, value: valueToAdd.toFixed(6), x: clientX, y: clientY }, // Add floating number for visual feedback
      ]);
      setTapTrails((prev) => [...prev, { id, x: clientX, y: clientY }]); // Add tap trail for visual feedback
      setCoinClicked(true); // Trigger coin click animation
      setTimeout(() => setCoinClicked(false), 50); // Reset coin click animation after a short time

      setTimeout(() => {
        setFloatingNumbers((prev) => prev.filter((num) => num.id !== id)); // Remove floating number after 2 seconds
        setTapTrails((prev) => prev.filter((trail) => trail.id !== id)); // Remove tap trail after 2 seconds
      }, 2000);

      clearTimeout(clickDelay); // Clear the previous click delay timeout
      const newDelay = setTimeout(async () => {
        try {
          await click({ clickCount }); // Send the total click count to backend
          setClickCount(0); // Reset the click count after sending to backend
        } catch (error) {
          console.error("Error during click:", error); // Log any click-related errors
        }
      }, 2000); // Send clicks to backend after 2 seconds of inactivity
      setClickDelay(newDelay); // Set new click delay timeout

      setTimeout(() => setCoinAdded(false), 300); // Reset coin addition animation after 0.3 seconds
    } else {
      setIsClickDisabled(true); // Disable further clicks for 3 seconds
      setTimeout(() => setIsClickDisabled(false), 3000); // Re-enable clicking after 3 seconds
    }
  };

  const formatTime = (seconds) => {
    // Function to format time (seconds) into HH:MM:SS
    const secs = Math.floor(seconds); // Ensure seconds is an integer
    const hrs = Math.floor(secs / 3600); // Calculate hours
    const mins = Math.floor((secs % 3600) / 60); // Calculate minutes
    const remainingSecs = secs % 60; // Calculate remaining seconds
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`; // Return formatted time string
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup when the close button is clicked
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
        // Panggil fungsi connectWallet dari BackContext
        const response = await connectWallet(walletAddress);

        if (response && response.length > 0) {
          // Jika respons berhasil dan data ada, simpan alamat wallet di state
          setWalletAddress(walletAddress);
          setShowConnectWalletPopup(false); // Tutup popup setelah wallet berhasil terhubung
          console.log("Wallet connected successfully:", response);
          // Anda bisa menambahkan logika tambahan di sini jika diperlukan
        } else {
          console.error("Failed to connect wallet. No data returned.");
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  };

  const formatWalletAddress = (address) => {
    if (address.length > 9) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
  };

  // Jika masih loading, tampilkan animasi Lottie
  if (isInitialLoading) {
    return (
      <div className="loading-screen flex justify-center items-center h-screen">
        <Player
          autoplay
          loop
          src="https://lottie.host/16594a2c-c2ad-4196-98e2-51ab691a2e8d/ycygvL2itD.json" // Link animasi Lottie
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
              {/* Render user's username */}
              <p className="text-[12px] font-bold">
                Hi, {dataMe ? dataMe?.firstName : "loading"}
              </p>
              {/* Link to user's level */}
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
          {/* Render profit per hour */}
          <div className="balance bgs flex flex-col justify-start items-start px-4 py-3 rounded-xl gap-2">
            <p className="font-light text-[10px] text-gray-400">
              Profit per hour
            </p>
            <div className="wrap-level w-full flex justify-between items-center">
              <div className="wrap-icon-coin w-full flex justify-start items-start gap-2">
                <p className="text-white text-[12px] font-bold">
                  {dataPlay?.perHourEarn}
                </p>
              </div>
            </div>
          </div>
          {/* Render NFT reward bonus */}
          <div className="nft-reward-bonus bgs flex flex-col justify-start items-start px-4 py-3 rounded-xl gap-2">
            <p className="font-light text-[10px] text-gray-400">
              NFT Reward Bonus
            </p>
            <div className="wrap-level w-full flex justify-between items-center">
              <div className="wrap-icon-oin w-full flex justify-start items-start gap-2">
                <p className="text-white text-[12px] font-bold">
                  {dataUser?.nftRewardBonus}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Render total balance */}
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
        {/* Render coin tap section */}
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
        {/* Render claim button */}
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

        {/* Render banner image */}
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
      <div className="py-3"></div>
    </div>
  );
};

export default Earn;
