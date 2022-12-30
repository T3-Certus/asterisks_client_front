import { GetServerSideProps, NextPage } from "next";
import { ErrorComponent, FooterComponent, HeadLayoutComponent, NavbarComponent, PrivateComponent } from "../../../../components";
import { AsterisksServices, handlerGetExternal, PageProps, parseCookies, useAuth } from "../../../../utils";
import jwt from "jsonwebtoken"
import { transformer } from "../../../../utils";

const UserOrdersHistory: NextPage<PageProps> = ({ data, error, success }) => {

  console.log(success, error, data)

  const userData = useAuth()
  const user = userData[0]

  if (error) {
    return <ErrorComponent data={data} />;
  }

  if (!user || user.id_user === 0) {
    return <PrivateComponent />;
  }

  return (
    <div>
      <HeadLayoutComponent description="" section={"Historial de ordenes"} />
      <NavbarComponent />
      <div className="flex flex-col w-full h-auto min-h-screen px-40 py-20 gap-11 bg-ivory">
        <div className="flex flex-col justify-center w-full h-20 px-6 shadow-xl rounded-xl bg-green">
          <p className="text-3xl font-Pacifico text-charleston">
            Historial de ordenes
          </p>
        </div>
        <div className="flex flex-col gap-4">

          {
            data.orders.map((o: any) => (

              <div key={o.id_user_order} className="flex justify-between w-full p-8 shadow-lg rounded-xl bg-cornsilk">
                <div>
                  <p className="text-sm font-bold text-charleston">
                    Codigo: {o.id_transaction_pay}
                  </p>
                  <p className="text-sm text-charleston">
                    <span className="font-bold">
                      Fecha de solicitud: {" "}
                    </span>
                    {o.order_date}
                  </p>
                  <p className="text-sm text-charleston">
                    <span className="font-bold">
                      Fecha de entrega: {" "}
                    </span>
                    {o.delivery_date}
                  </p>
                  <p className="text-sm text-charleston">
                    <span className="font-bold">
                      Estado: {" "}
                    </span>
                    {o.order_state.name}
                  </p>
                  <p className="text-sm text-charleston">
                    <span className="font-bold">
                      Dirección de envío: {" "}
                    </span>
                    {o.shipping_address.road_type + " " + o.shipping_address.address + " " + o.shipping_address.address_number + ", " + o.shipping_address.city + ", " + o.shipping_address.province + ", " + o.shipping_address.country}
                  </p>

                </div>

                <div>
                  <p className="text-sm text-charleston">
                    <span className="font-bold">
                      Cantidad de productos: {" "}
                    </span>
                    {o.total_items_quantity}
                  </p>
                  <p className="text-sm text-charleston">
                    <span className="font-bold">
                      Precio final: {" "}
                    </span>
                    {transformer(o.total_price)}
                  </p>

                </div>

              </div>
            ))
          }
        </div>


      </div>
      <FooterComponent />
    </div>

  )
}

export default UserOrdersHistory

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId } = context.params!
  const data = parseCookies(context.req);
  if (!data || !data.accessToken) {
    return {
      props: {
        data: "Ha ocurrido un error, vuelva a intentar",
        error: true,
      }

    }
  }
  // console.log({ data })
  const at = JSON.parse(data.accessToken);

  // se valida si el token pertenece al usuario actual
  const decTok: any = jwt.decode(at)

  if (decTok!._id != userId) {
    console.log(decTok._id)
    console.log(userId)
    return {
      props: {
        error: true,
        data: "Acceso no autorizado"
      }
    }
  }

  const urlGetOrdersService = AsterisksServices.ms_user_data + "/users/get-orders?userId=" + userId

  try {
    const getOrdersAction = await handlerGetExternal(urlGetOrdersService, at)

    if (getOrdersAction.error) {
      return {
        props: {
          error: true,
          data: getOrdersAction.serverMessage
        }
      }
    }

    const orderedArray = getOrdersAction.responseBody.reverse()
    return {
      props: {
        success: true,
        data: { orders: orderedArray }
      }
    }

  } catch (error) {
    return {
      props: {
        error: true,
        data: `${error}`
      }
    }
  }
}