"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const QuantitySelector = () => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="font-medium">Quantidade</div>
      <div className="flex w-[100px] items-center justify-between rounded-lg border">
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer"
          onClick={handleDecrement}
        >
          <MinusIcon />
        </Button>
        <p className="font-semibold">{quantity}</p>
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer"
          onClick={handleIncrement}
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
