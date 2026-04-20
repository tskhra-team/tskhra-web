import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MOCK_PRODUCTS } from "./ProductCatalog";

const DOT_GAP = 28;
const DOT_RADIUS = 1.2;
const GLOW_RADIUS = 120;

function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const animFrame = useRef<number | undefined>(undefined);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const mx = mouse.current.x;
    const my = mouse.current.y;

    const cols = Math.ceil(width / DOT_GAP) + 1;
    const rows = Math.ceil(height / DOT_GAP) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * DOT_GAP;
        const y = r * DOT_GAP;

        const dist = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);
        const proximity = Math.max(0, 1 - dist / GLOW_RADIUS);

        // Base opacity + glow boost near cursor
        const alpha = 0.12 + proximity * 0.7;
        // Slight scale-up near cursor
        const radius = DOT_RADIUS + proximity * 2.5;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }
    }

    animFrame.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resize();
    window.addEventListener("resize", resize);
    animFrame.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [draw]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseLeave = () => {
    mouse.current = { x: -1000, y: -1000 };
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 w-full h-full z-1"
    />
  );
}

export default function HeroSection() {
  const { t } = useTranslation("ecommerce");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredProducts = debouncedQuery.trim().length >= 2
    ? MOCK_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsDropdownOpen(false);
      navigate(`/ecommerce/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProductClick = (productId: number) => {
    setIsDropdownOpen(false);
    setSearchQuery("");
    navigate(`/ecommerce/product/${productId}`);
    window.scrollTo(0, 0);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="relative py-14 sm:py-20 lg:py-24 bg-[#0f0f2d]">
      {/* Interactive dot grid */}
      <div className="absolute inset-0 overflow-hidden">
        <DotGrid />
      </div>

      {/* Subtle glow accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-125 h-125 bg-[#1a1a4e]/60 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-[#1e1e50]/40 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-14 text-center">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
          {t("hero.title")}
        </h1>
        <p className="text-base sm:text-lg text-[#a0a0c0] max-w-xl mx-auto mb-10">
          {t("hero.subtitle")}
        </p>

        <div ref={searchRef} className="max-w-xl mx-auto relative z-50">
          <form onSubmit={handleSearch}>
            <div className={`relative flex items-center bg-white shadow-lg ${isDropdownOpen && filteredProducts.length > 0 ? "rounded-t-2xl" : "rounded-full"}`}>
              <Search className="absolute left-4 w-5 h-5 text-[#0f0f2d]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder={t("hero.searchPlaceholder")}
                className="w-full py-3.5 sm:py-4 pl-12 pr-28 sm:pr-36 bg-transparent text-[#0f0f2d] placeholder:text-[#0f0f2d]/60 placeholder:truncate focus:outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-5 sm:px-6 py-2 sm:py-2.5 bg-[#0f0f2d] hover:bg-[#1a1a4e] text-white font-semibold rounded-full transition-colors duration-200 text-sm cursor-pointer"
              >
                <Search className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">{t("hero.title")}</span>
              </button>
            </div>
          </form>

          {/* Search Results Dropdown */}
          {isDropdownOpen && filteredProducts.length > 0 && (
            <div className="absolute left-0 right-0 bg-white rounded-b-2xl shadow-lg max-h-80 overflow-y-auto z-50 border-t border-slate-100">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#0f0f2d] truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-[#0f0f2d]/50">
                      {product.category}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#0f0f2d] shrink-0">
                    {product.price}₾
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
