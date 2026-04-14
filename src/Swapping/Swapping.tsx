import { AvailableTrades } from "@/Swapping/AvailableTrades";
import { CategoryGrid } from "@/Swapping/CategoryGrid";
import SwapHero from "@/Swapping/Hero/SwapHero";
import { SwapSearch } from "@/Swapping/SwapSearch";

export default function Swapping() {
  return (
    <>
      <SwapHero />
      <SwapSearch />
      <AvailableTrades />
      <CategoryGrid />
    </>
  );
}
