export const dataUser = {
  userName_Telegram: "@Nobits88",
  name_Telegram: "Rhonald bastian",
  userLevel: "",
  walletAddress: "0x2fFfd254b7EF5C327F7772a539fc6F02Cd641Eca",
  balanceAirdrop: 159839,
  totalDailyCheckPoint: 0,
  checkpointDeduction: 0, // checkPointBalanceAirdropDeduction
  timer: {
    startTimer: 3600, // countdown 1 jam
    endTimer: 0,
    timeLeftToClaim: 0, // sisa waktu utk claim
  },
  lastClaim: 0,
  hourEarn: 666,
  refferalCode: "",
  referrals: [
    {
      id: "5W1H",
      name: "@Nobits88",
    },
    
  ],
  // Data kepemilikan NFT
  nfts: [
    {
      id: "1",
      name: "Thunder Warden",
      description: "",
      tokenId: "",
      image: "/thunderwarden.png",
      traits: [
        {
          reward: 1484.44,
        },
        { 
          rarity: "R",
        }
      ]
     },
    {
      id: "2",
      name: "Empress Valor",
      rarity: "R",
    },
    // {
    //   id: "7",
    //   name: "Squeaky",
    //   rarity: "SR",
    // },
    // {
    //   id: "6",
    //   name: "Golden",
    //   rarity: "SR",
    // },
    
  ],
};

export const dataReferral = [
  {
    userName_Telegram: "@Nobits88",
    name: "Rhonald Bastian",
    name_Telegram: "Rhonald bastian",
    totalReferral: 12, // Changed to number for easier comparison
    referrals: [
      {
        userName_Telegram: "@Erros",
        name: "Erros Chand",
        totalFriendsReferral: 1,
        balanceAirdrop: 666, // Point for referral 1
      },
      {
        userName_Telegram: "@Cryptohell",
        name: "Fhay",
        totalFriendsReferral: 1,
        points: 700, // Point for referral 2
      },
      {
        userName_Telegram: "@Ronin",
        name: "Noclear",
        totalFriendsReferral: 1,
        points: 800, // Point for referral 3
      },
      {
        userName_Telegram: "@User4",
        name: "User Four",
        totalFriendsReferral: 1,
        points: 1000, // Point for referral 4
      },
      {
        userName_Telegram: "@User5",
        name: "User Five",
        totalFriendsReferral: 1,
        points: 750, // Point for referral 5
      },
      {
        userName_Telegram: "@User6",
        name: "User Six",
        totalFriendsReferral: 1,
        points: 850, // Point for referral 6
      },
      {
        userName_Telegram: "@User7",
        name: "User Seven",
        totalFriendsReferral: 1,
        points: 900, // Point for referral 7
      },
      {
        userName_Telegram: "@User8",
        name: "User Eight",
        totalFriendsReferral: 1,
        points: 950, // Point for referral 8
      },
      {
        userName_Telegram: "@User9",
        name: "User Nine",
        totalFriendsReferral: 1,
        points: 700, // Point for referral 9
      },
      {
        userName_Telegram: "@User10",
        name: "User Ten",
        totalFriendsReferral: 1,
        points: 1000, // Point for referral 10
      },
      {
        userName_Telegram: "@User11",
        name: "User Eleven",
        totalFriendsReferral: 1,
        points: 666, // Point for referral 11
      },
      {
        userName_Telegram: "@User12",
        name: "User Twelve",
        totalFriendsReferral: 1,
        points: 666, // Point for referral 12
      },
    ],
  },
];

export const dataNFT = [
  {
    rarity: "R",
    nfts: [
      {
        id: "1",
        name: "Thunder Warden",
        description: "",
        tokenId: "",
        image: "/thunderwarden.png",
        traits: [
          {
            reward: 1484.44,
          },
          { 
            rarity: "R",
          }
        ]
       },

      {
        id: "2",
        name: "Empress Valor",
        reward: 1068.80,
        image: "/empressvalor.png",
      },
      {
        id: "3",
        name: "Athena Valkyrie",
        reward: 835.00,
        image: "/athenavalkyrie.png",
      },
      {
        id: "4",
        name: "Titan",
        reward: 633.74,
        image: "/titan.png",
      },
      {
        id: "5",
        name: "Guardian",
        reward: 593.78,
        image: "/guardian.png",
      },
    ],
  },
  {
    rarity: "SR",
    nfts: [
      {
        id: "6",
        name: "Golden",
        image: "/golden.png",
        reward: 13360.00,
      },
      {
        id: "7",
        name: "Squeaky",
        reward: 8659.26,
        image: "/squeaky.png",
      },
      {
        id: "8",
        name: "Golden Warrior",
        reward: 6123.33,
        image: "/goldenwarrior.png",
      },
      {
        id: "9",
        name: "Blade",
        reward: 3340.00,
        image: "/bladeguardian.png",
      },
      {
        id: "10",
        name: "King Aegis",
        reward: 2672.00,
        image: "/kingaegis.png",
      },
    ],
  },
];

export const dataLevel = [
  {
    id: "1",
    name: "Urban Survivor",
    task: 1,
    minimumPoint: 159840,
    totalCheckPoin: 1,
    checkpointDeduction: 2664,
    perHourEarn: 666,
    perSecondEarn: 0,
    minReferral: 4,
    image: "/UrbanSurvivor.png",
    eligibleToClaimBonus: true,
  },
  {
    id: "2",
    name: "Hustler",
    task: 2,
    minimumPoint: 399600,
    totalCheckPoin: 1,
    checkpointDeduction: 4440,
    perHourEarn: 1998,
    minReferral: 12,
    image: "/Hustler.png",
    eligibleToClaimBonus: true,
  },
  {
    id: "3",
    name: "Street Trader",
    task: 3,
    minimumPoint: 446220,
    totalCheckPoin: 1,
    checkpointDeduction: 102897,
    perHourEarn: 4662,
    minReferral: 3,
    minNftOwnership: 1,
    rarity: "R",
    image: "/StreetTrader.png",
    eligibleToClaimBonus: true,
  },
  {
    id: "4",
    name: "Small Biz Tycoon",
    task: 4,
    minimumPoint: 1028970,
    totalCheckPoin: 1,
    checkpointDeduction: 102000,
    perHourEarn: 12654,
    minReferral: 5,
    minNftOwnership: 2,
    rarity: "R",
    image: "/SmallBizTycoon.png",
    eligibleToClaimBonus: true,
  },
  {
    id: "5",
    name: "Enterprise Leader",
    task: 5,
    minimumPoint: 3108888,
    totalCheckPoin: 1,
    checkpointDeduction: 207259,
    perHourEarn: 24376,
    minReferral: 8,
    minNftOwnership: 1,
    rarity: "SR",
    image: "/EnterpriseLeader.png",
    eligibleToClaimBonus: true,
  },
  {
    id: "6",
    name: "Billionaire Visionary",
    task: 6,
    minimumPoint: 7877315,
    totalCheckPoin: 1,
    checkpointDeduction: 393866,
    perHourEarn: 38442,
    minReferral: 10,
    minNftOwnership: 2,
    rarity: "SR",
    image: "/BillionaireVisionary.png",
    eligibleToClaimBonus: true,
  },
];




export const dataTask = [
  {
    id: 1,
    name: "Invite Friends",
    icon: "IoMdPersonAdd",
    reward: 666,
    link: "/"
  },
  {
    id: 2,
    name: "Retweet our Tweet on X",
    icon: "BsTwitterX",
    reward: 666,
    link: "https://x.com/XyzmerCoin?t=AoFukEkDMlXbMHawMpK5DA&s=09"
  },
  {
    id: 3,
    name: "Visit Xyznt.io Marketplace",
    icon: "/Logo XYZnt.png",
    reward: 666,
    link: "https://xyznt.io"
  },
  {
    id: 4,
    name: "Join our Telegram community",
    icon: "/TG.png",
    reward: 666,
    link: "https://t.me/xyzmercoin_Channel"
  },
  {
    id: 5,
    name: "Follow our X community",
    icon: "BsTwitterX",
    reward: 666,
    link: "https://x.com/XyzmerCoin?t=AoFukEkDMlXbMHawMpK5DA&s=09"
  },
  {
    id: 6,
    name: "Join Xyznt.io Telegram community",
    icon: "/Logo XYZnt.png",
    reward: 666,
    link: "https://t.me/xyzntio"
  },
  {
    id: 7,
    name: "Follow X Xyznt.io",
    icon: "/Logo XYZnt.png",
    reward: 666,
    link: "https://twitter.com/xyzntio"
  },
  {
    id: 8,
    name: "Add us to Wishlist on Coinmarketcap",
    icon: "/CMC.jpeg",
    reward: 666,
    link: "https://coinmarketcap.com/"
  },
  {
    id: 9,
    name: "Add us to Wishlist on Coingecko",
    icon: "/coingecko.png",
    reward: 666,
    link: "https://www.coingecko.com/"
  },
  {
    id: 10,
    name: "Boost our Telegram Channel",
    icon: "/TP.webp",
    reward: 6666,
    link: "https://t.me/boost/xyzmercoin_Channel"
  },
  {
    id: 11,
    name: "Create profile on xyznt.io",
    icon: "/Logo XYZnt.png",
    reward: 6666,
    link: "https://xyznt.io"
  },
  {
    id: 12,
    name: "Follow Father Xyzmercoin Instagram",
    icon: "/IG.png",
    reward: 6666,
    link: "https://www.instagram.com/xyzmercoinofficial?igsh=aGxnOHZ0aTI0eTY2"
  },
  {
    id: 13,
    name: "Daily Checkpoint",
    icon: "FaCheck",
    link: "/main",
    checkpoint: true, // Menandakan ini adalah tugas checkpoint
  },
];


