import type { ChainTradeLink } from "@/Swapping/MagicChain/types";

export default function MiniChainLinkNode({ link }: { link: ChainTradeLink }) {
  return (
    <div
      className={`shrink-0 px-3 py-2 rounded-lg border bg-white text-xs ${
        link.accepted ? "border-green-200" : "border-gray-200"
      }`}
    >
      <p className="font-semibold text-swap-text line-clamp-1 max-w-24">
        {link.itemName}
      </p>
      <div className="flex items-center gap-1 mt-1">
        <div
          className={`w-1.5 h-1.5 rounded-full ${link.accepted ? "bg-green-500" : "bg-amber-400"}`}
        />
        <span
          className={`text-[10px] ${link.accepted ? "text-green-600" : "text-amber-600"}`}
        >
          {link.accepted ? "✓" : "…"}
        </span>
      </div>
    </div>
  );
}
