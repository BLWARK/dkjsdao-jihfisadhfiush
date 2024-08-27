"use client";

import React, { useState, useEffect } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useBackend } from "@/context/BackContext";  
import { Player } from '@lottiefiles/react-lottie-player';
import Image from "next/image";

const Claim = () => {
  const { balanceAirdrop, setBalanceAirdrop, setCompletedTasks, completedTasks } = useGlobalState();
  const { taskList, useTask, task, getCheckpoint, postCheckpoint, checkpoint, } = useBackend(); 
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [rewardReceived, setRewardReceived] = useState(0); // Menyimpan reward yang didapat
  const [showInsufficientBalancePopup, setShowInsufficientBalancePopup] = useState(false); 
  const [showCheckpointCompletedPopup, setShowCheckpointCompletedPopup] = useState(false); 
  const [showConfirmCheckpointPopup, setShowConfirmCheckpointPopup] = useState(false);
  const [showCheckpointInfoPopup, setShowCheckpointInfoPopup] = useState(false);
  const [checkpointDone, setCheckpointDone] = useState(false); 
  const [selectedTask, setSelectedTask] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [canClaim, setCanClaim] = useState(false);
  const [taskStarted, setTaskStarted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await taskList(); // Memuat daftar tugas
      const checkpointData = await getCheckpoint(); // Memuat data checkpoint

      if (checkpointData?.userPoints) {
        setBalanceAirdrop(checkpointData.userPoints); // Set poin pengguna dari API checkpoint
      }

      // Jika properti `completed` bernilai true, atur `checkpointDone` menjadi true
      if (checkpointData?.completed) {
        setCheckpointDone(true); // Checkpoint selesai
      } else {
        setCheckpointDone(false); // Checkpoint belum selesai
      }
    };

    fetchData();
  }, []);

  const handleTaskClick = (taskId) => {
    const selectedTaskFromApi = task?.find(t => t._id === taskId); 
    if (!selectedTaskFromApi || selectedTaskFromApi.completed) return; 
    setSelectedTask(selectedTaskFromApi);
    setTaskStarted(false);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedTask(null);
    setUploadedFile(null);
    setCanClaim(false);
    setTaskStarted(false);
  };

  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
    if (taskStarted && event.target.files[0]) {
      setCanClaim(true);
    } else {
      setCanClaim(false);
    }
  };

  const handleStart = async () => {
    if (selectedTask) {
      // Identifikasi apakah tugas terkait dengan Telegram
      const isTelegramTask = selectedTask.name.toLowerCase().includes("telegram") || selectedTask.link.includes("t.me");

      if (isTelegramTask) {
        // Tandai tugas Telegram sebagai selesai
        await handleSend(); // Langsung selesaikan tugas tanpa tombol send
        
        // Tunggu 1 detik sebelum membuka tab baru
        setTimeout(() => {
          window.open(selectedTask.link, "_blank");
        }, 1000);
      } else if (selectedTask.link) {
        // Buka link untuk tugas non-Telegram
        window.open(selectedTask.link, "_blank");
        setTaskStarted(true);
        if (uploadedFile) {
          setCanClaim(true);
        }
      }
    }
  };

  const handleSend = async () => {
    try {
      // Panggil API untuk menyelesaikan tugas di belakang layar
      const res = await useTask(selectedTask._id);
      
      // Jika API berhasil dan mengembalikan userPoint
      if (res?.userPoint) {
        setBalanceAirdrop(res.userPoint); // Update saldo dengan poin baru dari API
        setCompletedTasks((prev) => [...prev, selectedTask._id]); // Tandai task sebagai complete
        setRewardReceived(selectedTask.reward); // Simpan reward yang didapat
        
        await taskList(); // Memuat ulang task list setelah selesai
      } else {
        console.error("Error: userPoint not returned from API");
      }
      
      // Langsung tampilkan popup sukses
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      handleClosePopup(); // Tutup popup setelah tugas selesai
    }
  };

  const handleCheckpoint = async () => {
    try {
      if (checkpointDone) {
        setShowCheckpointCompletedPopup(true); 
      } else if (balanceAirdrop < checkpoint?.checkpointDeduction) { 
        setShowInsufficientBalancePopup(true); 
      } else {
        setShowConfirmCheckpointPopup(true); // Tampilkan popup konfirmasi
      }
    } catch (error) {
      console.error("Error during checkpoint:", error);
    }
  };
  

  const confirmCheckpoint = async () => {
    try {
      const res = await postCheckpoint(); 
      if (res?.userPoints) {
        setBalanceAirdrop(res.userPoints); // Update saldo langsung dari checkpoint response
        
        // Memastikan state checkpointDone diperbarui
        if (res?.checkpointDone) {
          setCheckpointDone(true);
        }
  
        // Memuat ulang data checkpoint agar UI terupdate
        const checkpointData = await getCheckpoint(); 
        
        if (checkpointData?.completed) {
          setCheckpointDone(true); // Memastikan state diperbarui sesuai dengan backend
        }
  
        setShowConfirmCheckpointPopup(false); 
      }
    } catch (error) {
      console.error("Error during checkpoint:", error);
    }
  };
  
  

  const dailyTasks = task?.filter(task => task.type === 'daily');
  const oneTimeTasks = task?.filter(task => task.type === 'one-time');
  const specialTasks = task?.filter(task => task.type === 'special');

  return (
    <div className="invite-sec w-full flex flex-col justify-start items-center h-[1200px] overflow-y-scroll bgs">
      <div className="wrap-invite w-full mb-32 px-4 flex flex-col justify-center items-center mt-5">
        <div className="subtitle w-full text-[32px] text-left flex justify-center items-center mt-2 font-bold">
          <p>Earn More Coins</p>
        </div>
        <div className="wrap-total-balance w-full flex flex-col justify-center items-center my-5 mt-5 gap-2">
          <p className="font-bold text-[16px] text-white">Your Points</p>
          <div className="wrap-icon-coin w-full flex justify-center items-center gap-2">
            <Image src="/Coins.png" alt="Logo" width={30} height={30} />
            <p className='font-bold text-[28px] text-white text-right'>{checkpoint?.userPoints}</p>
          </div>
        </div>

        {/* Render Checkpoint Section */}
        <div className="subtitle w-full text-[12px] text-left mt-10 font-bold">
          <p className='font-bold text-[14px]'>Checkpoint</p>
        </div>
        <div className="checkpoint-section w-full flex justify-between items-center mt-5 px-5 py-6 bgs rounded-2xl">
          <div className="checkpoint-info flex flex-col justify-center items-start">
            <p className="font-bold text-[12px] text-white">Checkpoint: {checkpoint?.checkpoint}/{checkpoint?.totalCheckpoint}</p>
          </div>
          <button
            className={`but py-2 px-2 text-[12px] rounded-lg ${checkpointDone ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleCheckpoint}
            disabled={checkpointDone} // Disable tombol jika checkpoint sudah selesai
          >
            {checkpointDone ? <FaCheck className="text-green-500" /> : 'Checkpoint'}
          </button>
        </div>

        {/* Render Daily Tasks dengan Subjudul */}
        <div className="subtitle w-full flex justify-between items-end text-[12px] text-left mt-10 font-bold">
          <p className='font-bold text-[14px] '>Daily Tasks</p>
          <button
            className="but py-2 px-4 text-[12px] rounded-lg"
            onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScGmbqZg51HkS_SBrz2YS82HvWs9JdvAcJo8nl5cGhAv2AftA/viewform', '_blank')}
          >
            Collaboration
          </button>
        </div>
        <div className="all-task overflow-y-scroll gap-6 mt-1">
          {dailyTasks?.map(task => (
            <button key={task._id} className={`Task-add w-[360px] h-[80px] flex justify-center items-center bgs rounded-2xl gap-5 px-5 mt-5 ${task.completed ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => handleTaskClick(task._id)}>
              <div className="icon w-[15%] flex justify-center items-center text-3xl">
                <Image src={task.icon} alt={task.name} width={60} height={60} />
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
                {task.completed ? <FaCheck className="text-green-500" /> : <IoIosArrowForward />}
              </div>
            </button>
          ))}
        </div>

        {/* Render One-time Tasks dengan Subjudul */}
        <div className="subtitle w-full text-[12px]  text-left mt-14 font-bold">
          <p className='font-bold text-[14px]'>Ecosystem Tasks</p>
        </div>
        <div className="all-task overflow-y-scroll gap-6 ">
          {oneTimeTasks?.map(task => (
            <button key={task._id} className={`Task-add w-[360px] h-[80px] flex justify-center items-center bgs rounded-2xl gap-5 px-5 mt-5 ${task.completed ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => handleTaskClick(task._id)}>
              <div className="icon w-[15%] flex justify-center items-center text-3xl">
                <Image src={task.icon} alt={task.name} width={60} height={60} />
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
                {task.completed ? <FaCheck className="text-green-500" /> : <IoIosArrowForward />}
              </div>
            </button>
          ))}
        </div>

        {/* Render Special Tasks dengan Subjudul
        <div className="subtitle w-full text-[12px] text-left mt-10 font-bold">
          <p>Special Tasks</p>
        </div>
        <div className="all-task overflow-y-scroll gap-6 mt-2">
          {specialTasks?.map(task => (
            <button key={task._id} className={`Task-add w-[360px] h-[80px] flex justify-center items-center bgs rounded-2xl gap-5 px-5 mt-5 ${task.completed ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => handleTaskClick(task._id)}>
              <div className="icon w-[15%] flex justify-center items-center text-3xl">
                <Image src={task.icon} alt={task.name} width={60} height={60} />
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
                {task.completed ? <FaCheck className="text-green-500" /> : <IoIosArrowForward />}
              </div>
            </button>
          ))}
        </div> */}
      </div>

      {/* Task Popup */}
      {showPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="popup-content bgs w-[350px] h-[400px] rounded-lg shadow-lg text-center flex flex-col p-5 gap-2 relative">
            <button className="close-icon absolute top-4 right-4 text-white text-2xl" onClick={handleClosePopup}>
              <MdClose />
            </button>
            <p className="mb-4 text-white font-bold text-xl mt-5 ">{selectedTask.name}</p>
            <ul className='text-left mb-5 list-disc list-inside'> How it works
              <li className='font-light text-[12px] mt-2'>Click start, do your task and take screenshot</li>
              <li className='font-light text-[12px] mt-2'>Attach your screenshot file </li>
              <li className='font-light text-[12px] mt-2'>Click Send</li>
            </ul>
            <div className="input-wrap flex justify-center items-center">
              {!selectedTask.name.toLowerCase().includes("telegram") && (
                <input type="file" onChange={handleFileChange} className='bg-blue-950 w-[330px] h-[70px] p-5 rounded-lg text-[12px]' />
              )}
            </div>
            <div className="flex  justify-center items-center gap-4 mt-6">
            {/* <Image src="/TG.png" alt="Logo" width={150} height={150} /> */}
            
              
              
              <button className="but py-2 px-4 w-full rounded-lg " onClick={handleStart}>
                Start
              </button>
              {!selectedTask.name.toLowerCase().includes("telegram") && (
                <button className={`but py-2 px-4 rounded-lg ${!(taskStarted && uploadedFile) ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleSend} disabled={!(taskStarted && uploadedFile)}>
                  Send
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="popup-content  justify-center items-center bgs w-[350px] h-[300px] rounded-lg shadow-lg text-center flex flex-col p-5 gap-3 relative">
            {/* Menambahkan animasi Lottie */}
            <Player
              autoplay
              loop={true}
              src="https://lottie.host/a0313bb7-eaa8-4e4e-8351-ad7f33b79fd0/NmcezpdZ4o.json"
              style={{ height: '100px', width: '100px' }}
            />
            <p className="text-white font-bold text-lg">Success!</p>
            <p className="text-white mb-2">Your task has been completed.</p>
            <button className="but py-2 px-4 rounded-lg w-full" onClick={async () => {
              setShowSuccessPopup(false);
              await taskList();  // Memuat ulang task list
              await getCheckpoint();  // Memuat ulang checkpoint
            }}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* Insufficient Balance Popup */}
      {showInsufficientBalancePopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="popup-content bgs w-[350px] h-[280px] rounded-lg shadow-lg text-center flex flex-col p-5 gap-5 relative">
            <p className="mb-2 text-red-500 font-bold text-lg mt-5">Insufficient Balance</p>
            <p className="mb-4 text-white">You don't have enough points to complete the checkpoint. Please earn more points and try again later.</p>
            <button className="but py-2 px-4 rounded-lg" onClick={() => setShowInsufficientBalancePopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Checkpoint Completed Popup */}
      {showCheckpointCompletedPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="popup-content bgs w-[350px] h-[280px] rounded-lg shadow-lg text-center flex flex-col p-5 gap-5 relative">
            <p className="mb-4 text-white font-bold text-lg mt-5">Checkpoint Completed</p>
            <p className="mb-4 text-white">You have already completed your checkpoint for today. Please come back tomorrow to checkpoint again.</p>
            <button className="but py-2 px-4 rounded-lg" onClick={() => setShowCheckpointCompletedPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirm Checkpoint Popup */}
      {showConfirmCheckpointPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="popup-content bgs w-[350px] h-[300px] rounded-lg shadow-lg text-center flex flex-col p-5 gap-5 relative">
            <button className="close-icon absolute top-4 right-4 text-white text-2xl" onClick={() => setShowConfirmCheckpointPopup(false)}>
              <MdClose />
            </button>
            <p className="mb-2 text-white font-bold text-xl mt-5">Confirm Checkpoint</p>
            <p className=" text-white">
              This will deduct <span className='text-red-500 font-bold'> -{checkpoint?.checkpointDeduction || 0}</span> points from your balance. 
              Do you wish to continue?
            </p>
            <button className="text-blue-500 text-[12px] underline italic" onClick={() => setShowCheckpointInfoPopup(true)}>
              Why should I checkpoint every day?
            </button>
            <div className="flex justify-center gap-4 mt-5">
              <button className="but py-2 px-4 rounded-lg" onClick={() => setShowConfirmCheckpointPopup(false)}>
                Cancel
              </button>
              <button className="but py-2 px-4 rounded-lg" onClick={confirmCheckpoint}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkpoint Info Popup */}
      {showCheckpointInfoPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="popup-content bgs w-[350px] h-[300px] rounded-lg shadow-lg text-center flex flex-col p-5 gap-5 relative">
            <button className="close-icon absolute top-4 right-4 text-white text-2xl" onClick={() => setShowCheckpointInfoPopup(false)}>
              <MdClose />
            </button>
            <p className="text-white font-bold text-lg mt-5">Why Checkpoint Every Day?</p>
            <p className="text-white text-light text-[14px]">
              You must checkpoint every day to qualify for receiving coin rewards. The number of checkpoints required per level varies. Make sure to checkpoint every day so you don't miss out on the chance to earn rewards.
            </p>
            <button className="but py-2 px-4 rounded-lg w-full mt-4" onClick={() => setShowCheckpointInfoPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Claim;
