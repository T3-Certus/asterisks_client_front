
import { useRouter } from "next/router"
import { FooterComponent } from "../footer"
import { HeadLayoutComponent } from "../head"
import { NavbarComponent } from "../navbar"


function PrivateRoute() {

const router = useRouter()

	return (
		<div>
			<HeadLayoutComponent description="" section={"Acceso denegado"} />
      <NavbarComponent />
			<div className="flex flex-col items-center justify-center h-screen">
				<div className="flex flex-col gap-5 p-10 rounded-lg shadow-lg">

					<p className="text-lg">Acceso denegado</p>
					<button onClick={()=> router.push("/access/login")} className="p-2 rounded-lg shadow-lg bg-slate-400 hover:bg-slate-100">Iniciar sesión</button>
				</div>
			</div>
      <FooterComponent />
		</div>
	)
}

export default PrivateRoute