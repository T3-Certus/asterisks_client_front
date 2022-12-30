import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorComponent, FooterComponent, HeadLayoutComponent, NavbarComponent } from "../../../../../components";
import jwt from "jsonwebtoken"
import { IUserAddress, transformer, useAuth } from "../../../../../utils";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreateOrderService } from "../../../../../services/orders/createOrderService";

interface IDefaultData {
  address: IUserAddress
  exp: number
  finalPrice: number
  finalQuantity: number
  iat: number
  products: Array<any>
  shippingPrice: number
  subtotal: number
  user_id: number,
  deliveryDate: string
}

const PayMenu: NextPage = () => {
  const router = useRouter()
  const sec = process.env.NEXT_PUBLIC_FRONT_TOKEN_PRIVATE_KEY!

  const stripe = useStripe()
  const elements = useElements()

  const userData = useAuth()
  const user = userData[0]

  const [decodedData, setDecodedData] = useState<IDefaultData>({
    address: {
      address: "",
      address_number: "",
      city: "",
      country: "",
      province: "",
      road_type: "",
      id_user: 0,
      id_user_address: 0
    },
    exp: 0,
    finalPrice: 0,
    finalQuantity: 1,
    iat: 0,
    products: [],
    shippingPrice: 0,
    subtotal: 0,
    user_id: 0,
    deliveryDate: ""
  })
  // console.log(decodedData)
  useEffect(() => {

    const { userId, odh } = router.query
    let evalT = setInterval(() => {
      // console.log({ odh })

      if (odh) {
        const dec = jwt.verify(odh.toString(), sec, function (err, decoded) {
          if (err) {
            if (err.name == 'TokenExpiredError') {
              // window.alert("Se agotó el tiempo, vuelve a intentarlo")
            }
            clearInterval(evalT)
            router.push("/")

          } else {
            // console.log({ decoded })
            let d: any = decoded
            setDecodedData(d)
          }

        })

      } else {
        clearInterval(evalT)
      }

    }, 1000)

    // if (!odh) {
    //   setDecodedData({
    //     address: {},
    //     exp: 0,
    //     finalPrice: 0,
    //     finalQuantity: 1,
    //     iat: 0,
    //     products: [],
    //     shippingPrice: 0,
    //     subtotal: 0,
    //     user_id: 0
    //   })
    //   clearInterval(evalT)
    //   router.push("/")
    // }
    // setTimeout(() => {
    //   clearInterval(evalT)
    // }, 12000)
  })

  if (!decodedData!.exp) {
    return <ErrorComponent data="Refresque la página o vuelva al inicio" />
  }


  async function handleSubmit(e: any) {
    e.preventDefault()

    if (decodedData!.exp) {
      const at = localStorage.getItem("accessToken")

      const createPM = await stripe?.createPaymentMethod({
        type: "card",
        card: elements!.getElement(CardElement)!,
        billing_details: {
          name: user.user_name + " " + user.user_surname + ":" + user.user_document_number,
          email: user.user_email
        }
      })

      if (!createPM?.error) {
        // console.log(createPM?.paymentMethod)
        await CreateOrderService(user.id_user, decodedData.products, decodedData.address, decodedData.deliveryDate, decodedData.finalPrice, createPM?.paymentMethod, decodedData.shippingPrice, at!).then((res) => {
          if (res.error) {
            window.alert("Ocurrió un error al generar la orden")
            elements?.getElement(CardElement)?.clear()
          } else {
            window.alert("La orden se pagó satisfactoriamente")
            router.push(`/client/${user.id_user}/history`)
          }
        })

      } else {
        console.log(createPM.error)
        window.alert("Ocurrió un error al generar la orden")
      }

    }

  }

  return (
    <div>
      <HeadLayoutComponent description="" section={"Pagar orden"} />
      {/* <NavbarComponent /> */}
      <div className="flex flex-col w-full h-screen gap-6 px-40 py-20 bg-ivory">
        <div className="flex flex-col justify-center w-full h-20 px-6 shadow-xl rounded-2xl bg-green">
          <p className="text-3xl font-Pacifico text-charleston">Pagar orden</p>
        </div>

        <div className="flex w-full gap-10 ">
          {/* <div className="flex flex-col col-start-1 col-end-7 gap-5">
            <div className="flex flex-col justify-center w-full gap-5 px-4 py-8 shadow-xl bg-cornsilk rounded-2xl">
              <h2 className="text-lg ">Ingresa los datos de tu tarjeta</h2>
              <form className="flex flex-col gap-3">
                <p>Número de tarjeta: <input type="text" /></p>
                <p>Fecha de vencimiento: <input type="month" /></p>
                <p>CCV: <input type="text" /></p>
                <p>Nombre del propietario:  <input type="text" /></p>
              </form>
              <div className="px-3 py-2 cursor-pointer w-fit hover:bg-charleston bg-teal rounded-xl">
                <p className="text-ivory ">Validar</p>
              </div>
            </div>
          </div> */}

          <div className="flex flex-col justify-center h-auto col-start-7 col-end-11 gap-4 px-6 py-6 shadow-xl bg-ivory rounded-xl">
            <h2 className="text-2xl font-Pacifico text-charleston">Resumen</h2>
            <p className="font-bold">Cantidad de productos: {decodedData.finalQuantity}</p>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-3">
                <p>Costo de envío: </p>
                <p>Subtotal:  </p>
                <p className="font-bold">Total:  </p>
              </div>
              <div className="flex flex-col gap-3">
                <p>{transformer(decodedData.shippingPrice)}</p>
                <p>{transformer(decodedData.subtotal)}</p>
                <p className="font-bold">{transformer(decodedData.finalPrice)}</p>
              </div>
            </div>
            <p className="text-sm">Declaro haber leído y acepto los términos y condiciones</p>
            {/* <div className="px-3 py-2 cursor-pointer w-fit hover:bg-teal bg-charleston rounded-xl">
              <p className="text-ivory ">Realizar pago</p>
            </div> */}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col w-full col-start-1 col-end-7 gap-5 p-6 shadow-xl bg-ivory rounded-2xl">
            <h2 className="text-2xl font-Pacifico text-charleston">Ingrese las credenciales</h2>
            <CardElement className="p-2 border-2 rounded-md border-teal" />
            {/* <CardCvcElement /> */}
            <button className="px-3 py-2 mx-2 cursor-pointer hover:bg-teal bg-charleston rounded-xl text-ivory">Pagar</button>
          </form>
        </div>
      </div>
      {/* <FooterComponent /> */}
    </div>
  );
}

export default PayMenu