import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useState } from "react";
import {
  AsterisksServices,
  handlerGetExternal,
  handlerPostExternal,
  PageProps,
  parseCookies,
  useAuth,
} from "../../../../utils";
import {
  ErrorComponent,
  FooterComponent,
  HeadLayoutComponent,
  NavbarComponent,
} from "../../../../components";
import PrivateRoute from "../../../../components/errors/PrivateComponent";
import { GetServerSideProps, NextPage } from "next";
import { capitalize, transformer, discounter } from "../../../../utils";

const UserBag: NextPage<PageProps> = ({ success, error, data }) => {
  console.log(success, error, data);
  const userData = useAuth();
  const user = userData[0];

  // const [localCart, setLocalCart] = useState(userCart);
  // console.log(localCart);

  if (error) {
    return <ErrorComponent data={""} />;
  }

  if (!user || user.id_user == 0) {
    return <PrivateRoute />;
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
              {data.selectedProducts.map(
                ({
                  global_product,
                  product_color,
                  product_size,
                  hasOffer,
                  percent_discount,
                  product_url_img,
                  product_price,
                  product_sku,
                  product_stock,
                  id_individual_product,
                }: any) => (
                  <div
                    key={id_individual_product}
                    className="grid w-full grid-cols-6 grid-rows-1 gap-3 px-4 py-3 shadow-xl h-36 bg-cornsilk rounded-xl"
                  >
                    <div className="relative">
                      <Image
                        alt=""
                        src={product_url_img[0]}
                        layout="fill"
                        className="rounded-lg"
                        objectFit="cover"
                        objectPosition="center"
                      />
                    </div>
                    <div className="flex flex-col justify-center col-start-2 col-end-6">
                      <p className="text-base font-bold font-Comfortaa text-charleston">
                        {global_product.name}
                      </p>
                      <p className="text-sm font-Comfortaa text-charleston">
                        <span className="font-bold">Talla: </span> {product_size.name}
                      </p>
                      <p className="text-sm font-Comfortaa text-charleston">
                      <span className="font-bold ">Color: </span> {capitalize(product_color.name)}
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
                      <label className="mr-3 text-sm w-fit font-Comfortaa text-charleston">
                        Cantidad:{" "}
                        <input
                          type="number"
                          value={2}
                          min="1"
                          className="w-10 mr-3"
                        />
                      </label>

                      <FontAwesomeIcon icon={faTrashCan} />
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
              <p>(n productos)</p>
              <p>Total: </p>
              <div className="px-3 py-2 cursor-pointer w-fit hover:bg-teal bg-charleston rounded-xl">
                <p className="text-ivory ">Continuar compra</p>
              </div>
            </div>
          )}
        </div>
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
    return {
      props: {
        success: true,
        data: {
          cart: res.responseBody.selectedProducts,
          selectedProducts: individuals.res.responseBody,
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
