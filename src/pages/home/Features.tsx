import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const features = [
  {
    Icon: Truck,
    title: "Free Shipping",
    desc: "Complimentary delivery on all orders over $499. No hidden fees, ever.",
    bg: "bg-amber-50 dark:bg-amber-950/20",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600",
  },
  {
    Icon: RotateCcw,
    title: "Easy Returns",
    desc: "Changed your mind? Return any item within 30 days — no questions asked.",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600",
  },
  {
    Icon: ShieldCheck,
    title: "Quality Guarantee",
    desc: "Every piece passes our strict quality checks before it reaches your door.",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600",
  },
  {
    Icon: Headphones,
    title: "24 / 7 Support",
    desc: "Our interior design experts are available round the clock to assist you.",
    bg: "bg-violet-50 dark:bg-violet-950/20",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600",
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#B88E2F] uppercase tracking-widest mb-2">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            The Furnishings Promise
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            We go beyond just furniture — we deliver an experience rooted in quality, trust, and service.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ Icon, title, desc, bg, iconBg, iconColor }) => (
            <div
              key={title}
              className={`${bg} rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300`}
            >
              <div className={`${iconBg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <Icon className={`${iconColor} w-6 h-6`} strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
