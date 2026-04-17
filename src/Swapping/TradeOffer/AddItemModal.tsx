import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";
import type { TradeItem } from "./TradeOffer";

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: TradeItem) => void;
}

const CONDITIONS = [
  { value: "NEW", label: "New" },
  { value: "LIKE_NEW", label: "Like New" },
  { value: "USED", label: "Used" },
  { value: "DAMAGED", label: "Damaged" },
] as const;

export function AddItemModal({ open, onOpenChange, onSubmit }: AddItemModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("NEW");
  const [estimatedValue, setEstimatedValue] = useState("");

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setCondition("NEW");
    setEstimatedValue("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newItem: TradeItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      image: "",
      estimatedValue: estimatedValue ? Number(estimatedValue) : null,
      condition,
      category: category.trim(),
    };

    onSubmit(newItem);
    resetForm();
    onOpenChange(false);
  };

  const isValid = name.trim().length >= 3 && category.trim().length >= 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-swap-primary" />
            Add New Item
          </DialogTitle>
          <DialogDescription>
            Add a new item to your inventory for trading.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="item-name">Item Name *</Label>
            <Input
              id="item-name"
              placeholder="e.g. Samsung Galaxy S24"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="item-description">Description</Label>
            <Input
              id="item-description"
              placeholder="Brief description of the item"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="item-category">Category *</Label>
            <Input
              id="item-category"
              placeholder="e.g. Electronics, Clothing"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label>Condition</Label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCondition(value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    condition === value
                      ? "bg-swap-primary text-white border-swap-primary"
                      : "bg-white text-swap-text2 border-gray-200 hover:border-swap-primary/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Value */}
          <div className="space-y-2">
            <Label htmlFor="item-value">Estimated Value (₾)</Label>
            <Input
              id="item-value"
              type="number"
              placeholder="0"
              min={0}
              step={0.01}
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="bg-swap-primary hover:bg-swap-primary/90 text-white"
            >
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
