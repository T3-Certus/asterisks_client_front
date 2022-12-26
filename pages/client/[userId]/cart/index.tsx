import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  AsterisksServices,
  handlerGetExternal,
  handlerPostExternal,
  PageProps,
  parseCookies,
  useAuth,
} from "../../../../utils";
import {
  ConfirmationPopup,
  ErrorComponent,
  FooterComponent,
  HeadLayoutComponent,
  NavbarComponent,
} from "../../../../components";
import PrivateRoute from "../../../../components/errors/PrivateComponent";
import { GetServerSideProps, NextPage } from "next";
import { capitalize, transformer, discounter } from "../../../../utils";
import { UpdateCartService } from "../../../../services/user_cart/updateCartService";
import { useRouter } from "next/router";

const UserBag: NextPage<PageProps> = ({ success, error, data }) => {
  console.log(success, error, data);
  const userData = useAuth();
  const user = userData[0];
  const router = useRouter()

  const originalCart = data.cart
  const [localCart, setLocalCart] = useState(data.cart);
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [selectedProductId, setSelectedProductId] = useState(0)
  // console.log({ selectedProductId });

  useEffect(() => {
    const totalQuantityPrice = (): number[] => {
      let quantities: number[] = []
      let prices: number[] = []
      localCart.map((p: any) => {
        let qnt = Number(p.quantity)
        let pri = Number(p.product_price)
        let finalPrice: number = 0

        if (p.product_stock > 0) {
          quantities.push(qnt)
          if (qnt > 0) {
            if (p.hasOffer && p.percent_discount) {
              finalPrice = pri * ((100 - p.percent_discount) * 0.01) * qnt
              prices.push(finalPrice)
            } else {
              finalPrice = pri * qnt
              prices.push(finalPrice)
            }
          }
        }

      })
      console.log({ quantities })
      console.log({ prices })
      const totalQnt = quantities.reduce((a, b) => a + b, 0)
      const totalPri = prices.reduce((a, b) => a + b, 0)
      return [totalQnt, totalPri]
    }

    const [totalQnt, totalPri] = totalQuantityPrice()

    setTotalItems(totalQnt)
    setTotalPrice(totalPri)

    // const saveChanges = async () => {
    //   await handlerSaveCartChanges()
    // }

    // saveChanges()
  }, [localCart])

  if (error) {
    return <ErrorComponent data={data} />;
  }

  if (!user || user.id_user == 0) {
    return <PrivateRoute />;
  }

  function handleUpdateProductQnt(productId: number, e: any) {
    // console.log(e.target.value)
    const updatedProducts = localCart.map((p: any) => {
      if (p.id_individual_product != productId) {
        return p
      } else {
        return {
          ...p,
          quantity: Number(e.target.value)
        }
      }
    })

    setLocalCart(updatedProducts)
  }

  function handleDeleteProduct(productId?: number) {
    console.log({ selectedProductId })
    console.log(localCart)
    let updatedCart = localCart.filter((p: any) =>
      p.id_individual_product != productId ? productId : selectedProductId
    )
    console.log({ updatedCart })
    setLocalCart(updatedCart)
  }

  async function handlerSaveCartChanges() {
    let products: any[] = []
    localCart.map((p: any) => {
      let data = {
        globalProductId: p.id_global_product,
        individualProductId: p.id_individual_product,
        quantity: p.quantity
      }

      if (p.quantity > 0 && p.product_stock > 0) {
        products.push(data)
      }
      if (!p.product_stock) {
        window.alert(`El producto ${p.product_name} será eliminado del carrito por no tener suficiente stock`)
        handleDeleteProduct(p.id_individual_product)
      }
    })

    if (user.id_user != 0) {
      await UpdateCartService(user.id_user, products).then((res) => {
        console.log({ res })
        if (!res.success) {
          window.alert("Ha ocurrido un error al tratar de actualizar el carrito")
        } else {
          window.alert("Se actualizó el carrito con éxito")
          router.reload()
        }
      }).catch((err) => {
        window.alert(`Vuelva a intentar, ${err}`)
      })
    }
  }

  function showPopup() {
    document.getElementById("confPopup")!.style.display = "flex";
  }

  return (
    <div>
      <HeadLayoutComponent description="" section={"Bolsa de compras"} />
      <NavbarComponent />
      <div className="flex flex-col w-full h-auto px-40 py-20 gap-11 bg-ivory">
        <div className="flex flex-col justify-center w-full h-20 px-6 shadow-xl rounded-xl bg-green">
          <p className="text-3xl font-Pacifico text-charleston">
            Bolsa de compras
          </p>
        </div>

        <div className="grid w-full h-auto grid-cols-10 grid-rows-1 gap-5">
          {data.cart.length == 0 ? (
            <div className="h-60% flex flex-col justify-center w-screen">
              <p className="text-2xl">No hay productos en el carrito :(</p>
            </div>
          ) : (
            <div className="flex flex-col col-start-1 col-end-7 gap-5">
              {/* {data.cart.map( */}
              {localCart.map(
                ({
                  product_name,
                  hasOffer,
                  id_global_product,
                  id_individual_product,
                  percent_discount,
                  product_color,
                  product_price,
                  product_size,
                  product_sku,
                  product_stock,
                  product_url_img,
                  quantity
                }: any) => (
                  <div
                    key={id_individual_product}
                    className="grid w-full grid-cols-6 grid-rows-1 gap-3 px-4 py-3 shadow-xl h-36 bg-cornsilk rounded-xl"
                  >
                    <div className="relative">
                      <Image
                        alt=""
                        src={product_url_img}
                        layout="fill"
                        className="rounded-lg"
                        objectFit="cover"
                        objectPosition="center"
                      />
                    </div>
                    <div className="flex flex-col justify-center col-start-2 col-end-6">
                      <p className="text-base font-bold font-Comfortaa text-charleston">
                        {product_name}
                      </p>
                      <p className="text-sm font-Comfortaa text-charleston">
                        <span className="font-bold">Talla: </span> {product_size}
                      </p>
                      <p className="text-sm font-Comfortaa text-charleston">
                        <span className="font-bold ">Color: </span> {capitalize(product_color)}
                      </p>
                      <p className="text-sm font-Comfortaa text-charleston">
                        <span className="font-bold">Precio unitario: </span>
                        {hasOffer && percent_discount > 0
                          ? transformer(
                            discounter(product_price, percent_discount)
                          )
                          : transformer(product_price)} {percent_discount > 0 ? <span className="text-green"> | -%{percent_discount}</span> : <></>}
                      </p>
                    </div>
                    <div className="flex flex-col items-start justify-center">
                      {
                        product_stock > 0 ? (
                          <label className="mr-3 text-sm w-fit font-Comfortaa text-charleston">
                            Cantidad:{" "}
                            <input
                              type="number"
                              defaultValue={quantity}
                              max={product_stock}
                              min="1"
                              onChange={(e) => { handleUpdateProductQnt(id_individual_product, e) }}
                              className="w-10 mr-3"
                            />
                          </label>

                        ) : <p>Sin stock</p>
                      }

                      <FontAwesomeIcon className="cursor-pointer" onClick={() => {
                        setSelectedProductId(id_individual_product);
                        showPopup()
                      }} icon={faTrashCan} />
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {data.cart.length == 0 ? (
            <></>
          ) : (
            <div className="col-start-7 gap-4 h-50% flex flex-col justify-center pl-6  col-end-11 shadow-xl bg-ivory rounded-xl">
              <h2 className="text-2xl font-Pacifico text-charleston">
                Resumen de la orden
              </h2>
              <p className="text-sm font-Comfortaa text-charleston">
                Costo de envío no incluído
              </p>
              <p>Cantidad de productos: {totalItems}</p>
              <p>Total: {transformer(totalPrice)}</p>
              <div className="px-3 py-2 cursor-pointer w-fit hover:bg-teal bg-charleston rounded-xl">
                <p className="text-ivory ">Continuar compra</p>
              </div>
              {
                localCart != originalCart ? (
                  <div onClick={handlerSaveCartChanges} className="px-3 py-2 cursor-pointer w-fit hover:bg-green bg-teal rounded-xl">
                    <p className="text-ivory ">Guardar carrito</p>
                  </div>

                ) : (<></>)
              }
            </div>
          )}
        </div>
        <ConfirmationPopup message="¿Estás seguro de eliminar este producto?" action={handleDeleteProduct} />
      </div>
      <FooterComponent />
    </div>
  );
};

export default UserBag;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId } = context.params!;
  const data = parseCookies(context.req);
  // console.log({data})
  const at = JSON.parse(data.accessToken);
  // const at = data.accessToken
  // console.log({at})
  const urlGetCartService =
    AsterisksServices.ms_shopping_cart + "/carts/" + userId;
  const urlCreateCartService =
    AsterisksServices.ms_shopping_cart + "/create-cart";
  const urlGetMultipleIndividuals =
    AsterisksServices.ms_products_index + "/products/individuals/multiple";
  const bodyNewCart = { userId: userId };

  try {
    // se intenta buscar el carrito registrado al usuario
    const userCart = await handlerGetExternal(urlGetCartService, at!);
    const { res } = userCart;
    // console.log(res)
    if (res.error) {
      // si no existe un carrito para el cliente, se intenta crear uno
      if (res.httpStatus == 404 && res.errorMessage == "Resource not found") {
        try {
          const newCart = await handlerPostExternal(
            urlCreateCartService,
            bodyNewCart,
            at
          );
          if (newCart.res.error) {
            throw new Error(`${newCart.res.serverMessage}`);
          }
          return {
            props: {
              success: true,
              data: {
                cart: newCart.res.responseBody.selectedProducts,
              },
            },
          };
        } catch (error) {
          throw new Error(`${error}`);
        }
      }
      // si el error es otro
      return {
        props: {
          error: true,
          data: res.serverMessage,
        },
      };
    }
    // si se encontró el carrito
    // se busca la informacion completa de los productos que lo conforman
    let individualsIds: number[] = [];
    const selectedProducts = res.responseBody.selectedProducts;
    // console.log({selectedProducts})

    for (let i = 0; i < selectedProducts.length; i++) {
      if (selectedProducts[i]) {
        individualsIds.push(selectedProducts[i].individualProductId);
      }
    }
    // console.log({individualsIds})
    const body = {
      individuals: individualsIds,
    };
    // console.log({body})
    const individuals = await handlerPostExternal(
      urlGetMultipleIndividuals,
      body
    );
    console.log({ individuals });
    if (individuals.res.error) {
      throw new Error(`${individuals.res.serverMessage}`);
    }

    const cart = res.responseBody.selectedProducts
    const productsOnCart = individuals.res.responseBody

    let productsCompiledData = (): any[] => {

      let selectedProductsArray: any[] = []
      productsOnCart.map((product: any) => {
        let productOnCart = cart.find((p: any) => p.individualProductId == product.id_individual_product)

        let selectedProductData = {
          product_name: product.global_product.name,
          hasOffer: product.has_offer,
          id_global_product: product.id_global_product,
          id_individual_product: product.id_individual_product,
          percent_discount: product.percent_discount,
          product_color: product.product_color.name,
          product_price: product.product_price,
          product_size: product.product_size.name,
          product_sku: product.product_sku,
          product_stock: product.product_stock,
          product_url_img: product.product_url_img[0],
          quantity: productOnCart.quantity
        }

        selectedProductsArray.push(selectedProductData)
      })

      return selectedProductsArray
    }

    const productsData = productsCompiledData()
    // console.log({ productsData })

    return {
      props: {
        success: true,
        data: {
          // cart: res.responseBody.selectedProducts,
          // selectedProducts: individuals.res.responseBody,
          cart: productsData
        },
      },
    };
  } catch (error) {
    return {
      props: {
        error: true,
        data: `${error}`,
      },
    };
  }
};
