import React, { FC } from "react";
import { useLocation } from "react-router-dom";

const Skeleton: FC<{ grid?: boolean; count: number }> = ({
  grid,
  count = 12,
}) => {
  const { pathname } = useLocation();
  return (
    <div
      className={`grid container gap-8 my-10 max-[620px]:my-4 ${
        grid || !pathname.startsWith("/shop")
          ? "grid-cols-4  max-[1240px]:grid-cols-3 max-[990px]:grid-cols-2 max-[620px]:gap-2"
          : "max-w-[600px] mx-auto"
      } `}
    >
      {Array(count)
        .fill("")
        .map((_, inx) => (
          <div
            key={inx}
            className="relative overflow-hidden group rounded-lg shadow"
          >
            <div
              className={`relative w-full overflow-hidden bg-gray-200  ${
                grid || !pathname.startsWith("/shop")
                  ? "h-[301px] max-[620px]:h-[240px] max-[450px]:h-[200px]"
                  : "h-[500px] max-[620px]:h-[400px] max-[450px]:h-[300px]"
              } `}
            ></div>
            <div className="p-3">
                <div className="w-10/12 h-6  bg-gray-200 rounded"></div>
                <div className="w-8/12 mt-2 h-6  bg-gray-200 rounded"></div>
                <div className="w-6/12 mt-2 h-6  bg-gray-200 rounded"></div>

            </div>
          </div>
        ))}
    </div>
  );
};

export default React.memo(Skeleton);
