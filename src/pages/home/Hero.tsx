const Hero = () => {
  return (
    <div className="relative bg-hero-image bg-cover bg-center font-poppins h-[716px] lg:h-[650px] md:h-[500px] sm:h-[400px] max-sm:h-[320px]">
      <div className="absolute inset-0 bg-black opacity-0 dark:opacity-50"></div>
      <div className="flex items-center container justify-end max-lg:justify-center h-full relative z-10">
        <div className="text-start bg-white dark:bg-zinc-900 dark:bg-opacity-75 bg-opacity-70 p-8 max-sm:p-4 rounded-lg max-w-lg lg:max-w-md md:max-w-sm sm:max-w-xs max-sm:max-w-[90%]">
          <h4 className="text-sm text-gray-400 uppercase mb-4 max-sm:text-xs max-sm:mb-2">
            New Arrival
          </h4>
          <h1 className="text-5xl lg:text-4xl md:text-3xl sm:text-2xl max-sm:text-xl leading-[65px] lg:leading-[50px] md:leading-[40px] sm:leading-[35px] max-sm:leading-[30px] font-bold text-yellow-600 mb-6 max-sm:mb-3">
            Discover Our New Collection
          </h1>
          <p className="text-gray-400 mb-6 text-xl lg:text-lg md:text-base sm:text-sm max-sm:text-xs max-sm:mb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis.
          </p>
          <button className="w-[210px] h-[60px] max-sm:text-[9px] lg:w-[180px] lg:h-[50px] md:w-[160px] md:h-[45px] sm:w-[140px] sm:h-[40px] max-sm:w-[100px] max-sm:h-[25px] bg-bg-primary text-white px-6 py-3 max-sm:px-2 max-sm:py-1 font-bold text-base max-sm:text-xs rounded-sm hover:bg-yellow-700 duration-300 max-sm:font-medium">
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
