import React, { useEffect, useState } from "react";
import { useGetProductsQuery } from "../../redux/api/product-api";
import Products from "../../components/products/Products";
import { Pagination } from "@mui/material";
import Hero from "../../components/hero/Hero";
import "./Shop.scss";
import Filter from "./Filter";
import { useDarkMode } from "../../context/DarkModeProvider";
import Info from "../../components/info/Info";
import { useParamsHook } from "@/hooks/useParamsHook";
import Skeleton from "@/components/products/Skeleton";

const Shop = () => {
  const { setParam, getParam, removeParam } = useParamsHook();
  const page = Number(getParam("page")) || 1;
  const sortBy = getParam("sort") || "newest";
  const limit = Number(getParam("limit")) || 12;

  const { data, isLoading } = useGetProductsQuery({
    limit,
    page,
    ...(sortBy === "cheapest" || sortBy === "expensive"
      ? { priceOrder: sortBy === "cheapest" ? "asc" : "desc" }
      : sortBy === "newest" || sortBy === "oldest"
      ? { order: sortBy === "oldest" ? "asc" : "desc" }
      : {}),
  });

  const [grid, setGrid] = useState(
    JSON.parse(localStorage.getItem("grid") || "true")
  );

  const setLimit = (value: number) => {
    if (value === 12) {
      removeParam("limit");
    } else {
      setParam("limit", value);
    }
  };
  const setSortBy = (value: string) => {
    if (value === "newest") {
      removeParam("sort");
    } else {
      setParam("sort", value);
    }
  };

  useEffect(() => {
    localStorage.setItem("grid", JSON.stringify(grid));
  }, [grid]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    event.preventDefault();
    if (value === 1) {
      removeParam("page");
    } else {
      setParam("page", value);
    }
  };

  const { isDarkMode } = useDarkMode();

  return (
    <>
      <Hero title="Shop" path="/shop" />
      {data && (
        <Filter
          sortBy={sortBy}
          data={data}
          page={page}
          setGrid={setGrid}
          setLimit={setLimit}
          setSortBy={setSortBy}
        />
      )}
      <section>
        {isLoading ? (
          <Skeleton grid={grid} count={limit} />
        ) : data ? (
          <Products grid={grid} data={data?.data?.products} />
        ) : (
          <></>
        )}

        {!isLoading && (
          <div className="flex justify-center">
            <Pagination
              count={data?.data?.totalPages}
              shape="rounded"
              page={page}
              onChange={handlePageChange}
              sx={{
                "& .MuiPagination-ul": {
                  display: "flex",
                  gap: "20px",
                  justifyContent: "center",
                  "& .Mui-selected": {
                    backgroundColor: isDarkMode ? "#B88E2F" : "#B88E2F",
                    color: "#fff",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  },
                },
                "& .MuiPaginationItem-root": {
                  backgroundColor: isDarkMode ? "#333" : "#F9F1E7",
                  color: isDarkMode ? "#fff" : "#000",
                  borderRadius: "10px",
                  fontSize: "18px",
                  height: "50px",
                  width: "50px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#E0C097",
                    color: "#fff",
                  },
                },
                "@media (max-width: 600px)": {
                  "& .MuiPaginationItem-root": {
                    fontSize: "14px",
                    height: "40px",
                    width: "40px",
                    borderRadius: "8px",
                  },
                  "& .MuiPagination-ul": {
                    gap: "10px",
                  },
                },
              }}
            />
          </div>
        )}
      </section>
      <Info />
    </>
  );
};

export default React.memo(Shop);
