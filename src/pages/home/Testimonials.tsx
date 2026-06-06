import sitora from "@/assets/images/Sitora.jpg";
import jahongir from "@/assets/images/Jahongir.jpg";
import umidjon from "@/assets/images/Umidjon.jpg";

const reviews = [
  {
    name: "Sitora Karimova",
    role: "Interior Designer",
    avatar: sitora,
    rating: 5,
    text: "The quality of furniture from Furnishings is absolutely incredible. Every piece I've ordered has exceeded my expectations. My clients are always blown away by the results!",
    tag: "Living Room Set",
  },
  {
    name: "Jahongir Toshmatov",
    role: "Homeowner",
    avatar: jahongir,
    rating: 5,
    text: "I redecorated my entire home with pieces from Furnishings. The craftsmanship is top-notch, delivery was faster than expected, and the customer service team was amazing.",
    tag: "Full Bedroom Collection",
  },
  {
    name: "Umid Yusupov",
    role: "Architect",
    avatar: umidjon,
    rating: 5,
    text: "As an architect, I recommend Furnishings to all my clients. The attention to detail and material quality is unmatched. The 3D Room Builder tool is a game-changer!",
    tag: "Office & Study",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill={i < n ? "#B88E2F" : "#e5e7eb"} className="w-4 h-4">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 bg-[#FAF7F2] dark:bg-zinc-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#B88E2F] uppercase tracking-widest mb-2">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Real stories from real people who transformed their homes with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {reviews.map(({ name, role, avatar, rating, text, tag }) => (
            <div
              key={name}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-7 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-zinc-700"
            >
              {/* Quote mark */}
              <svg viewBox="0 0 40 32" fill="#B88E2F" className="w-8 h-8 opacity-20">
                <path d="M0 32V19.2C0 8.533 5.333 2.4 16 0l2.4 4C13.067 5.333 10.4 8.8 10.4 12.8H16V32H0zm24 0V19.2C24 8.533 29.333 2.4 40 0l2.4 4C37.067 5.333 34.4 8.8 34.4 12.8H40V32H24z" />
              </svg>

              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1">
                "{text}"
              </p>

              <span className="inline-block self-start bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">
                {tag}
              </span>

              <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-zinc-700">
                <img
                  src={avatar}
                  alt={name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{name}</p>
                  <p className="text-gray-400 text-xs">{role}</p>
                </div>
                <Stars n={rating} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
