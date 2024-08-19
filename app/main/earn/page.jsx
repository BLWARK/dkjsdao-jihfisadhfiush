"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { IoWallet, IoTimer } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
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

  const playCalled = useRef(false); // Ref to ensure play is only called once

  useEffect(() => {
    // Function to initialize data by fetching user and play session data
    const initializeData = async () => {
      await getMe(); // Fetch user data from backend
      if (dataMe) {
        setBalanceAirdrop(dataMe.points); // Update balance with user points from backend
      }

      await play(); // Start or continue the game session
      if (dataPlay) {
        setClaimableCoins(dataPlay.unclaimedPoints); // Update claimable points
        setTimer(3600 - dataPlay.elapsedTimeInSeconds); // Set timer based on elapsed time in seconds from backend
      }
    };

    if (!playCalled.current) {
      initializeData(); // Call the function to initialize data
      playCalled.current = true; // Set the ref to prevent multiple calls
    }
  }, [dataPlay]); // Run this effect only once

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
      setIsLoading(true); // Set loading state to true
      setCanClaim(false); // Disable claim button immediately

      if (unclaimedPoints <= 0) {
        console.warn("No points to claim."); // Log warning if no points are available for claim
        setIsLoading(false); // Reset loading state
        setCanClaim(true); // Re-enable claim button
        return;
      }

      const claimResponse = await claimPoint(); // Call backend to claim points
      console.log("Claim Response:", claimResponse); // Log the claim response

      await getMe(); // Refresh user data after claim

      const { elapsedTimeInSeconds } = await play(); // Restart or continue the game session
      console.log("Play Response Elapsed Time:", elapsedTimeInSeconds);

      setTimer(3600 - elapsedTimeInSeconds); // Reset the timer
      setUnclaimedPoints(0); // Reset unclaimed points after a claim is made

      setIsLoading(false); // Reset loading state
      setTimeout(() => setCanClaim(true), 5000); // Re-enable claim button after 5 seconds
    } catch (error) {
      console.log("Error in handleClaim:", error); // Log any errors that occur
      setIsLoading(false); // Reset loading state in case of error
      setCanClaim(true); // Ensure the claim button is re-enabled in case of error
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

    if (unclaimedPoints > 0) {
      const valueToAdd = Math.min(unclaimedPoints, perSecondEarn); // Calculate the amount to add, without exceeding unclaimed points

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
          await click({ clickCount: 1 }); // Notify backend of the click event
        } catch (error) {
          console.error("Error during click:", error); // Log any click-related errors
        }
      }, 2000);
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

  return (
    <div className="earn-sec bgs w-full flex flex-col justify-start items-center min-h-screen overflow-y-scroll relative my-5">
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
          <div className="top-user w-[50%] flex items-center justify-start gap-2">
            <button className="gap-2 px-2 flex flex-col justify-start items-start">
              {/* Render user's username */}
              <p className="text-[12px] font-bold">
                Hi, {dataMe ? dataMe?.username : "loading"}
              </p>
              {/* Link to user's level */}
              <Link
                href="/main/level"
                className="flex justify-center items-center text-blue-400"
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
            {/* Wallet button */}
            <button className="gap-2 but p-4 flex justify-center items-center rounded-xl">
              <IoWallet />
              <p className="text-[12px]">walletAddress</p>
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
          <div className="balance bgs flex flex-col justify-start items-start px-4 py-3 rounded-xl gap-2">
            <p className="font-light text-[10px] text-gray-400">
              NFT Reward Bonus
            </p>
            <div className="wrap-level w-full flex justify-between items-center">
              <div className="wrap-icon-oin w-full flex justify-start items-start gap-2">
                <p className="text-white text-[12px] font-bold">
                  {nftRewardBonus.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
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
              src={`/${dataMe?.level}.png`}
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
          disabled={!canClaim || isLoading}
        >
          <div className="timer w-[15%] h-[55px] rounded-l-xl but flex flex-col justify-center items-center">
            <IoTimer />
            <p className="text-[8px]">{formatTime(timer)}</p>
          </div>
          <div className="claim w-[85%] flex justify-center items-center font-bold">
            {isLoading ? (
              <div className="loader"></div> // Loader for processing claim
            ) : (
              <p>
                Claim{" "}
                {unclaimedPoints.toLocaleString("en-US", {
                  maximumFractionDigits: 3,
                })}
              </p> // Show unclaimed points
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
      <div className="py-3"></div>
    </div>
  );
};

export default Earn;
