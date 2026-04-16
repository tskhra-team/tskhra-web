import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/Swapping/ImageWithFallback";
import {
  ArrowRight,
  ArrowRightLeft,
  Clock,
  Crown,
  Heart,
  MapPin,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

// Mock data with images from unsplash
const TRADES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FtZXJhfGVufDF8fHx8MTc3NjEyNTkzOHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Electronics",
    title: "Canon AE-1 Vintage Camera",
    lookingFor: "Acoustic Guitar or Synth",
    user: "Sarah Jenkins",
    avatar:
      "https://images.unsplash.com/photo-1630939687530-241d630735df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBzbWlsaW5nfGVufDF8fHx8MTc3NjA3MTA5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    time: "2h ago",
    location: "Brooklyn, NY",
    color: "#c7522a",
    status: "VIP",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY291c3RpYyUyMGd1aXRhcnxlbnwxfHx8fDE3NzYxNTExMDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Music",
    title: "Yamaha Acoustic Guitar",
    lookingFor: "Espresso Machine",
    user: "David Ross",
    avatar:
      "https://images.unsplash.com/photo-1762708590808-c453c0e4fb0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwxfHx8fDE3NzYxMDI1NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    time: "5h ago",
    location: "Austin, TX",
    color: "#a31621",
    status: "VIP",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1506316940527-4d1c138978a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGJpa2V8ZW58MXx8fHwxNzc2MTAxMjA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Sports",
    title: "Trek Mountain Bike",
    lookingFor: "Gaming Laptop / iPad Pro",
    user: "Elena V.",
    avatar:
      "https://images.unsplash.com/photo-1630939687530-241d630735df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBzbWlsaW5nfGVufDF8fHx8MTc3NjA3MTA5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    time: "1d ago",
    location: "Denver, CO",
    color: "#8b7e74",
    status: null,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1582572426223-d152057ba012?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMG1hY2hpbmV8ZW58MXx8fHwxNzc2MTM1NzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Kitchen",
    title: "Breville Barista Express",
    lookingFor: "DJI Drone / Camera Gear",
    user: "Marcus T.",
    avatar:
      "https://images.unsplash.com/photo-1762708590808-c453c0e4fb0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwxfHx8fDE3NzYxMDI1NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    time: "2d ago",
    location: "Portland, OR",
    color: "#e5c185",
    status: null,
  },
];

export function AvailableTrades() {
  const navigate = useNavigate();
  return (
    <>
      <div className="px-8 md:px-20 text-3xl mb-10 font-bold flex justify-between items-center">
        <h1>Available Trades</h1>
        <Button
          variant="outline"
          className=" h-10 rounded-4xl bg-swap-primary text-swap-secondary hover:bg-swap-secondary hover:text-swap-primary"
          onClick={() => navigate("/swapping/catalog")}
        >
          View All
          <ArrowRight />
        </Button>
      </div>

      <div className="grid px-8 md:px-20 mb-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {TRADES.map((trade, idx) => (
          <motion.div
            key={trade.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: idx * 0.15 }}
            whileHover={{ y: -5 }}
            className={`rounded-3xl bg-white shadow-xl overflow-hidden border-2 flex flex-col group cursor-pointer ${
              trade.status === "VIP"
                ? "border-amber-400 shadow-amber-100"
                : "border-swap-secondary"
            }`}
          >
            {/* Image Header */}
            <div className="relative h-56 w-full overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                <ImageWithFallback
                  src={trade.image}
                  alt={trade.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-sm"
                  style={{ backgroundColor: trade.color }}
                >
                  {trade.category}
                </span>
                {trade.status === "VIP" && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 bg-linear-to-r from-amber-400 to-yellow-500 text-amber-900">
                    <Crown className="w-3 h-3" />
                    VIP
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-swap-primary transition-colors"
              >
                <Heart className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Details */}
            <div className="p-6 flex-1 flex flex-col">
              <h3
                className="text-lg mb-4 line-clamp-1"
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  color: "var(--swap-text)",
                }}
              >
                {trade.title}
              </h3>

              <div
                className="mb-6 p-4 rounded-xl relative flex-1"
                style={{ backgroundColor: "var(--swap-secondary)" }}
              >
                <div
                  className="text-xs uppercase font-bold tracking-wider mb-1"
                  style={{ color: "var(--swap-primary)" }}
                >
                  Looking For
                </div>
                <div
                  className="text-sm font-medium text-gray-800 line-clamp-2"
                  style={{ fontFamily: "'Work Sans', sans-serif" }}
                >
                  {trade.lookingFor}
                </div>
                <div className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                  <ArrowRightLeft
                    className="w-4 h-4"
                    style={{ color: "var(--swap-primary)" }}
                  />
                </div>
              </div>

              <Button
                className="bg-swap-primary hover:bg-swap-secondary hover:text-swap-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/swapping/trade-offer", {
                    state: {
                      targetItem: {
                        id: String(trade.id),
                        name: trade.title,
                        description: trade.lookingFor,
                        image: trade.image,
                        estimatedValue: null,
                        condition: "USED",
                        category: trade.category,
                      },
                    },
                  });
                }}
              >
                Make Offer
              </Button>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <ImageWithFallback
                    src={trade.avatar}
                    alt={trade.user}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--swap-text2)" }}
                  >
                    {trade.user}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-medium">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {trade.time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {trade.location}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
