import React from "react";
import Navbar from "@/components/navigation/Navbar";


const layout = ({ children }) => {
  return (
    <div className="w-[390px]  min-h-screen flex justify-center items-center">
      <div className="w-full overflow-y-hidden flex flex-col justify-start items-center h-screen">
        {children}
        </div>
      <div className="w-[390px] bg-gradient-to-l from-blue-400/40 to to-blue-900/50 fixed bottom-0 backdrop-blur-lg h-[80px] flex justify-center items-center  ">
        <Navbar />
      </div>
    </div>
  );
}

export default layout;
