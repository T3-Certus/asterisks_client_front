import { AsterisksServices, handlerPostExternal, IGenericInternalServiceResponse, IUserAddress } from "../../utils";

export async function CreateOrderService(userId: number, products: any[], shippingAddress: IUserAddress, deliveryDate: string, finalPrice: number, paymentMethod: any, shipping_price: number, token: string): Promise<IGenericInternalServiceResponse> {
  const urlCreateOrderService = AsterisksServices.ms_order_management + "/generate-order"

  let finalProducts: any[] = []

  products.map((p) => {
    let data = {
      individual_id: p.individualProductId,
      quantity: p.quantity
    }

    finalProducts.push(data)
  })

  const payload = {
    id_user: userId,
    products: finalProducts,
    shipping_address: shippingAddress,
    delivery_date: deliveryDate,
    final_price: finalPrice,
    payment_method: paymentMethod,
    shipping_price: shipping_price
  }

  console.log({ payload })

  const createOrderAction: IGenericInternalServiceResponse = await handlerPostExternal(urlCreateOrderService, payload, token).then((res) => {
    if (res.error) {
      return {
        success: false,
        error: true,
        data: res.serverMessage || res.errorMessage
      }
    }

    return {
      data: res.serverMessage,
      error: false,
      success: true
    }
  }).catch((e) => {
    return {
      success: false,
      error: true,
      data: `e`
    }
  })

  console.log({ createOrderAction })
  return createOrderAction
}