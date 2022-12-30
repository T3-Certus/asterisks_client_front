import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import { IPersonalDataComponentProps } from "../../utils";


const PersonalDataComponent: FunctionComponent<IPersonalDataComponentProps> = ({ name, surname, cellphone, email }) => {

  const router = useRouter()

  const [form, setForm] = useState({
    name: name,
    surname: surname,
  });

  const handleChange = (e: any) => {
    const { value, name } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // putData(form);
  };

  return (
    <div className="flex flex-col col-start-6 col-end-11 px-6 shadow-xl justify-evenly rounded-2xl bg-cornsilk">
      <p className="text-2xl font-Pacifico text-charleston">Datos Personales</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label>
          Nombres:
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Apellidos:{" "}
          <input
            type="text"
            name="surname"
            id="surname"
            value={form.surname}
            onChange={handleChange}
          />
        </label>

        <p>Celular: {cellphone}</p>
        <p>Correo electrónico: {email}</p>
        <input
          type="submit"
          className="px-6 py-2 shadow-xl cursor-pointer bg-green w-fit rounded-xl hover:bg-teal"
          value="Guardar"
        />
      </form>
    </div>
  );
}

export default PersonalDataComponent