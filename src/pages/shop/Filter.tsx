import { FC, memo } from "react";
import { BsViewList } from "react-icons/bs";
import { GiSettingsKnobs } from "react-icons/gi";
import { PiCirclesFourFill } from "react-icons/pi";
import { IGetResponseProducts } from "../../types";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useDarkMode } from "../../context/DarkModeProvider";

interface IFilterProps {
  setGrid: (value: boolean) => void;
  setLimit: (value: number) => void;
  setSortBy: (value: string) => void;
  data: IGetResponseProducts;
  page: number;
  sortBy: string;
}

const Filter: FC<IFilterProps> = ({
  setGrid,
  data,
  page,
  setLimit,
  setSortBy,
  sortBy,
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`p-4 rounded-lg shadow-md ${
        isDarkMode ? "bg-zinc-800" : "bg-[#F9F1E7]"
      }`}
    >
      <div className="container flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4 sm:gap-2">
          <button
            className={`flex items-center gap-2 duration-300 ${
              isDarkMode ? "text-white" : "text-gray-700"
            } hover:text-primary`}
          >
            <GiSettingsKnobs className="w-6 h-6 sm:w-5 sm:h-5" />
            <span className="text-xl max-sm:text-sm font-medium">Filter</span>
          </button>
          <button
            className={`p-2 rounded-lg transition ${
              isDarkMode ? "hover:bg-zinc-700" : "hover:bg-gray-300"
            }`}
            onClick={() => setGrid(true)}
          >
            <PiCirclesFourFill className="w-6 h-6 max-sm:w-5 max-sm:h-5" />
          </button>
          <button
            className={`p-2 rounded-lg transition ${
              isDarkMode ? "hover:bg-zinc-700" : "hover:bg-gray-300"
            }`}
            onClick={() => setGrid(false)}
          >
            <BsViewList className="w-6 h-6 max-sm:w-5 max-sm:h-5" />
          </button>
        </div>

        <p
          className={`text-lg max-sm:text-xs ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Showing {page}–{data?.data?.limit} of {data?.data?.total} results
        </p>

        <div className="flex flex-wrap gap-4 sm:gap-2 items-center">
          <div className="flex items-center gap-2">
            <span
              className={`text-lg max-sm:text-sm ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Show
            </span>
            <Box sx={{ minWidth: 100 }}>
              <FormControl fullWidth>
                <Select
                  className={`${
                    isDarkMode ? "bg-zinc-700 dark:text-white text-white" : ""
                  }`}
                  value={data?.data?.limit || 12}
                  onChange={(e: SelectChangeEvent<number>) =>
                    setLimit(Number(e.target.value))
                  }
                >
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-lg max-sm:text-xs ${
                isDarkMode ? "text-white dark:text-white" : "text-black"
              }`}
            >
              Sort by
            </span>
            <Box sx={{ minWidth: 150 }}>
              <FormControl fullWidth>
                <Select
                  className={`${
                    isDarkMode ? "bg-zinc-700 dark:text-white text-white" : ""
                  }`}
                  defaultValue="newest"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="cheapest">Cheapest</MenuItem>
                  <MenuItem value="expensive">Most Expensive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Filter);
