import { Package, Handshake, Users, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const STATS = [
  { key: "totalItems", icon: Package, value: 24_500, suffix: "+" },
  { key: "totalTrades", icon: Handshake, value: 18_200, suffix: "+" },
  { key: "totalUsers", icon: Users, value: 12_800, suffix: "+" },
  { key: "satisfaction", icon: TrendingUp, value: 98.5, suffix: "%" },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!start) return;

    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      setCount(
        isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current)
      );

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, start]);

  return count;
}

function StatCard({
  stat,
  inView,
}: {
  stat: (typeof STATS)[number];
  inView: boolean;
}) {
  const { t } = useTranslation("ecommerce");
  const count = useCountUp(stat.value, 2000, inView);

  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
        <stat.icon className="w-5 h-5 text-white/80" strokeWidth={1.5} />
      </div>
      <div className="text-3xl sm:text-4xl font-bold text-white mb-1 tabular-nums">
        {count.toLocaleString()}
        {stat.suffix}
      </div>
      <div className="text-white/40 text-sm font-medium">
        {t(`stats.${stat.key}`)}
      </div>
    </div>
  );
}

export default function StatsCounter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-14 bg-[#0f0f2d]"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {STATS.map((stat) => (
            <StatCard key={stat.key} stat={stat} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
