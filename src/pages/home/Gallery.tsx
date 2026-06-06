import ins1 from "@/assets/images/ins1.png";
import ins2 from "@/assets/images/inst2.png";
import ins3 from "@/assets/images/inst3.png";
import dining from "@/assets/images/diningImage.png";
import living from "@/assets/images/livingImage.png";
import bedroom from "@/assets/images/bedroomImage.png";
import extra from "@/assets/images/image.png";

const items = [
  { src: ins1,    label: "Living Room",    span: "col-span-2 row-span-2" },
  { src: bedroom, label: "Bedroom",        span: "col-span-1 row-span-1" },
  { src: ins3,    label: "Master Suite",   span: "col-span-1 row-span-2" },
  { src: dining,  label: "Dining Area",    span: "col-span-1 row-span-1" },
  { src: extra,   label: "Study Corner",   span: "col-span-1 row-span-1" },
  { src: living,  label: "Lounge",         span: "col-span-2 row-span-1" },
  { src: ins2,    label: "Cozy Bedroom",   span: "col-span-1 row-span-1" },
];

export default function Gallery() {
  return (
    <section className="py-16 bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-[#B88E2F] uppercase tracking-widest mb-2">
            #FurnishingsLife
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Share Your Setup
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Tag us on social media and get featured. Here's what our community is creating.
          </p>
        </div>

        {/* Masonry grid */}
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(3, 200px)",
          }}
        >
          {items.map(({ src, label, span }, i) => (
            <div
              key={i}
              className={`${span} overflow-hidden rounded-2xl relative group cursor-pointer`}
            >
              <img
                src={src}
                alt={label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                style={{ minHeight: "100%", transform: "scale(1)" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end p-4">
                <span className="text-white font-semibold text-sm translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="text-gray-400 dark:text-gray-500 text-sm">Follow us on</span>
          {["Instagram", "Pinterest", "TikTok"].map(name => (
            <span
              key={name}
              className="text-sm font-semibold text-[#B88E2F] hover:underline cursor-pointer"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
