import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const features = [
  {
    Icon: Truck,
    title: "Free Shipping",
    desc: "Complimentary delivery on all orders over $499. No hidden fees, ever.",
  },
  {
    Icon: RotateCcw,
    title: "Easy Returns",
    desc: "Changed your mind? Return any item within 30 days — no questions asked.",
  },
  {
    Icon: ShieldCheck,
    title: "Quality Guarantee",
    desc: "Every piece passes our strict quality checks before it reaches your door.",
  },
  {
    Icon: Headphones,
    title: "24 / 7 Support",
    desc: "Our interior design experts are available round the clock to assist you.",
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-[#FAF6F1] dark:bg-zinc-900 border-y border-[#F0E9DE] dark:border-zinc-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E8DDD0] dark:divide-zinc-700">
          {features.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center px-8 py-8 gap-4 group"
            >
              <div className="w-14 h-14 rounded-full border-2 border-[#B88E2F] flex items-center justify-center group-hover:bg-[#B88E2F] transition-colors duration-300">
                <Icon
                  className="w-6 h-6 text-[#B88E2F] group-hover:text-white transition-colors duration-300"
                  strokeWidth={1.6}
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1.5">
                  {title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
