import { useNavigate } from "react-router-dom";

type SectionStyles = {
  bg: string;
  hoverBg: string;
  text: string;
  textDark: string;
  glow: string;
};

type Section = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  styles: SectionStyles;
};

type SectionCardProps = {
  section: Section;
  isActive: boolean;
  onMouseEnter: () => void;
};

export default function SectionCard({
  section,
  isActive,
  onMouseEnter,
}: SectionCardProps) {
  const navigate = useNavigate();
  return (
    <div
      onMouseEnter={onMouseEnter}
      className={`
        relative overflow-hidden transition-all duration-700 ease-in-out cursor-pointer
        rounded-3xl flex flex-col group
        ${isActive ? "flex-4 p-16 shadow-2xl" : "flex-1 p-6 shadow-lg hover:shadow-xl"}
        bg-linear-to-br from-white/95 to-white/80 backdrop-blur-xl
        border-2 ${isActive ? "border-white/60" : "border-white/40"}
      `}
    >
      {/* Animated Background Gradient */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${section.styles.glow} to-transparent transition-all duration-700 ${isActive ? "opacity-20" : "opacity-5"}`}
      />

      {/* Subtle Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div
        className={`relative z-10 h-full flex ${isActive ? "flex-col justify-center text-left" : "items-center justify-center"}`}
      >
        {/* Expanded Content */}
        <div
          className={`transition-all duration-700 ease-out ${isActive ? "opacity-100 translate-x-0 delay-200" : "opacity-0 -translate-x-10 pointer-events-none absolute"}`}
        >
          <div className="mb-3">
            <div
              className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${section.styles.bg} text-white shadow-lg`}
            >
              {section.id}
            </div>
          </div>
          <h2
            className={`text-5xl font-black mb-6 tracking-tight ${section.styles.text} drop-shadow-sm`}
          >
            {section.title}
          </h2>
          <p className="text-lg mb-10 max-w-lg text-slate-700 leading-relaxed font-medium">
            {section.description}
          </p>
          <button
            onClick={() => navigate(`/${section.id}`)}
            className={`
              group/btn px-12 py-4 ${section.styles.bg} ${section.styles.hoverBg}
              text-white font-bold rounded-2xl shadow-xl
              hover:shadow-2xl hover:scale-105 hover:-translate-y-1
              transition-all duration-300 ease-out
              relative overflow-hidden
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              {section.buttonText}
              <svg
                className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          </button>
        </div>

        {/* Vertical Label (Collapsed State) */}
        <div
          className={`transition-all duration-500 ease-in-out ${!isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 absolute"}`}
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          <span
            className={`text-3xl tracking-[0.5em] font-black uppercase whitespace-nowrap ${section.styles.text} drop-shadow-sm`}
          >
            {section.title}
          </span>
        </div>
      </div>

      {/* Shine Effect on Hover */}
      <div
        className={`absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none ${isActive ? "opacity-0" : ""}`}
      />
    </div>
  );
}
