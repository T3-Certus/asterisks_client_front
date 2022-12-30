import { AsterisksServices, handlerPostExternal, IUserAddress } from "../../utils";

export async function CreateAddressService(body: IUserAddress, at: string) {
  const urlCreateAddressService = AsterisksServices.ms_address_management + "/create-address"

  try {
    const newAddress = await handlerPostExternal(urlCreateAddressService, body, at)

    if (newAddress.error) {
      throw new Error(newAddress.serverMessage);
    }
    console.log("New address created")
    return {
      success: true,
    }
  } catch (error) {
    throw new Error(`${error}`);

  }
}