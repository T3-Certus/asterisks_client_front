import { FunctionComponent } from "react";
import { ISizeSelector } from "../../utils";
import {useSelectedProduct} from "../../hooks/useSelectedProduct"

const SizeSelectorComponent: FunctionComponent<ISizeSelector> = ({ name, stock, colorSizes, disabled }) => {
  const { setSelectedSize} = useSelectedProduct()

  if (disabled) {
    return (
      <li
        className="text-center border-2 rounded-md cursor-pointer text-green border-green w-14 h-7"
      >
        {name}
      </li>
    )
  }

  return (
    <li
      onClick={() =>
        setSelectedSize(name)
      }
      className="text-center border-2 rounded-md cursor-pointer hover:bg-slate-400 border-charleston w-14 h-7"
    >
      {name}
    </li>
  )
}

export default SizeSelectorComponent