import Link from "next/link";
const NavbarComponent = () => {
  /* NAVBAR VISITOR */

  return (
    <header className="fixed top-0 z-10 flex flex-row items-center justify-between w-full h-20 px-10 backdrop-blur-lg navbar bg-ivory/80 ">
      <Link href="/">
        <a className="text-3xl font-Pacifico text-charleston">Glorious</a>
      </Link>
      <ul className="flex flex-row gap-12 font-Comfortaa">
        <Link href="/">
          <a className="hover:font-bold ">Inicio</a>
        </Link>
        <Link href="/catalogo">
          <a className="hover:font-bold ">Productos</a>
        </Link>
        <Link href="/access/login">
          <a className="hover:font-bold">Iniciar sesión</a>
        </Link>

        <Link href="/access/signup">
          <a className="hover:font-bold ">Registro</a>
        </Link>
      </ul>
    </header>
  );
}

export default NavbarComponent;