import React from "react";

const TetherPrice = () => {
  return (
    <div className="w-full h-full flex space-y-8">
      <div className="w-full h-full flex -m-20 justify-center space-y-5 flex-col items-center">
        <div>
          <h1 className="text-lg font-bold">USDT/₩1364.42</h1>
        </div>
        <div className="bg-gray-200 md:w-xl border-slate-400 border rounded-2xl overflow-hidden py-10 items-center space-y-4 px-3  shadow-2xl flex flex-col">
          <h1 className="font-bold text-2xl bg-[#26a17b]/30 px-4 rounded-lg">Set Tether Price</h1>
          <input className="bg-slate-300 w-lg px-2 py-2 rounded-xl " type="text" name="" id="" />
          <button className="py-3 bg-[#26a17b] px-3 rounded-xl cursor-pointer text-white ">
            Set Price
          </button>
        </div>
      </div>
    </div>
  );
};

export default TetherPrice;
