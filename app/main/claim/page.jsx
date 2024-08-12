"use client";

import React, { useState, useEffect } from 'react';
import { BsTwitterX } from "react-icons/bs";
import { IoIosArrowForward, IoMdPersonAdd } from "react-icons/io";
import { FaWallet, FaCheck, FaExclamationTriangle, FaQuestionCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { dataTask, dataLevel } from "@/lib/data";
import { useGlobalState } from "@/context/GlobalStateContext";
import Image from "next/image";
import CountUp from 'react-countup';

const getIconComponent = (iconName) => {
  const iconMap = {
    IoMdPersonAdd: IoMdPersonAdd,
    BsTwitterX: BsTwitterX,
    FaWallet: FaWallet,
    FaCheck: FaCheck,
    FaExclamationTriangle: FaExclamationTriangle,
    FaQuestionCircle: FaQuestionCircle,
  };
  return iconMap[iconName] || null;
};

const Page = () => {
  const { balanceAirdrop, setBalanceAirdrop, userLevel, checkpointDone, setCheckpointDone, checkpointCount, setCheckpointCount, lastCheckpointDate, setLastCheckpointDate, completedTasks, setCompletedTasks } = useGlobalState();
  const [showPopup, setShowPopup] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [canClaim, setCanClaim] = useState(false);
  const [taskStarted, setTaskStarted] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showCheckpointInfoPopup, setShowCheckpointInfoPopup] = useState(false);
  const [showInsufficientBalancePopup, setShowInsufficientBalancePopup] = useState(false);
  const [showCheckpointReasonPopup, setShowCheckpointReasonPopup] = useState(false);
  const [startCount, setStartCount] = useState(balanceAirdrop);
  const [endCount, setEndCount] = useState(balanceAirdrop);

  useEffect(() => {
    setStartCount(endCount);
    setEndCount(balanceAirdrop);
  }, [balanceAirdrop]);

  const handleTaskClick = (taskId) => {
    if (completedTasks.includes(taskId)) return; // Cegah klik jika tugas sudah selesai
    const task = dataTask.find(t => t.id === taskId);
    setSelectedTask(task);
    setTaskStarted(false); // Reset taskStarted setiap kali task dipilih
    if (task.name === "Daily Checkpoint" && checkpointDone) {
      setShowCheckpointInfoPopup(true);
    } else {
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedTask(null);
    setUploadedFile(null);
    setCanClaim(false);
    setTaskStarted(false); // Reset taskStarted saat popup ditutup
    setWalletAddress('');
  };

  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
    if (taskStarted && event.target.files[0]) { // Cek jika task sudah dimulai dan file sudah diupload
      setCanClaim(true);
    } else {
      setCanClaim(false);
    }
  };

  const handleStart = () => {
    if (selectedTask && selectedTask.link) {
      window.open(selectedTask.link, "_blank");
      setTaskStarted(true); // Set taskStarted menjadi true saat tombol Start diklik
      if (uploadedFile) {
        setCanClaim(true);
      }
    }
  };

  const handleSend = () => {
    if (selectedTask && canClaim) {
      // Tambahkan reward ke balance airdrop
      const newBalance = balanceAirdrop + selectedTask.reward;
      setBalanceAirdrop(newBalance); // Perbarui saldo airdrop di Global State

      // Tandai tugas sebagai selesai
      setCompletedTasks(prevState => [...prevState, selectedTask.id]);

      setShowSuccessPopup(true); // Tampilkan popup sukses
      handleClosePopup();
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  const handleCheckpoint = () => {
    const levelData = dataLevel.find(level => level.name === userLevel);
    const todayUTC = new Date().toISOString().split('T')[0];

    if (lastCheckpointDate === todayUTC) {
      setShowCheckpointInfoPopup(true);
      return;
    }

    if (levelData) {
      if (balanceAirdrop >= levelData.checkpointDeduction) {
        const newBalance = balanceAirdrop - levelData.checkpointDeduction;
        setBalanceAirdrop(newBalance);
        setCheckpointCount(checkpointCount + 1);
        setCheckpointDone(true);
        setLastCheckpointDate(todayUTC);
      } else {
        setShowInsufficientBalancePopup(true);
      }
    }
    handleClosePopup();
  };

  const handleCloseCheckpointInfoPopup = () => {
    setShowCheckpointInfoPopup(false);
  };

  const handleCloseInsufficientBalancePopup = () => {
    setShowInsufficientBalancePopup(false);
  };

  const handleShowCheckpointReasonPopup = () => {
    setShowCheckpointReasonPopup(true);
  };

  const handleCloseCheckpointReasonPopup = () => {
    setShowCheckpointReasonPopup(false);
  };

  const dailyTasks = dataTask.filter(task => task.id === 13 || task.id === 1 || task.id === 2 || task.id === 3);
  const taskList = dataTask.filter(task => task.id >= 4 && task.id <= 9);
  const specialTasks = dataTask.filter(task => task.id >= 10 && task.id <= 12);

  return (
    <div className="invite-sec w-full flex flex-col justify-start items-center min-h-screen overflow-y-scroll bgs">
      <div className="wrap-invite w-full px-4 flex flex-col justify-center items-center mt-5">
        <div className="subtitle w-full text-[24px] text-left flex justify-center items-center mt-5 font-bold">
          <p>Earn More Coins</p>
        </div>
        <div className="wrap-total-balance w-full flex flex-col justify-center items-center my-10 gap-2">
          <p className="font-bold text-[16px] text-white">Your Balance</p>
          <div className="wrap-icon-coin w-full flex justify-center items-center gap-2">
            <Image src="/Coins.png" alt="Logo" width={30} height={30} />
            <CountUp start={startCount} end={endCount} duration={1} separator="," className="font-bold text-[28px] text-white text-right" />
          </div>
        </div>
        <div className="subtitle w-full text-[12px] text-left flex justify-between items-center mt-10 font-bold">
          <p className=' mt-5'>Daily Task</p>
          <button className='but py-3 px-4 rounded-xl' onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLScGmbqZg51HkS_SBrz2YS82HvWs9JdvAcJo8nl5cGhAv2AftA/viewform?usp=sf_link", "_blank")}>Collaboration</button>
        </div>

        <div className="all-task overflow-y-scroll gap-6 mt-2">
          {dailyTasks.sort((a, b) => a.id === 13 ? -1 : b.id === 13 ? 1 : 0).map((task) => {
            const IconComponent = getIconComponent(task.icon);
            const levelData = dataLevel.find(level => level.name === userLevel);
            const isTaskCompleted = completedTasks.includes(task.id); // Cek apakah tugas sudah selesai
            return (
              <button
                key={task.id}
                className={`Task-add w-[360px] h-[80px] flex justify-center items-center bgs rounded-2xl gap-5 px-5 mt-5 ${isTaskCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleTaskClick(task.id)}
                disabled={isTaskCompleted} // Nonaktifkan tombol jika tugas sudah selesai
              >
                <div className="icon w-[15%] flex justify-center items-center text-3xl">
                  {IconComponent ? <IconComponent /> : <Image src={task.icon} alt={task.name} width={60} height={60} />}
                </div>
                <div className="icon w-[85%] flex flex-col justify-start items-start">
                  <div className="flex justify-between w-full">
                    <p className="font-bold text-[12px]">{task.name}</p>
                    {task.checkpoint && levelData && (
                      <p className="font-bold text-[12px]">{checkpointCount}/{levelData.totalCheckPoin}</p>
                    )}
                  </div>
                  {!task.checkpoint && (
                    <p className="font-md text-[12px] flex justify-center items-center px-2">
                      <span className="text-blue-500 font-bold text-[14px] flex justify-center items-center mr-1 mt-2 gap-1">
                        <Image src="/Coins.png" alt="gift" width={15} height={15} />+{task.reward}
                      </span>
                    </p>
                  )}
                </div>
                <div className="icon w-[5%] flex justify-center items-center">
                  {isTaskCompleted ? (
                    <FaCheck className="text-green-500" /> // Ubah ikon panah menjadi centang
                  ) : task.checkpoint && checkpointDone ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <IoIosArrowForward />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <div className="subtitle w-full text-[12px] text-left flex justify-start items-start mt-10 font-bold">
          <p className=''>Task List</p>
        </div>
        <div className="all-task overflow-y-scroll h-[440px] gap-6 mt-2">
          {taskList.map((task) => {
            const IconComponent = getIconComponent(task.icon);
            const isTaskCompleted = completedTasks.includes(task.id); // Cek apakah tugas sudah selesai
            return (
              <button
                key={task.id}
                className={`Task w-[360px] h-[80px] flex justify-center items-center bgs rounded-2xl gap-5 px-5 mt-5 ${isTaskCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleTaskClick(task.id)}
                disabled={isTaskCompleted} // Nonaktifkan tombol jika tugas sudah selesai
              >
                <div className="icon w-[15%] flex justify-center items-center text-3xl">
                  {IconComponent ? <IconComponent /> : <Image src={task.icon} alt={task.name} width={60} height={60} />}
                </div>
                <div className="icon w-[85%] flex flex-col justify-start items-start">
                  <p className="font-bold text-[12px]">{task.name}</p>
                  <p className="font-md text-[12px] flex justify-center items-center px-2">
                    <span className="text-blue-500 font-bold text-[14px] flex justify-center items-center mr-1 mt-2 gap-1">
                      <Image src="/Coins.png" alt="gift" width={15} height={15} />+{task.reward}
                    </span>
                  </p>
                </div>
                <div className="icon w-[5%] flex justify-center items-center">
                  {isTaskCompleted ? (
                    <FaCheck className="text-green-500" /> // Ubah ikon panah menjadi centang
                  ) : (
                    <IoIosArrowForward />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="subtitle w-full text-[12px] text-left flex justify-start items-start mt-10 font-bold">
          <p className=''>Special Task</p>
        </div>
        <div className="all-task overflow-y-scroll h-[440px] gap-6 mt-2">
          {specialTasks.map((task) => {
            const IconComponent = getIconComponent(task.icon);
            const isTaskCompleted = completedTasks.includes(task.id); // Cek apakah tugas sudah selesai
            return (
              <button
                key={task.id}
                className={`Task w-[360px] h-[80px] flex justify-center items-center bgs rounded-2xl gap-5 px-5 mt-5 ${isTaskCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleTaskClick(task.id)}
                disabled={isTaskCompleted} // Nonaktifkan tombol jika tugas sudah selesai
              >
                <div className="icon w-[15%] flex justify-center items-center text-3xl">
                  {IconComponent ? <IconComponent /> : <Image src={task.icon} alt={task.name} width={60} height={60} />}
                </div>
                <div className="icon w-[85%] flex flex-col justify-start items-start">
                  <p className="font-bold text-[12px]">{task.name}</p>
                  <p className="font-md text-[12px] flex justify-center items-center px-2">
                    <span className="text-blue-500 font-bold text-[14px] flex justify-center items-center mr-1 mt-2 gap-1">
                      <Image src="/Coins.png" alt="gift" width={15} height={15} />+{task.reward}
                    </span>
                  </p>
                </div>
                <div className="icon w-[5%] flex justify-center items-center">
                  {isTaskCompleted ? (
                    <FaCheck className="text-green-500" /> // Ubah ikon panah menjadi centang
                  ) : (
                    <IoIosArrowForward />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Popup */}
      {showPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="popup-content bgs w-[350px] h-[400px] rounded-lg shadow-lg text-center flex flex-col p-5 gap-2 relative">
            <button className="close-icon absolute top-4 right-4 text-white text-2xl" onClick={handleClosePopup}>
              <MdClose />
            </button>
            <p className="mb-4 text-white font-bold text-lg mt-5">{selectedTask.name}</p>
            {selectedTask.name === "Connect Your Wallet" ? (
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  placeholder="Enter your wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="bg-blue-950 w-[330px] h-[70px] p-5 rounded-lg text-[12px] mb-4"
                />
                <p className='text-xs italic text-red-500 font-extrabold'>Please enter your wallet address (BEP20) correctly, <span className='text-xs italic text-white font-light'>your reward will send in your wallet address, We will not be responsible if the wallet you entered is incorrect</span>
                </p>
                <button
                  onClick={() => setWalletAddress('')}
                  className={`but py-2 px-10 rounded-lg mt-10 ${!walletAddress ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!walletAddress}
                >
                  Connect
                </button>
              </div>
            ) : selectedTask.name === "Daily Checkpoint" ? (
              <div className="flex flex-col items-center">
                <div className="mt-10">
                  <p className="text-white mb-4">You will spend points for checkpoint:</p>
                  <p className="text-red-500 font-bold mb-4">-{dataLevel.find(level => level.name === userLevel).checkpointDeduction} points</p>
                </div>
                <button
                  onClick={handleCheckpoint}
                  className="but py-2 px-4 rounded-lg mt-5 flex"
                >
                  Checkpoint Now
                </button>
                <div className="mt-10 underline text-xs flex items-center text-blue-500 cursor-pointer" onClick={handleShowCheckpointReasonPopup}>
                  <FaQuestionCircle className="mr-2" />
                  <span>Why should I checkpoint daily?</span>
                </div>
              </div>
            ) : selectedTask.name === "Retweet our Tweet on X" || selectedTask.name === "Invite Friends" || selectedTask.name === "Visit Xyznt.io Marketplace" || selectedTask.name === "Join our Telegram community" ? (
              <>
                <div className="wrap-title flex flex-col justify-start items-start">
                  <p className="mb-4 text-left text-white">Your Task</p>
                  <p className="mb-4 text-left text-white text-[10px] italic">Click start, Do your task, screenshoot and send your file</p>
                </div>
                <div className="input-wrap flex justify-center items-center">
                  <input type="file" onChange={handleFileChange} className='bg-blue-950 w-[330px] h-[70px] p-5 rounded-lg text-[12px]' />
                </div>
                <div className="flex justify-center gap-4 mt-10">
                  <button
                    className="but py-2 px-4 rounded-lg"
                    onClick={handleStart}
                  >
                    Start
                  </button>
                  <button
                    onClick={handleSend}
                    className={`but py-2 px-4 rounded-lg ${!(taskStarted && uploadedFile) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!(taskStarted && uploadedFile)}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="wrap-title flex flex-col justify-start items-start">
                  <p className="mb-4 text-left text-white">Your Task</p>
                  <p className="mb-4 text-left text-white text-[10px] italic">Click start, Do your task, then complete the steps</p>
                </div>
                <div className="flex justify-center gap-4 mt-10">
                  <button
                    className="but py-2 px-4 rounded-lg"
                    onClick={handleStart}
                  >
                    Start
                  </button>
                  <button
                    onClick={handleSend}
                    className="but py-2 px-4 rounded-lg"
                  >
                    Complete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Review Popup */}
      {showReviewPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="popup-content bgs w-[350px] h-[280px] rounded-lg shadow-lg text-center flex flex-col p-5 gap-5 relative">
            <p className="mb-4 text-white font-bold text-lg mt-5">Reward Notification</p>
            <p className="mb-4 text-white">Your reward is under review and will be sent within 5 hours.</p>
            <button className="but py-2 px-4 rounded-lg" onClick={() => setShowReviewPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="popup-content bgs w-[350px] h-[280px] rounded-lg shadow-lg text-center flex flex-col p-5 gap-5 relative">
            <p className="mb-4 text-white font-bold text-lg mt-5">Success!</p>
            <p className="mb-4 text-white">Your task has been completed and your reward has been added to your balance.</p>
            <button className="but py-2 px-4 rounded-lg" onClick={handleCloseSuccessPopup}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Checkpoint Info Popup */}
      {showCheckpointInfoPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="popup-content bgs w-[350px] h-[280px] rounded-lg shadow-lg text-center flex flex-col p-5 gap-5 relative">
            <button className="close-icon absolute top-4 right-4 text-white text-2xl" onClick={handleCloseCheckpointInfoPopup}>
              <MdClose />
            </button>
            <p className="mb-4 text-white font-bold text-lg mt-5">Checkpoint Information</p>
            <p className="mb-4 text-white">You have already completed the checkpoint for today. Please come back tomorrow to checkpoint again.</p>
            <button className="but py-2 px-4 rounded-lg" onClick={handleCloseCheckpointInfoPopup}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Insufficient Balance Popup */}
      {showInsufficientBalancePopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="popup-content bgs w-[350px] h-[300px] rounded-lg shadow-lg text-center flex flex-col p-5 gap-3 relative">
            <button className="close-icon absolute top-4 right-4 text-white text-2xl" onClick={handleCloseInsufficientBalancePopup}>
              <MdClose />
            </button>
            <div className="flex justify-center items-center text-3xl text-yellow-500">
              <FaExclamationTriangle />
            </div>
            <p className="font-bold text-lg mt-5 text-red-500">Insufficient Balance</p>
            <p className="mb-4 text-white">Your balance is not sufficient to complete the checkpoint. Please try again when you have enough balance.</p>
            <button className="but py-2 px-4 rounded-lg" onClick={handleCloseInsufficientBalancePopup}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Checkpoint Reason Popup */}
      {showCheckpointReasonPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="popup-content bgs w-[350px] h-[380px] rounded-lg shadow-lg text-center flex flex-col p-5 gap-5 relative">
            <button className="close-icon absolute top-4 right-4 text-white text-2xl" onClick={handleCloseCheckpointReasonPopup}>
              <MdClose />
            </button>
            <p className="mb-4 text-white font-bold text-lg mt-5">Why Checkpoint Daily?</p>
            <p className="mb-4 text-white text-md">You need to checkpoint daily to qualify for rewards. If you are not doing a checkpoints, you will not be able to claim rewards. </p>
            <span className='italic text-red-500 text-xs'> The number of checkpoints required varies for each level.</span>
            <button className="but py-2 px-4 rounded-lg" onClick={handleCloseCheckpointReasonPopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
