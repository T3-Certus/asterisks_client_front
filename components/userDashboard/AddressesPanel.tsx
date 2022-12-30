import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import { CreateAddressService, DeleteAddressService } from "../../services";
import { IAddressesPanelProps, IUserAddress, provinces, useAuth } from "../../utils";


const AddressPanelComponent: FunctionComponent<IAddressesPanelProps> = ({ addresses, error }) => {

  const router = useRouter()
  const userData = useAuth();
  const user = userData[0];

  const [addressInput, setAddressInput] = useState<IUserAddress>({
    id_user: user.id_user,
    address: "",
    address_number: "",
    city: "",
    country: "Peru",
    province: "Lima",
    road_type: "Avenida"
  })
  console.log(addressInput)

  const handleShowForm = () => {
    document.getElementById("formAddress")!.style.display = "flex"
  }

  const handleChange = (e: any) => {
    const { value, name } = e.target
    setAddressInput({
      ...addressInput,
      [name]: value
    })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    createNewAddress(addressInput)
  }

  const createNewAddress = async (addressInput: IUserAddress) => {
    const at = localStorage.getItem("accessToken")

    if (user.id_user && at) {
      await CreateAddressService(addressInput, at).then((res) => {
        if (res?.success) {
          window.alert("Dirección registrada con éxito")
          router.reload()
        } else {
          window.alert("Ocurrió un error, intente nuevamente")
        }
      }).catch(e => window.alert(`Ocurrió un error, intente nuevamente ${e}`))
    }
  }

  const deleteAddress = async (userId: any, addressId: any) => {
    const at = localStorage.getItem("accessToken")
    if (user.id_user && at) {
      await DeleteAddressService(userId, addressId, at).then((res) => {
        if (res.success) {
          window.alert("Se eliminó la dirección")
          router.reload()
        } else {
          window.alert("Ocurrió un error, intente nuevamente")
        }
      }).catch(e => window.alert(`Ocurrió un error, intente nuevamente ${e}`))
    }
  }

  return (
    <div className="flex flex-col h-auto col-start-6 col-end-11 gap-4 px-6 py-4 shadow-lg rounded-2xl bg-cornsilk">
      <p className="text-2xl font-Pacifico text-charleston">
        Direcciones de envío
      </p>
      {
        error ? (
          <p>Ha ocurrido un error al mostrar las direcciones, intente nuevamente en 5 minutos</p>
        ) : <></>
      }
      {/* <p>Dirección actual: {address === "" ? "Dirección no determinada" : address} </p> */}
      <div>
        {
          addresses.length > 0 ? (
            addresses.map((address) => (
              <div key={address.id_user_address} className="flex items-center justify-between px-1 py-4 border-b-2 border-b-teal">
                <p className="text-sm">
                  {address.road_type}{" "}{address.address}{" "}{address.address_number}{", "}{address.city}{", "}{address.province}
                </p>
                <p className="text-sm font-bold cursor-pointer" onClick={() => deleteAddress(address.id_user, address.id_user_address)}>Eliminar</p>
              </div>

            ))
          ) : <p>No tiene direcciones registradas, agregue una.</p>
        }

      </div>

      <div onClick={handleShowForm} className="px-6 py-2 shadow-xl cursor-pointer bg-green w-fit rounded-xl hover:bg-teal">
        Agregar dirección
      </div>

      <div onSubmit={handleSubmit} id="formAddress" className="items-center justify-between hidden w-full">
        <form className="flex flex-col gap-3" >
          <label >
            País: {" "}
            <select onChange={handleChange} value={addressInput.country} name="country" id="country">
              <option value="Peru">Perú</option>
            </select>
          </label>
          <label>Provincia: {" "}
            <select onChange={handleChange} name="province" value={addressInput.province} id="province">
              {
                provinces.map((province) => (
                  <option value={province.name} key={province.name}>{province.name} </option>
                ))
              }
            </select>
          </label>
          <label>Distrito: {" "}
            <input onChange={handleChange} value={addressInput.city} required name="city" id="city" type="text" />
          </label>
          <label >Dirección: {" "}
            <input onChange={handleChange} value={addressInput.address} required name="address" id="address" type="text" />
          </label>
          <label >Tipo de vía: {" "}
            <select onChange={handleChange} value={addressInput.road_type} name="road_type" id="road_type">
              <option value="Avenida">Avenida</option>
              <option value="Calle">Calle</option>
              <option value="Jiron">Jirón</option>
              <option value="Carretera">Carretera</option>
            </select>
          </label>
          <label>Número: {" "}
            <input onChange={handleChange} value={addressInput.address_number} required type="text" name="address_number" id="address_number" />
          </label>
          <input type="submit" className="px-6 py-2 shadow-xl cursor-pointer bg-green w-fit rounded-xl hover:bg-teal" value="Guardar" />
        </form>
      </div>

    </div>
  );
}

export default AddressPanelComponent