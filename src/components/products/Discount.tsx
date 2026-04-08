import React from "react";

const Discount = ({ percent }: { percent: number }) => {
  return (
    <button
      className="absolute top-2 left-2  duration-300 w-12 h-12 rounded-full bg-[#E97171]
     text-white max-[500px]:h-9 max-[500px]:w-9 max-[500px]:text-[12px]
    "
    >
      -{percent}%
    </button>
  );
};

export default React.memo(Discount);
