import { AsterisksServices, handlerDeleteExternal } from "../../utils";

export async function DeleteAddressService(userId: number, addressId: number, at: string) {
  const urlDeleteAddressService = AsterisksServices.ms_address_management + `/delete-address?userId=${userId}&addressId=${addressId}`

  try {
    const deleteAddressAction = await handlerDeleteExternal(urlDeleteAddressService, 0, at)

    if (deleteAddressAction.error) {
      throw new Error(deleteAddressAction.serverMessage);
    }

    return {
      success: true
    }
  } catch (error) {
    throw new Error(`${error}`);

  }
}