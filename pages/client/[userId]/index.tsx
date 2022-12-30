import { GetServerSideProps, NextPage } from "next";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import { ErrorComponent, FooterComponent, HeadLayoutComponent, NavbarComponent, PrivateComponent } from "../../../components";
import AddressPanelComponent from "../../../components/userDashboard/AddressesPanel";
import PersonalDataComponent from "../../../components/userDashboard/PersonalData";
import { AsterisksServices, handlerGetExternal, PageProps, parseCookies, useAuth } from "../../../utils";
import jwt from "jsonwebtoken";
import { useEffect } from "react";

const ClientProfile: NextPage<PageProps> = ({ data, error, success, reload }) => {
  console.log(success, error, data);

  const router = useRouter();
  const userData = useAuth()
  const user = userData[0]

  // TESTEAR STATE
  let [userOption, setUserOption] = useState(1);
  console.log(userOption);

  // useEffect(() => {
  //   if (reload) {
  //     window.location.reload()
  //   }
  // })



  // es viable utilizar swr en lugar de ssr para obtener las direcciones del cliente

  if (error) {
    return <ErrorComponent data={data} />;
  }

  if (!user || user.id_user === 0) {
    return <PrivateComponent />;
  }

  return (
    <div>
      <HeadLayoutComponent description="" section={`Mi cuenta`} />
      <NavbarComponent />
      <div className="flex flex-col w-full h-auto min-h-screen px-40 py-20 gap-11 bg-ivory">
        <div className="flex flex-col justify-center w-full h-20 px-6 shadow-xl rounded-xl bg-green">
          <p className="text-3xl font-Pacifico text-charleston">
            Hola {user.user_name}
          </p>
        </div>
        <div className="grid grid-cols-10 grid-rows-1">
          <div className="flex flex-col col-start-1 col-end-5 gap-5">
            <div
              onClick={() => setUserOption((userOption = 1))}
              className="flex flex-row items-center justify-between w-full h-20 px-6 text-2xl shadow-xl cursor-pointer hover:bg-cornsilk font-Pacifico text-charleston rounded-xl bg-teal"
            >
              <p>Datos personales</p>
              <p>{">"} </p>
            </div>
            <div
              onClick={() => setUserOption((userOption = 2))}
              className="flex flex-row items-center justify-between w-full h-20 px-6 text-2xl shadow-xl cursor-pointer hover:bg-cornsilk font-Pacifico text-charleston rounded-xl bg-teal"
            >
              <p>Cambiar contraseña</p>
              <p>{">"} </p>
            </div>
            <div
              onClick={() => router.push(`/client/${user.id_user}/history`)}
              className="flex flex-row items-center justify-between w-full h-20 px-6 text-2xl shadow-xl cursor-pointer hover:bg-cornsilk font-Pacifico text-charleston rounded-xl bg-teal"
            >
              <p>Mis compras</p>
              <p>{">"} </p>
            </div>
            <div
              onClick={() => setUserOption((userOption = 3))}
              className="flex flex-row items-center justify-between w-full h-20 px-6 text-2xl shadow-xl cursor-pointer hover:bg-cornsilk font-Pacifico text-charleston rounded-xl bg-teal"
            >
              <p>Direcciones de envío</p>
              <p>{">"} </p>
            </div>
          </div>
          {/* here goes components */}
          {userOption == 1 ? (
            <PersonalDataComponent
              name={user.user_name}
              surname={user.user_surname}
              email={user.user_email}
              cellphone={user.user_cellphone}
            />
          ) : userOption == 2 ? (
            // <UserPassword />
            <>En construccion</>
          ) : userOption == 3 ? (
            <AddressPanelComponent addresses={data} error={error} />
          ) : (
            <></>
          )}
        </div>
      </div>

      <FooterComponent />
    </div>
  );
}

export default ClientProfile

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
  const at = JSON.parse(data.accessToken);

  const urlGetAddressesService = AsterisksServices.ms_address_management + "/get-addresses/" + userId

  const decTok: any = jwt.decode(at)
  console.log(decTok)

  if (decTok!._id != userId) {
    return {
      props: {
        error: true,
        data: "Acceso no autorizado"
      }
    }
  }
  try {
    const res = await handlerGetExternal(urlGetAddressesService, at)
    console.log({ res })
    if (res.error) {
      if (res.httpStatus == 401) {
        return {
          props: {
            data: res.serverMessage,
            error: true,
            reload: true
          }
        }

      }
      return {
        props: {
          data: res.serverMessage,
          error: true
        }
      }
    }
    return {
      props: {
        data: res.responseBody,
        success: true
      }
    }
  } catch (error) {
    return {
      props: {
        data: `${error}`,
        error: true
      }
    }
  }
}