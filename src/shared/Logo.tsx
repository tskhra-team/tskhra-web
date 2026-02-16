import { Link } from "react-router-dom";

export default function Logo({ color = "black" }: { color?: string }) {
  return (
    <Link to="/" className={`font-bold text-2xl`} style={{ color }}>
      TSKHRA
    </Link>
  );
}
