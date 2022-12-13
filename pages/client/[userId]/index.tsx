import { useRouter } from "next/router";
import { useState } from "react";
import { ErrorComponent, FooterComponent, HeadLayoutComponent, NavbarComponent, PrivateComponent } from "../../../components";
import { useAuth } from "../../../utils";

export default function ClientProfile() {
  const router = useRouter();
  const userData = useAuth()
  const user = userData[0]

  // TESTEAR STATE
  let [userOption, setUserOption] = useState(1);
  console.log(userOption);

  // if (error) {
  //   return <ErrorComponent data={error} />;
  // }


  if (!user || user.id_user === 0) {
    return <PrivateComponent />;
  }

  return (
    <div>
      <HeadLayoutComponent description="" section={`userName`} />
      <NavbarComponent />
      <div className="flex flex-col w-full h-screen px-40 py-20 gap-11 bg-ivory">
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
          {/* {userOption == 1 ? (
            <PersonalData
              name={userData.name}
              surname={userData.surname}
              email={userData.email}
            />
          ) : userOption == 2 ? (
            <UserPassword />
          ) : userOption == 3 ? (
            <Address address={userData.address} />
          ) : (
            <div>null</div>
          )} */}
        </div>
      </div>

      <FooterComponent />
    </div>
  );
}