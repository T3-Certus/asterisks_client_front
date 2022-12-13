import { useState } from "react";
import { regularSizes } from "../utils";

export function useSelectedProduct() {
  // const [color, setColor] = useState(String)
  // const [sizes, setSizes] = useState(regularSizes)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedSizeStock, setSelectedSizeStock] = useState(0)
  
  console.log(selectedSize)

  return {
    selectedSize, setSelectedSize
  }
}