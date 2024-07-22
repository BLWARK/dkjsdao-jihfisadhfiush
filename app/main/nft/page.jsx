"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image'; // Import the Image component from next/image
import { useGlobalState } from '@/context/GlobalStateContext'; // Import the global state
import { dataNFT } from '@/lib/data'; // Import dataNFT
import Link from 'next/link';

const Page = () => {
  const { userNFTs, getNftCountAndRarity, nftRewardBonus } = useGlobalState(); // Ambil data kepemilikan NFT user dan fungsi terkait dari global state
  const scrollRef = useRef(null); // Ref untuk kontainer scroll
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState(null);

  const locale = 'en-US'; // Tentukan locale yang digunakan

  // Filter data NFT yang dimiliki user
  const ownedNFTs = userNFTs.map(userNft => {
    const nftCategory = dataNFT.find(category => category.nfts.some(nft => nft.id === userNft.id));
    return nftCategory ? nftCategory.nfts.find(nft => nft.id === userNft.id) : null;
  }).filter(nft => nft !== null);

  useEffect(() => {
    if (scrollRef.current) {
      const totalItems = ownedNFTs.length > 0 ? ownedNFTs.length : 1;
      const scrollTo = scrollRef.current.offsetWidth * currentIndex;
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, ownedNFTs.length]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      setScrollTimeout(
        setTimeout(() => {
          setCurrentIndex(index);
        }, 150)
      );
    }
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const { countR, countSR } = getNftCountAndRarity();

  return (
    <div className="farm-sec bgs w-full flex flex-col justify-start items-center h-[2000px]  overflow-y-scroll ">
      <div className="farm-wrap w-full px-4 flex flex-col justify-center items-center mt-5 relative">
        <div className="title flex flex-col w-full justify-start items-start mt-3">
          <p className='font-bold text-[30px]'>Your NFTs</p>
          <p className='font-regular text-gray-400 text-[14px]'>Buy your heroes for extra bonus rewards and rapid level growth.</p>
        </div>

        <div className="farm-card w-full flex flex-col justify-center items-center mt-5">
          <div
            ref={scrollRef}
            className="scroll-container w-full flex overflow-x-auto gap-4 py-4 snap-x snap-mandatory"
            onScroll={handleScroll}
            style={{ scrollBehavior: 'smooth' }} // Menambahkan pengaturan scroll yang mulus
          >
            {ownedNFTs.length > 0 ? (
              ownedNFTs.map((nft, index) => (
                <div
                  key={index}
                  className="scroll-item relative w-full h-80 bgs rounded-3xl flex flex-col justify-center items-center text-white text-2xl snap-center p-4"
                  style={{ flex: '0 0 100%' }} // Menyesuaikan lebar item agar memenuhi kontainer
                >
                  <Image 
                    src={nft.image} 
                    alt={nft.name} 
                    width={200} 
                    height={200} 
                    className="rounded-3xl"
                  />
                  <p className="mt-6 text-center text-sm font-bold">{nft.name}</p>
                </div>
              ))
            ) : (
              <div className="scroll-item relative w-full h-80 bgs rounded-3xl flex flex-col justify-center items-center text-white text-2xl snap-center p-4"
                   style={{ flex: '0 0 100%' }} // Menyesuaikan lebar item agar memenuhi kontainer
              >
                <Link href="https://xyznt.io/marketplace" target="_blank">
                  <div className="flex flex-col justify-center items-center w-full h-full cursor-pointer">
                    <div className="text-6xl text-green-500">+</div>
                    <p className="mt-6 text-center text-xs text-light text-gray-400">You don't have an NFT yet.</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
          {ownedNFTs.length > 1 && (
            <div className="dots flex mt-4 space-x-2">
              {ownedNFTs.map((_, index) => (
                <div
                  key={index}
                  className={`dot w-2 h-2 rounded-full ${currentIndex === index ? 'bg-blue-400' : 'bg-gray-500'}`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
          )}
         
        </div>
        
      </div>
      
      <div className=" flex justify-start items-start w-full px-5 mt-3">
        <p className='text-left flex justify-start items-start text-[10px] font-bold text-white'>Your NFTs list</p>
      </div>
      <div className="NFT-list w-[360px] h-[80px] flex flex-col justify-between items-center bgs mt-3 rounded-xl p-4 ">
        <div className="flex justify-between w-full">
          <p className='font-regular text-[8px]'>NFTs List</p>
          <p className='font-regular text-[8px]'>Total NFT Rewards</p>
        </div>
        <div className="flex justify-between w-full">
          <div className="nft-list-wrap flex flex-col justify-start items-start ">
            <ul className='list-none font-regular text-[8px] list-inside justify-center items-start flex flex-col'>
              <li className='text-[10px] font-bold'>Rare: {countR}</li>
              <li className='text-[10px] font-bold'>Super Rare: {countSR}</li>
            </ul>
          </div>
          <div className="nft-reward-bonus flex flex-col justify-center items-center ">
            <ul className='text-[12px] font-extrabold text-right text-green-500'>
              {nftRewardBonus.toLocaleString(locale)}
            </ul>
          </div>
        </div>
      </div>
      <div className="wrap-buy-button my-5">
        <Link href="https://xyznt.io/marketplace" target="_blank">
          <button className='but px-[143px] py-4 rounded-xl'>
            Buy NFT 
          </button>
        </Link>
      </div>
      <div className="py-24"></div>
    </div>
  );
};

export default Page;
