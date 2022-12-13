import Link from "next/link";
import Image from "next/image";
import { FunctionComponent } from "react";
import { ProductCategoryBoxProps } from "../../utils";

const ProductBoxComponent: FunctionComponent<ProductCategoryBoxProps> = (product) => {
  const background = product.imgKey
  return (
      <Link href={`/catalogo/${product.href}`}>
        <a>
          <div className={`hover:brightness-105 w-full shadow-lg h-60% brightness-100 flex flex-col justify-end rounded-2xl`}>
            <Image layout="fill" objectFit="cover" className="rounded-2xl" alt="" src={background}/>
            <div className="z-10 flex flex-col items-center justify-center w-full h-14 rounded-b-2xl hover:cursor-pointer bg-green">
              <span className="font-bold text-charleston font-Comfortaa">
                {product.name}
              </span>
            </div>
          </div>
        </a>
      </Link>
  );
}

export default ProductBoxComponent;