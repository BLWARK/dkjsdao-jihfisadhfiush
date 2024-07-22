"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillDollarCircle } from "react-icons/ai";
import { IoMdPersonAdd } from "react-icons/io";
import { IoGift } from "react-icons/io5";
import { GiReceiveMoney } from "react-icons/gi";
import { MdLeaderboard } from "react-icons/md";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/main/earn", icon: GiReceiveMoney, label: "Earn" },
    { href: "/main/invite", icon: IoMdPersonAdd, label: "Invite" },
    { href: "/main/nft", icon: AiFillDollarCircle, label: "NFT" },
    { href: "/main/rank", icon: MdLeaderboard, label: "Rank" },
    { href: "/main/claim", icon: IoGift, label: "Claim" }
  ];

  return (
    <div className="Nave flex justify-center items-center w-full absolute">
      <div className="w-full grid grid-cols-5 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          return (
            <Link key={item.label} href={item.href} replace>
              <div className={`flex flex-col justify-center items-center gap-2 ${isActive ? 'text-blue-400' : 'text-white'} text-sm`}>
                <item.icon />
                <p className="font-semibold">{item.label}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
