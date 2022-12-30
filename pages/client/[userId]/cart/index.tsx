import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleUp, faArrowUp, faMicrochip, faMinus, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  AsterisksServices,
  handlerGetExternal,
  handlerPostExternal,
  IUserAddress,
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
import Router, { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import Link from "next/link";

const UserBag: NextPage<PageProps> = ({ success, error, data, reload }) => {
  console.log(success, error, data);
  const userData = useAuth();
  const user = userData[0];
  const router = useRouter()

  const originalCart = data.cart
  const [localCart, setLocalCart] = useState(data.cart);
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [selectedProductId, setSelectedProductId] = useState(0)
  const [hasWithoutStock, setHasWithoutStock] = useState(false)
  const [addressInput, setAddressInput] = useState<IUserAddress>({
    id_user: 0,
    id_user_address: 0,
    address: "",
    address_number: "",
    city: "",
    country: "",
    province: "",
    road_type: ""
  })
  // console.log({ hasWithoutStock })
  // console.log({ addressInput })
  // console.log({ selectedProductId });

  const shippingPrice = 1000


  useEffect(() => {
    // if (reload) {
    //   router.reload()
    // }
    if (!error) {
      setHasWithoutStock(false)

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
          } else {
            setHasWithoutStock(true)
          }

        })
        // console.log({ quantities })
        // console.log({ prices })
        const totalQnt = quantities.reduce((a, b) => a + b, 0)
        const totalPri = prices.reduce((a, b) => a + b, 0)
        return [totalQnt, totalPri + shippingPrice]
      }

      const [totalQnt, totalPri] = totalQuantityPrice()

      setTotalItems(totalQnt)
      setTotalPrice(totalPri)

      // const saveChanges = async () => {
      //   await handlerSaveCartChanges()
      // }

      // saveChanges()

    }
  }, [localCart, reload])

  if (error) {
    return <ErrorComponent data={"Vuelva a inicio y refresque la página"} />;
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
        if (e.target.value > p.product_stock) {
          return {
            ...p,
            quantity: Number(p.product_stock)
          }
        }
        if (e.target.value < 1) {
          return {
            ...p,
            quantity: 1
          }
        }
        return {
          ...p,
          quantity: Number(e.target.value)
        }
      }
    })

    setLocalCart(updatedProducts)
  }

  function handleDeleteProduct(productId?: number) {
    console.log({ productId })
    console.log({ selectedProductId })
    // console.log(localCart)
    let updatedCart = productId ? localCart.filter((p: any) =>
      p.id_individual_product != productId
    ) : localCart.filter((p: any) =>
      p.id_individual_product != selectedProductId)
    // console.log({ updatedCart })
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

  // esta funcion encriptara los datos del carrito de compras final, precios y direcciones, de manera que solo se pueda
  // acceder a la ruta "generar-orden" si se cuenta con la información exacta encriptada apretando el boton contrinuar
  function generateOrderHash() {
    const sec = process.env.NEXT_PUBLIC_FRONT_TOKEN_PRIVATE_KEY!
    console.log(sec)

    let finalCart: any[] = []
    let quantities: number[] = []
    let prices: number[] = []

    data.cart.map((p: any) => {
      // solo se envian estos datos dado que el backend ya se encargad e recoger el resto :)
      let data = {
        individualProductId: p.id_individual_product,
        quantity: p.quantity
      }

      let qnt = Number(p.quantity)
      let pri = Number(p.product_price)

      if (p.quantity > 0) {
        finalCart.push(data)
        quantities.push(qnt)


        if (p.hasOffer && p.percent_discount) {
          finalPrice = pri * ((100 - p.percent_discount) * 0.01) * qnt
          prices.push(finalPrice)
        } else {
          finalPrice = pri * qnt
          prices.push(finalPrice)
        }
      }
    })

    console.log({ prices })

    let finalQuantity = quantities.reduce((a, b) => a + b, 0)
    let finalPrice = prices.reduce((a, b) => a + b, 0)

    const currentDate = new Date()
    const delivery_date = new Date(new Date(currentDate).setDate(currentDate.getDate() + 3)).toLocaleString()

    const payload = {
      user_id: user.id_user,
      address: addressInput,
      products: finalCart,
      finalQuantity: finalQuantity,
      subtotal: finalPrice,
      shippingPrice: shippingPrice,
      deliveryDate: delivery_date,
      finalPrice: finalPrice + shippingPrice
    }
    console.log({ payload })
    const cr = jwt.sign(payload, sec, { expiresIn: "120000" })
    // const cr = jwt.sign(payload, sec)
    // console.log(cr)
    router.push(`/client/${user.id_user}/cart/pay?odh=${cr}`)
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

                    <div className="flex flex-col items-start justify-center gap-3">
                      {
                        product_stock > 0 ? (
                          <div >
                            <label className="mr-3 text-sm w-fit font-Comfortaa text-charleston">
                              Cantidad:{" "}
                            </label>
                            <div className="flex items-center gap-2 ">

                              <input
                                type="number"
                                max={product_stock}
                                min="1"
                                value={quantity}
                                onChange={(e) => { handleUpdateProductQnt(id_individual_product, e) }}
                                className="w-10 mr-3"
                              />

                              {/* <div className="flex flex-col">
                                <div onClick={() => { }}>
                                  <FontAwesomeIcon icon={faPlus} />
                                </div>
                                <div>
                                  <FontAwesomeIcon icon={faMinus} />
                                </div>
                              </div> */}
                            </div>

                          </div>

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
            <div className="flex flex-col justify-center h-auto col-start-7 col-end-11 gap-4 px-6 py-5 shadow-xl bg-ivory rounded-xl">
              <h2 className="text-2xl font-Pacifico text-charleston">
                Resumen de la orden
              </h2>

              <h2 className="font-bold">Tipo de entrega</h2>
              <div className="flex justify-between text-sm">
                <div className="flex flex-col gap-3">
                  {/* <p>Entrega rápida: Llega mañana</p> */}
                  <p>Entrega regular: Llega en tres días</p>
                </div>
                <div className="flex flex-col gap-3">
                  {/* <p>S/. 20</p> */}
                  <p>S/. 10</p>
                </div>
              </div>

              {
                !data.addresses || data.addresses.length == 0 ? (
                  <Link href={`/client/${user.id_user}`}>
                    <a className="text-sm font-bold font-Comfortaa text-charleston" >No tienes direcciones registradas, registra una para continuar con tu compra.</a>

                  </Link>

                ) : (
                  <select onChange={(e) => { setAddressInput(JSON.parse(e.target.value)) }} name="addresses" id="addresses">
                    <option value={JSON.stringify({
                      id_user: 0,
                      id_user_address: 0,
                      address: "",
                      address_number: "",
                      city: "",
                      country: "",
                      province: "",
                      road_type: ""
                    })} >Seleccione una dirección</option>
                    {
                      data.addresses.map((a: any) => (
                        <option value={JSON.stringify(a)} key={a.id_user_address}>{a.road_type}{" "}{a.address}{" "}{a.address_number}{", "}{a.city}{", "}{a.province}</option>

                      ))
                    }
                  </select>
                )
              }

              <p className="font-bold">Cantidad de productos: {totalItems}</p>
              <p className="font-bold">Total: {transformer(totalPrice)}</p>


              {
                hasWithoutStock || !addressInput.id_user ? (
                  <div className="px-3 py-2 w-fit bg-green rounded-xl">
                    <p className="text-ivory ">Continuar compra</p>
                  </div>

                ) : (
                  <div onClick={generateOrderHash} className="px-3 py-2 cursor-pointer w-fit hover:bg-teal bg-charleston rounded-xl">
                    <p className="text-ivory ">Continuar compra</p>
                  </div>

                )
              }
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
  if (!data || !data.accessToken) {
    return {
      props: {
        data: "Ha ocurrido un error, vuelva a intentar",
        error: true,
      }

    }
  }
  console.log({ data })
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

  // se valida si el token pertenece al usuario actual
  const decTok: any = jwt.decode(at)
  console.log(decTok)

  if (decTok!._id != userId) {
    return {
      props: {
        error: true,
        data: "Acceso no autorizado"
      }
    }
  }

  try {
    // se intenta buscar el carrito registrado al usuario
    const userCart = await handlerGetExternal(urlGetCartService, at!);
    if (userCart.error) {
      if (userCart.httpStatus == 401) {
        return {
          props: {
            data: userCart.serverMessage,
            error: true,
            reload: true
          }
        }
      }

      // si no existe un carrito para el cliente, se intenta crear uno
      if (userCart.httpStatus == 404 && userCart.errorMessage == "Resource not found") {
        try {
          const newCart = await handlerPostExternal(
            urlCreateCartService,
            bodyNewCart,
            at
          );
          if (newCart.error) {
            throw new Error(`${newCart.serverMessage}`);
          }
          return {
            props: {
              success: true,
              data: {
                cart: newCart.responseBody.selectedProducts,
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
          data: userCart.serverMessage,
        },
      };
    }

    // si se encontró el carrito
    // se busca la informacion completa de los productos que lo conforman
    let individualsIds: number[] = [];
    const { selectedProducts } = userCart.responseBody;
    for (let i = 0; i < selectedProducts.length; i++) {
      if (selectedProducts[i]) {
        individualsIds.push(selectedProducts[i].individualProductId);
      }
    }

    const individuals = await handlerPostExternal(
      urlGetMultipleIndividuals,
      {
        individuals: individualsIds,
      }
    );
    if (individuals.error) {
      throw new Error(`${individuals.serverMessage}`);
    }
    const cart = selectedProducts
    const productsOnCart = individuals.responseBody

    // se ordena la informacion de los productos del carrito
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

    // FINALMENTE se buscan las direcciones del cliente
    const urlGetAddressesService = AsterisksServices.ms_address_management + "/get-addresses/" + userId
    const addresses = await handlerGetExternal(urlGetAddressesService, at)

    if (addresses.error) {
      return {
        props: {
          success: true,
          data: {
            // selectedProducts: individuals.res.responseBody,
            // addressError: addresses.serverMessage,
            cart: productsData
          },
        },
      };

    }

    // no se distingue si el servicio responde bien o mal dado que las direcciones no son datos críticos
    return {
      props: {
        data: {
          // addressError: addresses.serverMessage,
          addresses: addresses.responseBody, cart: productsData
        },
        success: true
      }
    }
  } catch (error) {
    return {
      props: {
        error: true,
        data: `${error}`,
      },
    };
  }
};
