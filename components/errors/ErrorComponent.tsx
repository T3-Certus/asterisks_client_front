import { FooterComponent } from "../footer"
import { HeadLayoutComponent } from "../head"
import { NavbarComponent } from "../navbar"
import { useRouter } from "next/router"

export const ErrorComponent = ({data = ""}) => {
  const router = useRouter()
  return(
    <>
        <HeadLayoutComponent section="Error" description="" />
        <NavbarComponent />
        <div className="flex flex-col items-center justify-center w-full h-screen gap-4 bg-ivory">
          <p className="text-5xl font-Pacifico text-charleston">Ha ocurrido un error</p>
          <p className="text-xl">{data} :(</p>
          
          <button className="px-4 py-1 rounded-lg bg-teal text-ivory " onClick={() => router.push("/")}>Ir al menú principal</button>
        </div>
        <FooterComponent />
      </>
  )
}