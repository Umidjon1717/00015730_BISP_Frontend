import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import ins1 from "@/assets/images/ins1.png";
import ins2 from "@/assets/images/inst2.png";
import ins3 from "@/assets/images/inst3.png";
import "./Insparation.scss";

SwiperCore.use([Navigation, Pagination, EffectCoverflow]);

const Insparation = () => {
  const images = [
    {
      src: ins1,
      title: "Modern Living Room",
    },
    {
      src: ins2,
      title: "Minimalist Bedroom",
    },
    {
      src: ins3,
      title: "Elegant Dining Area",
    },
  ];

  return (
    <div id="inspiration" className="bg-[#FCF8F3]  dark:bg-zinc-900 py-16">
      <div className="container mx-auto flex flex-col items-center lg:flex-row  lg:items-center lg:justify-between gap-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center lg:text-left lg:w-1/2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl max-[620px]:text-xl font-bold text-gray-800 dark:text-white mb-4">
            50+ Beautiful Rooms Inspiration
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-base max-[620px]:text-sm leading-relaxed mb-6">
            Our designers have crafted a variety of beautiful room prototypes to
            inspire your next space transformation.
          </p>
          <button className="bg-[#B88E2F] hover:bg-[#9C792A] text-white py-3 px-6 rounded-md shadow-md font-medium transition-all">
            Explore More
          </button>
        </div>

        <div className="w-full lg:w-1/2">
          <Swiper
            effect="coverflow"
            centeredSlides={true}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2 },
            }}
            navigation
            pagination={{ clickable: true }}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            className="w-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative group">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="rounded-lg dark:opacity-70 shadow-lg w-[500px] max-[400px]:w-[200px] max-[640px]:w-[250px] transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-10 left-5 w-[90%] bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center px-6 py-4 rounded-lg">
                    <div className="text-black dark:text-white">
                      <p className="text-sm mb-1 max-[400px]:text-[12px] text-gray-700 dark:text-gray-300">
                        01 - Bed Room
                      </p>
                      <h3 className="text-lg font-bold max-[400px]:text-[13px] text-gray-900 dark:text-white">
                        Inner Peace
                      </h3>
                    </div>
                    <button className="ml-auto bg-[#B88E2F] hover:bg-[#9C792A] max-[400px]:py-1 max-[400px]:px-2 text-white py-2 px-4 rounded shadow-md transition-all">
                      →
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Insparation;
