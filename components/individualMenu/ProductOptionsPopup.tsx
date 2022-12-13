/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useEffect, useState } from "react";
import Image from "next/image";
import {
  AsterisksServices,
  handlerGetExternal,
  handlerPostExternal,
  useAuth,
} from "../../utils";
import { CreateCartService } from "../../services";
import { transformer, discounter } from "../../utils";
import { AddProductService } from "../../services/user_cart/addProductService";

interface IPopupProps {
  selectedColor: string;
  productImg: string;
  globalData: any;
  selectedProduct: any;
}

const ProductOptions: FunctionComponent<IPopupProps> = ({
  globalData,
  selectedColor,
  productImg,
  selectedProduct,
}) => {
  const userData = useAuth();
  const user = userData[0];

  const [productQuantity, setProductQuantity] = useState(1);

  const [product, setProduct] = useState({
    globalCode: 0,
    name: "",
    color: "",
    img: "",
    unitPrice: 0,
    individualCode: 0,
    sku: "",
    size: "",
    stock: 0,
    discount: 0,
    quantity: 0,
  });

  useEffect(() => {
    setProduct({
      globalCode: globalData.id_global_product,
      name: globalData.product_name,
      color: selectedColor,
      img: productImg,
      individualCode: selectedProduct.individualId,
      sku: selectedProduct.individualCode,
      unitPrice: selectedProduct.originalPrice,
      size: selectedProduct.size,
      stock: selectedProduct.stock,
      discount: selectedProduct.discount,
      quantity: productQuantity,
    });
    console.log({ selectedProduct });
    console.log({ product });
  }, [selectedProduct.individualCode, productQuantity]);

  const urlGetCartService =
    AsterisksServices.ms_shopping_cart + "/carts/" + user.id_user;
  const urlCreateCartService =
    AsterisksServices.ms_shopping_cart + "/create-cart";

  // actualiza estado de cantidad
  function handleQuantity(e: any) {
    setProductQuantity(e.target.value);
    setProduct({ ...product, quantity: e.target.value });
  }

  // actualiza estado del precio
  function calcTotal() {
    if (product.discount > 0) {
      let discountedPrice = discounter(product.unitPrice, product.discount);
      return transformer(productQuantity * discountedPrice);
    }
    return transformer(productQuantity * product.unitPrice);
  }

  function hidePopup() {
    document.getElementById("popup")!.style.display = "none";
    setProductQuantity(1);
    setProduct({ ...product, quantity: 1 });
  }

  async function addProductToCart() {
    if (user.id_user != 0) {

      await getUserCart()
        .then(async (res) => {
          if (!res.success) {
            window.alert("Ha ocurrido un error");
          } else {
            console.log({ res });
            await AddProductService(user.id_user, res.cart, {
              globalProductId: product.globalCode,
              individualProductId: product.individualCode,
              quantity: product.quantity,
            }).then((res) => {
              console.log({ res })
              if (!res.success) {
                window.alert(
                  "Ha ocurrido un error al ingresar el producto en el carrito"
                );
              } else {
                window.alert("Se agregó el producto con éxito");
              }
            }).catch(err => window.alert(err));
          }
        })
        .catch((e) => window.alert(e));
    } else {
      window.alert("Para agregar productos al carrito debe iniciar sesión");
    }
  }

  async function getUserCart() {
    const at = localStorage.getItem("accessToken")!;
    const userId = user.id_user;
    try {
      const userCart = await handlerGetExternal(urlGetCartService, at!);
      const resUserCart = userCart.res;
      if (resUserCart.error) {
        if (
          resUserCart.status == 404 &&
          resUserCart.errorMessage == "Resource not found"
        ) {
          CreateCartService(urlCreateCartService, userId, at);
        } else {
          throw new Error(`${resUserCart.errorMessage}`);
        }
      }
      console.log(resUserCart);
      return {
        success: true,
        cart: resUserCart.responseBody.selectedProducts,
      };
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async function pubData(cartInput: any) {
    const uid = user.id_user;
    try {
      const req = await fetch(`/api/users/${uid}/cart`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(cartInput),
      });
      const data = await req.json();
      if (data.success) {
        window.alert("Tu producto ha sido agregado al carrito");
        hidePopup();
      }
    } catch (error) {
      window.alert(error);
    }
  }

  return (
    <div
      id="popup"
      // onMouseEnter={handleSizeId}
      className="fixed top-0 left-0 z-50 hidden w-screen h-screen grid-cols-4 grid-rows-4 bg-black/50"
    >
      <div className="flex flex-col justify-center w-full h-full col-span-2 col-start-2 row-span-2 row-start-2 gap-6 p-12 rounded-lg bg-ivory">
        <div className="flex justify-between">
          <p className="text-lg font-bold">Agregar a la bolsa de compras</p>
          <button className="text-xl hover:font-bold" onClick={hidePopup}>
            X
          </button>
        </div>
        <form className="flex justify-between">
          <div className="relative w-20 h-28">
            <Image
              alt=""
              src={productImg}
              className="rounded-lg"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
          </div>
          <div>
            <p className="font-bold">{product.name}</p>
            <p className="font-bold">
              SKU: <span className="text-sm font-normal">{product.sku}</span>
            </p>
            <p className="font-bold">
              Talla: <span className="text-sm font-normal">{product.size}</span>
            </p>
          </div>
          <div>
            <p>
              Precio unitario:{" "}
              {product.discount > 0
                ? transformer(discounter(product.unitPrice, product.discount))
                : transformer(product.unitPrice)}{" "}
              {product.discount > 0 ? <span>-%{product.discount}</span> : <></>}
            </p>
            <p>Precio total: {calcTotal()}</p>
            {selectedProduct.stock <= 0 ? (
              <div></div>
            ) : (
              <label>
                Cantidad:
                <input
                  className="w-12 ml-5"
                  type="number"
                  name="qnt"
                  id="qnt"
                  value={productQuantity}
                  onChange={handleQuantity}
                  min={1}
                  max={selectedProduct.stock}
                />
              </label>
            )}
          </div>
        </form>
        <div className="flex justify-end">
          {selectedProduct.stock <= 0 ? (
            <p>PRODUCTO SIN STOCK</p>
          ) : (
            <button
              id="btCart"
              className="p-3 rounded-lg bg-charleston text-ivory w-fit hover:bg-teal"
              onClick={() => addProductToCart()}
            >
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductOptions;
