import { AsterisksServices, handlerPostExternal, ICartPayload } from "../../utils";

export async function AddProductService(userId: number, oldCart: ICartPayload[], newProduct: ICartPayload) {
  const serviceUrl = AsterisksServices.ms_shopping_cart + "/update-cart/" + userId
  let payload: ICartPayload[] = []
  const at = localStorage.getItem("accessToken")!

  const sameProduct = oldCart.find(product => product.individualProductId == newProduct.individualProductId)

  if (!sameProduct) {
    payload = oldCart.concat(newProduct)
  } else {
    let partialCart = oldCart.filter(product => product.individualProductId != newProduct.individualProductId)
    payload = partialCart.concat(newProduct)
  }
  console.log({ payload })
  try {
    const body = {
      payload: payload
    }
    const updatedCart = await handlerPostExternal(serviceUrl, body, at)
    if (updatedCart.error) {
      throw new Error(`${updatedCart.serverMessage}`)
    }
    return {
      success: true,
      message: "updated cart"
    }
  } catch (error) {
    throw new Error(`${error}`);

  }
}