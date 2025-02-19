import { useState } from "react";

export const useOrderStore = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  const addItem = (id: number) => {
    setSelectedItems((prev) => [...prev, id]);
  };

  const removeItem = (id: number) => {
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  return { selectedItems, addItem, removeItem, clearSelection };
};
