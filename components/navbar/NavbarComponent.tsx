import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../../utils";
import { LogOut } from "../../services";
import { useRouter } from "next/router";

const NavbarComponent = ({ darkNavbar = false }) => {
  const userData = useAuth()
  const user = userData[0]
  console.log(userData[0])

  const router = useRouter()

  let color = darkNavbar ? "bg-green/80" : "bg-ivory/80"
  let fontColor = darkNavbar ? "text-ivory" : "text-charleston"

  /* NAVBAR VISITOR */

  return (
    <>
      <header className={`fixed top-0 z-10 flex flex-row items-center justify-between w-full h-20 px-10 backdrop-blur-lg navbar ${fontColor} ${color}`}>
        <Link href="/">
          <a className="text-3xl font-Pacifico">Asterisks</a>
        </Link>
        <ul className="flex flex-row items-center gap-12 text-lg font-Comfortaa">
          {/* <Link href="/">
          <a className="hover:font-bold ">Inicio</a>
        </Link> */}
          <Link href="/catalogo">
            <a className=" hover:font-bold">Productos</a>
          </Link>
          {
            user.id_user != 0 ? (
              <Link href={`/client/${user.id_user}`}>
                <a className="hover:font-bold">Hola {user.user_name}</a>
              </Link>

            ) : (
              <>
                <Link href="/access/login">
                  <a className="hover:font-bold">Iniciar sesión</a>
                </Link>
                <Link href="/access/signup">
                  <a className="hover:font-bold">Registrate</a>
                </Link>

              </>

            )
          }
          {
            user.id_user != 0 ? (
              <p onClick={() => LogOut()} className="hover:font-bold hover:cursor-pointer">Cerrar sesión</p>
            ) : (<></>)
          }

          {/* <Link href="/access/signup">
        </Link> */}
          <FontAwesomeIcon onClick={() => {
            if (user.id_user != 0) {
              router.push(`/client/${user.id_user}/cart`)
            } else {
              window.alert("Debes iniciar sesión para poder ver tu carrito de compras")
            }
          }} className="text-2xl hover:text-cornsilk" icon={faCartShopping} />

        </ul>
      </header>
    </>
  );
}

export default NavbarComponent;