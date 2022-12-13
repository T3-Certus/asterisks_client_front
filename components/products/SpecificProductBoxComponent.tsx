import Image from "next/image"
import Link from "next/link"
import { FunctionComponent } from "react"
import { SpecificProductBoxProps } from "../../utils"
import { IndividualProductDataExtractor } from "../../utils/business/individualDataExtractor"

const SpecificProductBox: FunctionComponent<SpecificProductBoxProps> = (product) => {
  const individuals = product.individuals
  console.log("Individuals => ", individuals)
  const { maxDiscount, mostCheap, mostCheapWoDiscount, mostExpensive } = IndividualProductDataExtractor(individuals)

  return (
    <Link href={`/catalogo/${product.category}/${product.sku}`}>
      <a>
        <div className={`hover:brightness-105 w-full shadow-lg h-60% brightness-100 flex flex-col justify-end rounded-2xl`}>
          <Image layout="fill" objectFit="cover" className="rounded-2xl" alt="" src={individuals[0].product_url_img[0]} />
          <div className="z-10 grid w-full h-24 grid-cols-4 rounded-b-2xl hover:cursor-pointer bg-green">
            <div className="flex flex-col justify-center col-span-3 col-start-1 px-4 font-normal ">
              <span className=" text-charleston font-Comfortaa">
                {product.name}
              </span>
              <div className="flex gap-4">
                <span className="font-extrabold text-charleston font-Comfortaa">
                  {mostExpensive ? `Desde: ${mostCheap}` : `${mostCheap}`}
                </span>
                {
                  maxDiscount ? (
                    <div className="px-1 bg-red-600 rounded-md ">
                      <span className="text-xs text-ivory">-%{maxDiscount}</span>
                    </div>
                  ) : (<></>)
                }
              </div>
              {
                mostCheapWoDiscount ? (
                  <span className="text-sm font-light line-through text-charleston font-Comfortaa">
                    {mostCheapWoDiscount}
                  </span>

                ) : (<></>)
              }
            </div>
            <div className="flex flex-col justify-center pl-2 text-sm font-bold bg-charleston hover:bg-teal rounded-br-2xl text-ivory">Lo quiero</div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default SpecificProductBox