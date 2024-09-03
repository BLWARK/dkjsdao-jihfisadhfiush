"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useBackend } from "@/context/BackContext";
import Link from "next/link";
import { Player } from "@lottiefiles/react-lottie-player"; // Mengimpor Lottie Player

const Nft = () => {
  const { getMeNFT } = useBackend(); // Menggunakan API getMeNFT dari BackContext
  const [nfts, setNfts] = useState([]); // State untuk menyimpan data NFT
  const [countR, setCountR] = useState(0); // State untuk jumlah Rare NFT
  const [countSR, setCountSR] = useState(0); // State untuk jumlah Super Rare NFT
  const [totalReward, setTotalReward] = useState(0); // State untuk total NFT Reward yang dikalkulasi
  const locale = "en-US";
  const hasFetched = useRef(false); // Ref untuk memastikan API hanya dipanggil sekali
  const [isLoading, setIsLoading] = useState(true); // State tambahan untuk loading

  // Memanggil API getMeNFT dan menyimpan serta menghitung data
  useEffect(() => {
    const fetchNFTData = async () => {
      if (hasFetched.current || !isLoading) return; // Cek apakah API sudah pernah dipanggil

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay 2 detik
        const nftData = await getMeNFT(); // Panggil API getMeNFT

        console.log("NFT Data:", nftData); // Logging data NFT

        if (nftData && nftData.length > 0 ) {
          setNfts(nftData); // Simpan data NFT ke state

          // Menghitung jumlah Rare dan Super Rare NFT serta total reward
          const rareCount = nftData.filter((nft) => nft.rarity === "R").length;
          const superRareCount = nftData.filter((nft) => nft.rarity === "SR").length;
          const totalRewardCalc = nftData.reduce((acc, nft) => acc + (nft.reward || 0), 0);

          setCountR(rareCount);
          setCountSR(superRareCount);
          setTotalReward(totalRewardCalc); // Simpan total reward
          setIsLoading(false); // Set loading selesai
        }
        setIsLoading(false); 
        hasFetched.current = true; // Tandai bahwa API sudah dipanggil
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loading selesai jika terjadi error
      }
    };

    fetchNFTData();
  }, [isLoading]); // Menambahkan isLoading sebagai dependency untuk memastikan fetch hanya terjadi sekali

  if (isLoading) {
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
    <div className="relative">
      <div className="farm-sec bgs w-full px-3 flex flex-col justify-start items-center h-screen overflow-y-scroll">
        <div className="farm-wrap w-full px-4 flex flex-col justify-center items-center mt-5 relative">
          <div className="title flex flex-col w-full justify-start items-start mt-3">
            <p className="font-bold text-[24px]">Your NFTs</p>
            <p className="font-regular text-gray-400 text-[14px]">
              Buy your heroes for extra bonus rewards and rapid level growth.
            </p>
            
          </div>

          {/* NFTs Display */}
          <div className="farm-card w-full flex flex-col justify-center items-center mt-5">
            <div className="scroll-container w-full flex overflow-x-auto gap-4 py-4 snap-x snap-mandatory">
              {nfts.length > 0 ? (
                nfts.map((nft, index) => (
                  <div
                    key={index}
                    className="scroll-item w-full h-80 bgs rounded-3xl flex flex-col justify-center items-center text-white text-2xl p-4"
                  >
                    <Image
                      src={
                        nft.image.startsWith("http")
                          ? nft.image
                          : `https://api.xyznt.io/${nft.image}`
                      }
                      alt={nft.name}
                      width={200}
                      height={200}
                      className="rounded-3xl"
                    />

                    <p className="mt-6 text-center text-sm font-bold">
                      {nft.name}
                    </p>
                  </div>
                ))
              ) : (
                <div className="scroll-item w-full h-80 bgs rounded-3xl flex flex-col justify-center items-center text-white text-2xl p-4">
                  <Link href="https://xyznt.io/marketplace" target="_blank">
                    <div className="flex flex-col justify-center items-center w-full h-full cursor-pointer">
                      <div className="text-6xl text-green-500">+</div>
                      <p className="mt-6 text-center text-xs text-light text-gray-400">
                        You don't have an NFT yet.
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NFT List */}
        <div className="flex justify-start items-start w-full px-5 mt-3">
          <p className="text-left flex justify-start items-start text-[10px] font-bold text-white">
            Your NFTs list
          </p>
        </div>
        <div className="NFT-list w-[360px] h-[80px] flex flex-col justify-between items-center bgs mt-3 rounded-xl p-4 ">
          <div className="flex justify-between w-full">
            <p className="font-regular text-[8px]">NFTs List</p>
            <p className="font-regular text-[8px]">Total NFT Rewards</p>
          </div>
          <div className="flex justify-between w-full">
            <div className="nft-list-wrap flex flex-col justify-start items-start ">
              <ul className="list-none font-regular text-[8px] list-inside justify-center items-start flex flex-col">
                <li className="text-[10px] font-bold">Rare: {countR}</li>
                <li className="text-[10px] font-bold">Super Rare: {countSR}</li>
              </ul>
            </div>
            <div className="nft-reward-bonus flex flex-col justify-center items-center ">
              <ul className="text-[12px] font-extrabold text-right text-green-500">
                {totalReward.toLocaleString(locale)}
              </ul>
            </div>
          </div>
        </div>

        {/* Buy Button */}
        <div className="wrap-buy-button my-5">
          <Link href="https://xyznt.io/marketplace" target="_blank">
            <button className="but px-[143px] py-4 rounded-xl">Buy NFT</button>
          </Link>
        </div>

        <div className="py-16"></div>
      </div>
    </div>
  );
};

export default Nft;
