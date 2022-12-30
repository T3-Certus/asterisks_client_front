import { handlerPostExternal } from "../../utils";


export async function CreateCartService(url: string, userId: number, at: string) {
  try {
    const newCart = await handlerPostExternal(
      url, { userId: userId }, at
    )
    if (newCart.error) {
      throw new Error(`${newCart.serverMessage}`);
    }
    console.log("New cart created")
    return {
      success: true,
      cart: []
    }
  } catch (error) {
    throw new Error(`${error}`)
  }
}