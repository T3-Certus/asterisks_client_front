import { NextPage } from "next";
import { useRouter } from "next/router";
import { ErrorComponent, HeadLayoutComponent } from "../../components";
import { AsterisksServices, IRegisterUserBody, useAuth } from "../../utils";
import { handlerPostExternal } from "../../utils/resources/fetchHandlers";

const UserSignup: NextPage = () => {
	const router = useRouter();
	const userData = useAuth()
	const user = userData[0]

	async function handleSubmit(e: any) {
		e.preventDefault();
		const email = e.target.elements.email.value;
		const password = e.target.elements.password.value;
		const name = e.target.elements.name.value;
		const surname = e.target.elements.surname.value;
		const docType = e.target.elements.docType.value
		const docNumber = e.target.elements.docNumber.value
		const cellphone = e.target.elements.cellphone.value

		const urlService = AsterisksServices.ms_authentication_admin + "/register";
		const body: IRegisterUserBody = {
			user_email: email,
			user_password: password,
			user_name: name,
			user_surname: surname,
			user_document_type: docType,
			user_document_number: docNumber,
			user_cellphone: cellphone
		}

		await handlerPostExternal(urlService, body).then((res) => {
			if (res.success) {
				window.alert(res.serverMessage)
				router.push('/access/login')
			}
			if (res.error) {
				window.alert(res.serverMessage)
				router.reload()
			}
		}).catch(err => {
			window.alert(`${err}`)
			router.reload()
		})
	}

	if (user.id_user) {
		return <ErrorComponent data={"Debes cerrar sesión antes"} />;
	}

	return (
		<div className="flex flex-col items-center justify-center w-full h-screen bg-white">
			<HeadLayoutComponent description="" section={"Registro"} />
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
								minLength={8}
								maxLength={20}
								required
								placeholder="Ingrese su contraseña"
							/>
						</label>
						<label className="flex gap-3">
							Nombre
							<input
								type="text"
								name="name"
								id="name"
								required
								placeholder="Ingrese su nombre"
							/>
						</label>
						<label className="flex gap-3">
							Apellido
							<input
								type="text"
								name="surname"
								id="surname"
								required
								placeholder="Ingrese su apellido"
							/>
						</label>
						<label className="flex gap-3">
							Tipo de documento{" "}
							<select name="docType" id="docType" required>
								<option value="">Seleccione un tipo</option>{" "}
								<option value="DNI">DNI</option>
								<option value="CEX">Carnet de extranjería</option>
							</select>
						</label>
						<label className="flex gap-3">
							Número de documento{" "}
							<input
								type="text"
								name="docNumber"
								id="docNumber"
								required
								placeholder="Ingrese su documento"
								minLength={8}
							/>
						</label>
						<label className="flex gap-3">
							Celular{" "}
							<input
								type="text"
								name="cellphone"
								id="cellphone"
								required
								minLength={7}
								placeholder="Ingrese su celular"
							/>
						</label>

						<input
							className="p-2 rounded-md shadow-md cursor-pointer bg-green hover:bg-ivory"
							type="submit"
							value="Registrate"
						/>
					</form>
					<button
						className="hover:font-bold"
						onClick={() => router.push("/access/login")}
					>
						Ya tengo una cuenta
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserSignup;
