import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { IAuthContext } from "../interfaces";
import jwt from "jsonwebtoken";
import { AsterisksServices, config } from "../resources";
import {
  handlerGetExternal,
  handlerPostExternal,
} from "../resources/fetchHandlers";
import { useCookies } from "react-cookie";

interface IIsAuthenticated {
  authenticated: boolean;
  data: {
    message: string;
    userId?: number;
  };
}

// let value: (IAuthContext | Dispatch<SetStateAction<IAuthContext>>)[] = [];
let value: (IAuthContext)[] = [];
export const SessionContext = createContext(value);

export function AuthContext({ children }: any) {
  const [cookie, setCookie] = useCookies(["accessToken"])

  const [authUser, setAuthUser] = useState<IAuthContext>({
    id_user: 0,
    user_cellphone: "",
    user_document_number: "",
    user_document_type: "",
    user_email: "",
    user_name: "",
    user_role: "",
    user_surname: "",
  });

  useEffect(() => {
    async function loadData() {
      await isAuthenticated().then((res) => {
        if (!res.authenticated) {
          console.log(res.data);
        } else {
          console.log({res})
          const urlUserService =
            AsterisksServices.ms_user_data +
            `/users/user-data/${res.data.userId}`;
          const accessToken = localStorage.getItem("accessToken");
          setCookie("accessToken", JSON.stringify(accessToken), {
            path: "/",
            maxAge: 900,
            sameSite: true
          })
          handlerGetExternal(urlUserService, accessToken!)
            .then(({ res }) => {
              if (res.success) {
                console.log(res);
                const {responseBody} = res
                setAuthUser({
                  ...authUser,
                  id_user: responseBody.id_user,
                  user_role: responseBody.user_role.name,
                  user_name: responseBody.user_name,
                  user_surname: responseBody.user_surname,
                  user_cellphone: responseBody.user_cellphone,
                  user_email: responseBody.user_email,
                  user_document_type: responseBody.user_document_type,
                  user_document_number: responseBody.user_document_number
                })
              }
              if (res.error) {
                console.log(res);
              }
            })
            .catch((err) => console.log(err));
        }
      });
    }

    loadData().then((res)=> console.log(authUser));
  }, []);

  return (
    <SessionContext.Provider value={[authUser]}>
      {children}
    </SessionContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(SessionContext);
};

async function isAuthenticated(): Promise<IIsAuthenticated> {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken || !accessToken) {
    return {
      authenticated: false,
      data: {
        message: "Insufficents tokens",
      },
    };
  }

  try {
    // console.log(process.env.NEXT_PUBLIC_REFRESH_TOKEN_PRIVATE_KEY)
    // console.log(process.env.NEXT_PUBLIC_ACCESS_TOKEN_PRIVATE_KEY)
    const verifiedRT: any = await jwt.verify(
      refreshToken,
      process.env.NEXT_PUBLIC_REFRESH_TOKEN_PRIVATE_KEY!,
      (err, decoded) => {
        if (err) {
          throw new Error(`${err}`);
        } else {
          return decoded;
        }
      }
    );
    console.log({ verifiedRT })

    const verifiedAT: any = await jwt.verify(
      accessToken,
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_PRIVATE_KEY!, async (err, decoded: any) => {
        if (err) {
          // si el token venció
          if (err.name == 'TokenExpiredError') {
            // await newAccessTokenHandler()
            console.log("token expired")
            const url =
              AsterisksServices.ms_authentication_admin + "/generate-access";
            const body = {
              refreshToken: refreshToken,
            };

            // se genera un nuevo AT
            interface IResNewAT {
              success: boolean;
              newTokenDecoded?: number;
            }
            const newAT = await handlerPostExternal(url, body)
              .then(({ res }): IResNewAT => {
                console.log(res)
                if (res.success) {
                  localStorage.removeItem("accessToken");
                  localStorage.setItem("accessToken", res.responseBody.accessToken);
                  let token: any = jwt.decode(res.responseBody.accessToken);
                  return {
                    success: true,
                    newTokenDecoded: token,
                  };
                }
                if (res.error) {
                  return {
                    success: false,
                  };
                }
                return {
                  success: false,
                };
              })
              .catch((err) => {
                console.log(err);
              });

            // si no se genera nuevo AT
            if (!newAT || !newAT.success) {
              throw new Error("Cannot generate a new access token")
            }

            // sino
            // return {
            //   authenticated: true,
            //   data: {
            //     message: "Successfully authenticated: New access token generated",
            //     userId: newAT.userId,
            //   },
            // };
            return newAT.newTokenDecoded
          } else {
            throw new Error(`${err}`);
          }
        }else{
          // return {
          //   authenticated: true,
          //   data: {
          //     message: "Successfully authenticated",
          //     userId: decoded._id,
          //   },
          // };
          return decoded
        }
      }
    );
    console.log({ verifiedAT })


    if(!verifiedAT){
      throw new Error("Error with AT")
    }
    return{
      authenticated: true,
      data: {
        message: "Successfully authenticated",
        userId: verifiedAT._id,
      }
    }
  } catch (error) {
    return {
      authenticated: false,
      data: {
        message: `${error}`,
      },
    };
  }
}