import { AsterisksServices, handlerDeleteExternal } from "../../utils";

export async function LogOut() {
  const urlService = AsterisksServices.ms_authentication_admin + "/logout";
  const body = {
    refreshToken: localStorage.getItem("refreshToken"),
  };

  await handlerDeleteExternal(urlService, body)
    .then(({ res }) => {
      if (res.error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.alert("Ocurrió un error");
        window.location.replace('/')
      }
      if (res.success) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.alert("Sesión cerrada");
        window.location.replace('/')
      }
    })
    .catch((err) => {
      window.alert(`${err}`);
      window.location.replace('/')
    });
}
