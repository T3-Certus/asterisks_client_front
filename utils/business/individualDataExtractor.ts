import { PEN } from "@dinero.js/currencies";
import { allocate, dinero } from "dinero.js";

export function IndividualProductDataExtractor(
  individuals: any[],
  isIndividualMenu = false,
  selectedColor?: string
) {
  let prices: number[] = [];
  let discounts: number[] = [];
  let mostCheapWoDiscount;
  let mostCheap;
  let mostExpensive;
  let maxDiscount;

  let colors: string[] = [];
  let sizes: string[] = [];
  let colorSizes: any[] = [];
  // let sizes: ProductSize[] = []

  const transformer = (amount: number) => {
    let amountString = amount.toString();
    return `S/. ${amountString.substring(0, amountString.length-2)}.${amountString.substring(amountString.length-2)}`
  };

  function fillArrays() {
    for (let i = 0; i <= individuals.length; i++) {
      if (individuals[i]) {
        prices.push(individuals[i].product_price);
        discounts.push(individuals[i].percent_discount);
      }
    }
  }

  function minPrice() {
    fillArrays();
    maxDiscount = Math.max(...discounts);

    // si no hay descuentos
    if (maxDiscount == 0) {
      let mostCheapValue = Math.min(...prices);
      // mostCheap =  toFormat(dinero({amount: mostCheapValue, currency:PEN}), transformer)
      mostCheap = transformer(mostCheapValue);

      if (mostCheapValue != Math.max(...prices)) {
        // mostExpensive = toFormat(dinero({amount: Math.max(...prices), currency: PEN}), transformer)
        mostExpensive = transformer(Math.max(...prices));
      }
    } else {
      // si hay descuentos
      let maxDiscountIndex = discounts.indexOf(maxDiscount);
      console.log(prices);
      // let pre = prices.at(maxDiscountIndex)
      let pre = prices[maxDiscountIndex];
      let preDiscountPrice = Number(pre);
      // mostCheapWoDiscount = toFormat(dinero({amount: preDiscountPrice!, currency: PEN}), transformer)
      mostCheapWoDiscount = transformer(preDiscountPrice);
      // let [mostCheapWDiscount] = allocate(dinero({amount: preDiscountPrice!, currency: PEN}), [100-maxDiscount, maxDiscount])
      let mostCheapWDiscount = preDiscountPrice * ((100 - maxDiscount) / 100);

      // si los precios son distintos
      if (preDiscountPrice != Math.max(...prices)) {
        // mostExpensive = toFormat(dinero({amount: Math.max(...prices), currency: PEN}), transformer)
        mostExpensive = transformer(Math.max(...prices));
        // mostCheap = toFormat(mostCheapWDiscount, transformer)
        mostCheap = transformer(Number(mostCheapWDiscount));
      }

      // sino
      // mostCheap = toFormat(mostCheapWDiscount, transformer)
      mostCheap = transformer(Number(mostCheapWDiscount));
    }
  }

  function filterColors() {
    individuals.map(({ product_color }: any) => {
      if (!colors.includes(product_color.name)) {
        colors.push(product_color.name);
      }
    });

    console.log(colors);
  }

  function filterSizesByColor() {
    console.log({ selectedColor });
    colorSizes = individuals.filter((product) => {
      return product.product_color.name == selectedColor;
    });
    colorSizes.map(({ product_size }) => {
      if (!sizes.includes(product_size.name)) {
        sizes.push(product_size.name);
      }
    });
  }

  if (!isIndividualMenu) {
    if (individuals) {
      minPrice();
      console.log({
        mostCheap,
        mostCheapWoDiscount,
        mostExpensive,
        maxDiscount,
      });
    }
  } else {
    filterColors();
    filterSizesByColor();
    console.log({ colorSizes });
  }

  return {
    mostCheap,
    mostCheapWoDiscount,
    mostExpensive,
    maxDiscount,
    colors,
    sizes,
    colorSizes
  };
}
