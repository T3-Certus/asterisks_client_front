import { AsterisksServices, handlerPostExternal, ICartPayload } from "../../utils";

export async function UpdateCartService(userId: number, uploadedCart: ICartPayload[]) {
  const serviceUrl = AsterisksServices.ms_shopping_cart + "/update-cart/" + userId
  const at = localStorage.getItem("accessToken")!

  console.log({ uploadedCart })
  try {
    const body = {
      payload: uploadedCart
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
    throw new Error(`${error}`)
  }
}