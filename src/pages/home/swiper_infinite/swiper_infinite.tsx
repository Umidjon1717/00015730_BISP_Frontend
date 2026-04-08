import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";
import { FreeMode, Autoplay } from "swiper/modules";
import image from "@/assets/images/Images.svg";

const SwiperInfinite: React.FC = () => {
  const images = [image, image, image, image];

  return (
    <div className="w-full overflow-hidden  py-4">
      <div className="items-center text-center my-7">
        <p className="text-[#3A3A3A] dark:text-slate-200 mb-2 text-[20px]">
          Share your setup with
        </p>
        <h2 className="text-[#3A3A3A] dark:text-slate-200 text-[40px] font-semibold">
          #FuniroFurniture
        </h2>
      </div>
      <Swiper
        modules={[FreeMode, Autoplay]}
        spaceBetween={0}
        grabCursor={true}
        freeMode={true}
        speed={10000}
        loop={true}
        slidesPerView="auto"
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        breakpoints={{
          0: { spaceBetween: 5 },
          480: { spaceBetween: 5 },
          767: { spaceBetween: 10 },
          992: { spaceBetween: 10 },
        }}
        className="trusted-by-swiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="h-[721px] w-full max-[1050px]:h-[500px] max-[700px]:h-[400px] max-[600px]:h-[300px]"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperInfinite;
