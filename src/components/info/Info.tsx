import trophy from "/assets/trophy 1.png";
import warranty from "/assets/guarantee.png";
import shipping from "/assets/shipping.png";
import c_support from "/assets/customer-support.png";

const Info = () => {
  return (
    <div className="bg-[#FAF3EA] dark:bg-zinc-800 font-poppins mt-20 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              img: trophy,
              title: "High Quality",
              desc: "Crafted from top materials",
            },
            {
              img: warranty,
              title: "Warranty Protection",
              desc: "Over 2 years",
            },
            { img: shipping, title: "Free Shipping", desc: "Order over $150" },
            {
              img: c_support,
              title: "24 / 7 Support",
              desc: "Dedicated support",
            },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-[60px] h-[60px] grid place-items-center dark:bg-white px-2 rounded-xl">
                <img src={item.img} alt={item.title} className="w-10 h-10" />
              </div>
              <div>
                <p className="text-[#242424] dark:text-white font-semibold text-lg lg:text-xl">
                  {item.title}
                </p>
                <p className="text-[#898989] font-medium text-sm lg:text-base">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Info;
