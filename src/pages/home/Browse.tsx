import diningImg from "@/assets/images/diningImage.png";
import livingImg from "@/assets/images/livingImage.png";
import bedroomImg from "@/assets/images/bedroomImage.png";

const categories = [
  {
    id: 1,
    title: "Dining",
    img: diningImg,
  },
  {
    id: 2,
    title: "Living",
    img: livingImg,
  },
  {
    id: 3,
    title: "Bedroom",
    img: bedroomImg,
  },
];

const Browse = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-13 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Browse The Range
          </h2>
          <p className="text-[#666666] dark:text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mt-4">
            Explore different categories of furniture for your home.
          </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col items-center">
              <img
                className="w-full aspect-[4/5] object-cover rounded-lg"
                src={category.img || "/placeholder.svg"}
                alt={category.title}
              />
              <h3 className="text-[#333333] font-bold text-xl md:text-2xl dark:text-white mt-6 md:mt-8">
                {category.title}
              </h3>{" "}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Browse;
