import { NextPage } from "next";
import { useRouter } from "next/router";
import { ErrorComponent, HeadLayoutComponent } from "../../components";
import { AsterisksServices, ILoginUser, useAuth } from "../../utils";
import { handlerPostExternal } from "../../utils/resources/fetchHandlers";
import { useCookies } from "react-cookie";

const UserLogin: NextPage = () => {
	const router = useRouter();
	const userData = useAuth()
	const user = userData[0]
	console.log({ user })
	const [cookie, setCookie] = useCookies(["accessToken"])

	async function handleSubmit(e: any) {
		e.preventDefault();
		const email = e.target.elements.email.value;
		const password = e.target.elements.password.value;

		const urlService = AsterisksServices.ms_authentication_admin + "/login";
		const body: ILoginUser = {
			user_email: email,
			user_password: password,
		};

		await handlerPostExternal(urlService, body).then(({ res }) => {
			if (res.success) {
				localStorage.setItem("refreshToken", res.responseBody.refreshToken)
				localStorage.setItem("accessToken", res.responseBody.accessToken)
				setCookie("accessToken", JSON.stringify(res.responseBody.accessToken), {
					path: "/",
					maxAge: 900,
					sameSite: true
				})
				window.alert(res.serverMessage)
				router.push('/').then(() => router.reload())
			}
			if (res.error) {
				window.alert(res.serverMessage)
				router.reload()
			}
		}).catch((err) => {
			window.alert(`${err}`)
			router.reload()
		})
	}

	if (user.id_user) {
		return <ErrorComponent data={"Debes cerrar sesión antes"} />;
	}

	return (
		<div className="flex flex-col items-center justify-center w-full h-screen bg-white">
			<HeadLayoutComponent description="" section={"Inicio de sesión"} />
			<div>
				<div className="flex flex-col items-center justify-center gap-5 p-5 rounded-lg shadow-lg w-fit">
					<form onSubmit={handleSubmit} className="flex flex-col gap-5 w-fit ">
						<label className="flex gap-3 ">
							Correo electrónico
							<input
								type="email"
								name="email"
								id="email"
								required
								placeholder="Ingrese su correo"
							/>
						</label>
						<label className="flex gap-3">
							Contraseña
							<input
								type="password"
								name="password"
								id="password"
								required
								placeholder="Ingrese su contraseña"
							/>
						</label>

						<input
							className="p-2 rounded-md shadow-md cursor-pointer bg-green hover:bg-ivory"
							type="submit"
							value="Iniciar Sesión"
						/>
					</form>
					<button
						className="hover:font-bold"
						onClick={() => router.push("/access/signup")}
					>
						Quiero registrarme
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserLogin;
