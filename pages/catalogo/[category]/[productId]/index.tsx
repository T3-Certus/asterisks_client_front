import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ErrorComponent,
  FooterComponent,
  HeadLayoutComponent,
  NavbarComponent,
  SizeSelector,
  ProductOptionsPopup
} from "../../../../components";
import {
  AsterisksServices,
  PageProps,
  IndividualProductDataExtractor,
  capitalize,
  regularSizes,
} from "../../../../utils";

const IndividualProductMenu: NextPage<PageProps> = ({
  success,
  error,
  data,
}) => {
  console.log({ success, error, data });

  const [color, setColor] = useState(String);
  const [selectedSize, setSelectedSize] = useState({
    size: "",
    stock: 0,
    originalPrice: 0,
    discount: 0,
    individualCode: "",
    individualId: 0
  });

  useEffect(() => {
    if (!error) {
      setColor(colors[0]);
      setSelectedSize;
    }
  }, []);

  useEffect(() => {
    console.log({ selectedSize });
  }, [selectedSize]);

  if (error) {
    return <ErrorComponent data={data} />;
  }

  const globalProduct = data.product[0];
  const individuals = globalProduct.individual_products;
  console.log({ globalProduct, individuals });

  const { colors, sizes, colorSizes } = IndividualProductDataExtractor(
    individuals,
    true,
    color
  );
  console.log({ sizes, colors, colorSizes });

  // const transformer = ({ amount }: any) => `S/.${amount.toFixed(2)}`
  const transformer = (amount: number) => {
    let amountString = amount.toString();
    return `S/. ${amountString.substring(
      0,
      amountString.length - 2
    )}.${amountString.substring(amountString.length - 2)}`;
  };

  const discounter = (amount: number, discount: number) => {
    let discountedPrice = amount * ((100-discount)/100)
    return discountedPrice;
  };

  function showPopUp() {
    document.getElementById("popup")!.style.display = "grid";
  }

  return (
    <>
      <HeadLayoutComponent
        section={globalProduct.product_name}
        description=""
      />
      <NavbarComponent />
      <div className="w-full h-auto py-20 bg-ivory">
        {/* principal */}
        <section className="grid items-center w-full h-80% grid-cols-10 grid-rows-1 px-40 ">
          <div className="relative w-full h-full col-start-1 col-end-5 shadow-lg rounded-xl">
            <Image
              alt=""
              priority
              src={individuals[0].product_url_img[0]}
              className="rounded-xl"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
          </div>
          <div className="flex flex-col h-full col-start-7 col-end-11 justify-evenly">
            {/* name */}
            <h1 className="text-5xl font-Pacifico text-charleston">
              {globalProduct.product_name}
            </h1>
            <div className="flex gap-4">
              <p className="text-xl font-bold text-charleston font-Comfortaa">
                {!selectedSize.originalPrice
                  ? "Seleccione una talla"
                  : selectedSize.discount === 0
                  ? transformer(selectedSize.originalPrice)
                  : transformer(
                      Number(
                        discounter(
                          selectedSize.originalPrice,
                          selectedSize.discount
                        )
                      )
                    )}
              </p>
              {selectedSize.discount > 0 ? (
                <div className="px-1 bg-red-600 rounded-md ">
                  <span className="text-xs text-ivory">
                    -%{selectedSize.discount}
                  </span>
                </div>
              ) : (
                <></>
              )}
            </div>
            {selectedSize.discount > 0 ? (
              <div>
                <span className="text-sm font-light line-through text-charleston font-Comfortaa">
                  {/* {toFormat(dinero({ amount: selectedSize.originalPrice, currency: PEN }), transformer)} */}
                  {transformer(selectedSize.originalPrice)}
                </span>
              </div>
            ) : (
              <></>
            )}
            {/* colorSelected */}
            <div>
              <p className="text-base text-charleston font-Comfortaa">
                <span className="font-bold">Color:</span> {capitalize(color)}
              </p>
              {/* colors */}
              <div>
                <ul className="flex flex-row gap-4">
                  {colors.map((color) => (
                    <div
                      onClick={() => {
                        setColor(color);
                        setSelectedSize({
                          size: "",
                          stock: 0,
                          originalPrice: 0,
                          discount: 0,
                          individualCode: "",
                          individualId: 0
                        });
                      }}
                      className="flex flex-col items-center px-1 border-2 hover:cursor-pointer border-charleston"
                      key={color}
                    >
                      {/* <li className={`w-6 h-6 border-2 cursor-pointer hover:brightness-75 bg-${color} border-charleston rounded-3xl`}></li> */}
                      <p className="text-xs font-bold">{capitalize(color)}</p>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              {/* sizeSlected */}
              <p className="text-base text-charleston font-Comfortaa">
                <span className="font-bold">Talla:</span> {selectedSize.size}
              </p>

              <p className="text-base text-charleston font-Comfortaa">
                <span className="font-bold">SKU:</span>{" "}
                {selectedSize.individualCode}
              </p>
              {/* size */}
              <div>
                <ul className="flex flex-row gap-5">
                  {colorSizes.map((size) => (
                    <li
                      onClick={() =>
                        setSelectedSize({
                          size: size.product_size.name,
                          stock: size.product_stock,
                          originalPrice: Number(size.product_price),
                          discount: size.percent_discount,
                          individualCode: size.product_sku,
                          individualId: size.id_individual_product
                        })
                      }
                      key={size.product_size.name}
                      className="w-auto px-1 text-center border-2 rounded-md cursor-pointer hover:bg-slate-400 border-charleston h-7"
                    >
                      {size.product_size.name}
                    </li>
                  ))}

                  {/* {
                    sizes.includes("XS") ? (
                      <SizeSelector stock={colorSizes.find((product) => { product.product_size.name == "XS" }).map((product: any) => product.product_stock)} name="XS" />
                    ) : (
                      <SizeSelector disabled={true} name="XS" />
                    )
                  }
                  {
                    sizes.includes("Small") ? (
                      <SizeSelector stock={colorSizes.find((product) => { product.product_size.name == "Small" }).map((product: any) => product.product_stock)} name="S" />
                    ) : (
                      <SizeSelector disabled={true} name="S" />
                    )
                  }
                  {
                    sizes.includes("Medium") ? (
                      <SizeSelector colorSizes={colorSizes} name="M" />
                    ) : (
                      <SizeSelector disabled={true} name="M" />
                    )
                  }
                  {
                    sizes.includes("Large") ? (
                      <SizeSelector stock={colorSizes.find((product) => { product.product_size.name == "Large" }).map((product: any) => product.product_stock)} name="L" />
                    ) : (
                      <SizeSelector disabled={true} name="L" />
                    )
                  }
                  {
                    sizes.includes("XL") ? (
                      <SizeSelector stock={colorSizes.find((product) => { product.product_size.name == "XL" }).map((product: any) => product.product_stock)} name="XL" />
                    ) : (
                      <SizeSelector disabled={true} name="XL" />
                    )
                  }
                  {
                    sizes.includes("XXL") ? (
                      <SizeSelector stock={colorSizes.find((product) => { product.product_size.name == "XXL" }).map((product: any) => product.product_stock)} name="XXL" />
                    ) : (
                      <SizeSelector disabled={true} name="XXL" />
                    )
                  } */}
                </ul>
              </div>
            </div>
            <div>
              {/* details */}
              <p className="text-lg font-bold text-charleston font-Comfortaa">
                Características:
              </p>
              {/* detailsList */}
              <ul className="text-sm font-Comfortaa text-charleston">
                {/* <li>Modelo: {produc}</li> */}
                <li>
                  <span className="font-bold"> Tipo:</span>{" "}
                  {capitalize(globalProduct.product_category.name)}
                </li>
                <li>
                  <span className="font-bold">Material:</span>{" "}
                  {capitalize(globalProduct.product_material.name)}
                </li>
                <li>
                  <span className="font-bold">Temporada:</span>{" "}
                  {capitalize(globalProduct.product_season.name)}
                </li>
              </ul>
            </div>
            {/* stock */}
            <div>
              {!selectedSize.individualCode ? (
                <></>
              ) : (
                <p className="text-xs font-Comfortaa text-charleston">
                  Stock:{" "}
                  {selectedSize.stock
                    ? `${selectedSize.stock} unidad/es`
                    : "Sin stock"}
                </p>
              )}
              {/* selectOptions */}
              {!selectedSize.individualCode ? (
                <></>
              ) : selectedSize.stock <= 0 && selectedSize.individualCode ? (
                <p>PRODUCTO SIN STOCK</p>
              ) : (
                <button
                  onClick={() => showPopUp()}
                  className="flex flex-col items-center justify-center h-16 rounded-lg shadow-xl cursor-pointer hover:bg-teal bg-charleston w-80"
                >
                  <p className="text-lg font-Comfortaa text-ivory">
                    Elige tus opciones
                  </p>
                </button>
              )}

              <ProductOptionsPopup
                selectedColor={color}
                globalData={globalProduct}
                productImg={individuals[0].product_url_img[0]}
                selectedProduct={selectedSize}
              />
            </div>
          </div>
        </section>
      </div>
      <FooterComponent />
    </>
  );
};

export default IndividualProductMenu;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { category, productId } = context.params!;

  try {
    const product = await fetch(
      AsterisksServices.ms_products_index +
        `/products/globals?product_url_code=${productId}`
    );
    const productJson = await product.json();

    if (productJson.responseBody.length === 0) {
      return {
        props: {
          error: true,
          data: "El producto que buscas no existe",
        },
      };
    }

    return {
      props: {
        success: true,
        data: { product: productJson.responseBody },
      },
    };
  } catch (error) {
    return {
      props: {
        error: true,
      },
    };
  }
};
