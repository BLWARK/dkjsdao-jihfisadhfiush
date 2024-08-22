"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useGlobalState } from '@/context/GlobalStateContext'; 
import { dataNFT } from '@/lib/data';
import Link from 'next/link';

const Nft = () => {
  const { userNFTs, getNftCountAndRarity, nftRewardBonus } = useGlobalState(); 
  const [overlayVisible, setOverlayVisible] = useState(true); // Overlay state
  const locale = 'en-US';

  const ownedNFTs = userNFTs.map(userNft => {
    const nftCategory = dataNFT.find(category => category.nfts.some(nft => nft.id === userNft.id));
    return nftCategory ? nftCategory.nfts.find(nft => nft.id === userNft.id) : null;
  }).filter(nft => nft !== null);

  const { countR, countSR } = getNftCountAndRarity();

  return (
    <div className="relative">
      {/* Overlay that covers the page except for the top 80px */}
      {overlayVisible && (
        <div className="fixed bottom-[80px] left-0 right-0 bg-black bg-opacity-70 z-10" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="text-center flex flex-col justify-center items-center h-full">
            <p className="text-white text-3xl mb-4 font-bold">Coming Soon</p>
          </div>
        </div>
      )}

      <div className="farm-sec bgs w-full flex flex-col justify-start items-center h-[2000px] overflow-y-scroll">
        <div className="farm-wrap w-full px-4 flex flex-col justify-center items-center mt-5 relative">
          <div className="title flex flex-col w-full justify-start items-start mt-3">
            <p className="font-bold text-[30px]">Your NFTs</p>
            <p className="font-regular text-gray-400 text-[14px]">
              Buy your heroes for extra bonus rewards and rapid level growth.
            </p>
            <p className="font-regular italic text-red-500 text-[10px]">
              (You are permitted to own a maximum of 5 NFTs. Any additional NFTs beyond the sixth will not be counted towards bonus rewards.)
            </p>
          </div>

          {/* NFTs Display */}
          <div className="farm-card w-full flex flex-col justify-center items-center mt-5">
            <div className="scroll-container w-full flex overflow-x-auto gap-4 py-4 snap-x snap-mandatory">
              {ownedNFTs.length > 0 ? (
                ownedNFTs.map((nft, index) => (
                  <div key={index} className="scroll-item w-full h-80 bgs rounded-3xl flex flex-col justify-center items-center text-white text-2xl p-4">
                    <Image src={nft.image} alt={nft.name} width={200} height={200} className="rounded-3xl" />
                    <p className="mt-6 text-center text-sm font-bold">{nft.name}</p>
                  </div>
                ))
              ) : (
                <div className="scroll-item w-full h-80 bgs rounded-3xl flex flex-col justify-center items-center text-white text-2xl p-4">
                  <Link href="https://xyznt.io/marketplace" target="_blank">
                    <div className="flex flex-col justify-center items-center w-full h-full cursor-pointer">
                      <div className="text-6xl text-green-500">+</div>
                      <p className="mt-6 text-center text-xs text-light text-gray-400">You don't have an NFT yet.</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NFT List */}
        <div className="flex justify-start items-start w-full px-5 mt-3">
          <p className="text-left flex justify-start items-start text-[10px] font-bold text-white">Your NFTs list</p>
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
                {nftRewardBonus.toLocaleString(locale)}
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

        <div className="py-24"></div>
      </div>
    </div>
  );
};

export default Nft;
