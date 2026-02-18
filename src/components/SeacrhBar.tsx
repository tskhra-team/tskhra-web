// import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";

const placeholderMap: Record<string, string> = {
  "/ecommerce": "Search for products...",
  "/swapping": "What you want to switch?...",
  "/booking": "Book your favorite...",
};

export default function SearchBar() {
  const location = useLocation();
  const placeholder = placeholderMap[location.pathname];

  if (!["/ecommerce", "/swapping", "/booking"].includes(location.pathname))
    return;

  return (
    <Field orientation="horizontal" className="md:w-100 md:mr-30">
      <Input type="search" placeholder={placeholder} className="black" />
    </Field>
  );
}
