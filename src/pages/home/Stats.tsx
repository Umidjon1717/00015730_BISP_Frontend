import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 500,   suffix: "+",  label: "Premium Products",   sub: "Curated for your home" },
  { value: 15000, suffix: "+",  label: "Happy Customers",    sub: "Across 40+ countries" },
  { value: 50,    suffix: "+",  label: "Room Inspirations",  sub: "Designed by experts" },
  { value: 12,    suffix: " yr", label: "Years of Craft",    sub: "Since 2013" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="py-14 bg-[#B88E2F]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
          {stats.map(({ value, suffix, label, sub }) => (
            <div key={label} className="flex flex-col items-center">
              <p className="text-4xl md:text-5xl font-extrabold tracking-tight mb-1">
                <CountUp target={value} suffix={suffix} />
              </p>
              <p className="text-base font-semibold opacity-95">{label}</p>
              <p className="text-xs opacity-70 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
